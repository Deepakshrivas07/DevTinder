const express = require('express')
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

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

module.exports = profileRouter;