const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validateSignUpData, validateLogInData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const { decapsulate } = require("node:crypto");
const { transcode } = require("node:buffer");
const { userAuth } = require("./middlewares/auth");

const app = express();
//directly using app.use(function) means it will be applied to all the routes and if we want to apply it to specific route then we can use it like this app.get("/profile",userAuth,async (req,res)=>{...}) so here userAuth middleware will be applied to only /profile route.
app.use(express.json());//this is a inbuild middleware to convert the json formate to js obj.using this for req.body as node.js dont understands json formate so it will return undefine and to prevent from this we are using this middleware.

app.use(cookieParser()); 

app.post("/signup", async (req, res) => {
  // this was for learning perpose(static methord)
  // const userObj = {

  //     firstName:"Deepak",
  //     lastName:"shrivas",
  //     emailId:"deepakshrivas442@gmail.com",
  //     password:"deepak@123",
  // }
  //new instance of User Model

  const { firstName, lastName, emailId, password } = req.body;
  try {
    //validation of data
    validateSignUpData(req);
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //real methord by giving req.body to User model instance as it contain json data and middleware converts into js obj.
    // const user = new User(req.body);

    //but never EVER TRUST req.body so real methord is this instead of new user(reqq.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    //this will save and send data to database
    await user.save();
    res.send("User Data Saved successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //validate Data.
    validateLogInData(req);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("INVALID CRADENTIAL");  
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID CRADENTIAL");
    } else {
      //creating web token after ispasswordvalidation ..
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790");
      //adding token to cookie  and send it to the user so that when user make a req for /profile etc server can authenticate
      res.cookie("token", token);
      res.status(200).send("Login Successfully.");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
//here userAuth middleware act as a authentication ..
app.get("/profile",userAuth,async (req, res) => {
  try { 
    const user = req.user;
    res.send(user);
  } catch (error) { 
    res.status(400).send("ERROR: " + error.message);
  }
});

app
  .route("/user")
  .get(async (req, res) => {
    const userEmail = req.body.emailId;
    try {
      const user = await User.findOne({ emailId: userEmail });
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.send(user);
      }
    } catch (error) {
      res.status(400).send("something went wrong");
    }
  })
  .delete(async (req, res) => {
    const UserId = req.body._id;
    try {
      const user = await User.findByIdAndDelete(UserId); // findByIdAndDelete(id) is a sorthand for findOneAndDelete({_id:id}) and it will return the deleted user if found and deleted otherwise it will return null. 
      res.send("Deleted User successfully");
    } catch (error) {
      res.status(400).send("something went wrong");
    }
  });
app.patch("/user/:userId", async (req, res) => {
  const UserId = req.params?.userId;
  const data = req.body;
  try {
    const UPDATEALLOWED = ["password", "gender", "age", "skills", "photoUrl"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      UPDATEALLOWED.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    //findByIdAndupdate(id,update,options). it holds 3 parameters id,update and options. id is the id of the user to be updated, update is the data to be updated and options is an object which can have various options like returnDocument,runValidators etc. returnDocument can have two values "before" and "after". if it is "before" then it will return the document before update and if it is "after" then it will return the document after update. runValidators is a boolean value which if true then it will run the validators defined in the schema for the fields being updated.
    const user = await User.findByIdAndUpdate(UserId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      await user.save();
      res.json({
        message: "User updated successfully",
        user,
      });
    }
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

//Feed api - GET /feed - gets all the users from the database.
// mongoose model(i.e User here..) has a built-in methods like find, findOne,findById,findByIdAndUpdate,findByIdAndDelete etc. and these methods are used to perform CRUD operations on the database. 
// You can go to mongoose documentation to know more about these methods.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

//we are listening to the server after connecting to the database (best practice).
connectDB()
  .then(() => {
    console.log("Database connection establishted");
    app.listen(3000, () => {
      console.log("started server: 3000");
    });
  })
  .catch((err) => {
    console.error("Error occured");
  });
