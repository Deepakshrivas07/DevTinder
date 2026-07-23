const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

//here userAuth middleware act as a authentication ..
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;

      //this is also fine but as fromUserId and toUserId is more Related to Schema Level we should do this their.
      //go to connectionRequestSchema to see .pre middleware

      // if(ConnectionRequestModel.fromUserId.equals(toUserId)){
      //   throw new Error("Cant send request to your self😒")
      // }

      //checking whether userid to whom we are sending exist or not in your database 🤣.
      const toUser = await User.findById(toUserId);
      if(!toUser){
          throw new Error("User Don't exist in Database")
      }

      //only valid status should be sent not accept or reject in this api.
      const allowedStatus = ["ignored","interested"]
      if(!allowedStatus.includes(status)){
        throw new Error("Invalid status types :  "+status);
      }
      // to avoid sending connection request *AGAIN 😂 
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
          //this is or conditon formate in mongoose it checks in DB of connection by checking userid's and if connection exist it throws error.
          //there is $and also like $or
          $or:[
            //user1 to user2
            {fromUserId,toUserId},
            ///checks for user2 to user1 (reversal)
            {fromUserId:toUserId,toUserId:fromUserId}
          ]
        });
        if(existingConnectionRequest){
          throw new Error("Connection Request is already Exist!!");
        }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:"Connection Request Sent Successfully!",
        data,
      });
    } catch (error) {
      res.status(400).json({
        message:"ERROR : "+error,
      })
    }
  },
);

module.exports = requestRouter;
