 const jwt = require("jsonwebtoken");
 require ("dotenv").config();
 const User = require ('../models/User');

 exports.auth = async (req, res) => {
    try {
      // Extract token
      const token = req.cookies.token
                     || req.body.token
                     || req.header('Authorisation').replace('Bearer','');


                     if(!token) {
                        return res.status(401).json({
                           success : false,
                           message : "Token is missing"
                        })
                     }

         // Verify token
         try{
               const decode = jwt.verify(token, process.env.JWT_SECRET);
               console.log(decode);
               req.User =decode;
         }
         catch(error){
               return res.status(401).json({
                  success : false,
                  message : "token invalid",
               }) 
         }
         next();
    }
    catch (error){
        return res.status(401).json({
         success : false,
         message : "something went wrong while validating the token"
        })
    }
 }

 /// isStudent

 exports.isStudent = async (req, res, next) => {
      try{
            if(req.User.accountType !== "Student"){
               return res.status(401).json({
                  success : false,
                  message : "This is a protected route for Student only"
               })
            }
            next();
      }
      catch(error){
            return res.status(500).json({
               success : false,
               message :"User role cannot be verified , Pleae try again"
            })
      }
 }

        // isInstructor
 exports.isInstructor = async (req, res, next) => {
      try{
            if(req.User.accountType !== "Instructor"){
               return res.status(401).json({
                  success : false,
                  message : "This is a protected route for Instructor only"
               })
            }
            next();
      }
      catch(error){
            return res.status(500).json({
               success : false,
               message :"User role cannot be verified , Pleae try again"
            })
      }
 }

         //isAdmin
 exports.isAdmin = async (req, res, next) => {
      try{
            if(req.User.accountType !== "Admin"){
               return res.status(401).json({
                  success : false,
                  message : "This is a protected route for Admin only"
               })
            }
            next();
      }
      catch(error){
            return res.status(500).json({
               success : false,
               message :"User role cannot be verified , Pleae try again"
            })
      }
 }