 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
 const bcrypt = require ("bcrypt");


//reset Password
 exports.resetPassword = async (req, res) => {
 try {
      //get email from request body
    const email = req.body.email;

    //check user for email, email validation
    const user = await User.findOne({email : email});
    if (!user){
      return res.json({
         success : false,
         message : "Your Email is not registered with us"
      })
    }


    //generate token
    const token = crypto.randomUUID();
    
    //update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate({email : email},{
      token : token,
      resetPasswordExpires : Date.now() + 5*60*1000,
    },
    {new : true}

    );

    // create url

    const url =`https://localhost:3000/update-password/${token}`

    // send mail containing url
    await mailSender(email,
                  "Password reset Link",
                  `Password Reset Link : ${url}`
    );

    //return response
    return res.json({
      success : true,
      message : "Email sent successfully, Please check email and change pwd"
    })

 }
 catch (error){
      console.log(error);
      return res.status (500).json ({
         success : false,
         message : "Something went wrong while sending reset pwd mail"
      })
 }

    
 }

 // Reset Password 

 exports.resetPassword = async (req, res) => {
   
  try{
       //data fetch
   const{password, confirmPassword, token} = req.body;

   //validate
   if (password != confirmPassword){
      return res.json({
         success : false,
         message : "Password not matching",
      })
   }
   
   // get user entry from db using token
   const userDetail = await User.findOne({token : token});

   // token time check
   if (!userDetail){
      return res.json({
         success : false,
         message : 'Token is invalid',
      })
   }

   if (userDetail.resetPasswordExpires > Date.now()){
      return res.json({
         success : false,
         message : " Token is expired, Please generate new token "
      })
   }

   // hash pwd
   const hashedPassword = await bcrypt.hash(password , 10);

   //password update 
   await User.findOneAndUpdate(
      {token : token},
      {password : hashedPassword},
      {new : true}
   );

   //return response

   return res.status(500).json ({
      success : true,
      message : "Password reset successfully"
   })
   
  }
  catch(error){
      console.log(error);
      return res.status(500).json({
         success : false,
         message : "Something went wrong while sending reset password mail"
      })
  }
 }