const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if(!token){
        throw new Error("Token not valid!!");
    }
    const decodedMessge = await jwt.verify(token, "Dev@Tinder$790");
    const { _id } = decodedMessge;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();

  } catch (error) {
        res.status(400).send("ERROR: "+error.message);
  }
};

module.exports = {
    userAuth,
}
