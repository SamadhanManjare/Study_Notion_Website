const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
   email : {
    type : String,
    required : true,

   },
   otp : {
    type : String,
    required : true,
   },
   createdAt :{
    type : Date,
    default : Date.now(),
    expires : 5*60,
   },

});

// A function to send emails otp
// This function will be called to send the OTP to the user's email

async function sendEmailVerification(email, otp) {
      try{
            const mailResponse = await mailsender(email, "Verification Email from Study Notion", otp);
            console.log("Email sent successfully", mailResponse);
      }
      catch(error){
               console.log("error occured while sending mail",error);
               throw error;
      }
   
}

OTPSchema.pre("save ", async function (next) {
         await sendEmailVerification(this.email, this.otp);
         next(); 
})


module.exports = mongoose.model("OTP", OTPSchema);