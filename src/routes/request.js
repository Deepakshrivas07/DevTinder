const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/auth");

//here userAuth middleware act as a authentication ..
requestRouter.post('/sentConnectionRequest',userAuth,(req,res)=>{
  console.log("Sending connection Request")
  const user = req.user
  res.send(user.firstName + " sent you the request.")
})

module.exports = requestRouter;
