const express = require('express')
const profileRouter = express.Router();
const User = require('../models/user')
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validation');

//here userAuth middleware act as a authentication ..
profileRouter.get("/profile/view",userAuth,async (req, res) => {
  try { 
    //req.user is set in the *userAuth middleware after finding the user from the database using the _id from the decoded token. So we can use req.user here to get the user data.
    const user = req.user;
    res.send(user); 
  } catch (error) { 
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch('/profile/edit',userAuth, async(req,res)=>{
  const data = req.body; 
  try {
    if(!validateEditProfileData(req)){
      throw new Error("INVALID EDIT REQUEST!!")
    }
    const userId = req.id
    const  user = await User.findByIdAndUpdate(userId,data,{
      returnDocument:"after",
      runValidators:true,
    })
    await user.save();
    res.status(200).send("Edited successfully")
  } catch (error) {
    res.send("ERROR: " + error.message)
  }
})

module.exports = profileRouter;