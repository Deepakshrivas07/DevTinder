const validator = require("validator");
const express = require("express");

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
         throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Keep password Strong");
    }
};
const validateLogInData = (req)=>{
    const {emailId}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid E-mail");
    }
}
module.exports={
    validateSignUpData,
    validateLogInData
}