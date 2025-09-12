 const User = require ("../models/User");
 const OTP = require ("../models/OTP");
 const otpGenerator = require ("otp-generator");
const User = require("../models/User");
const bcrypt = require ('bcrypt');



 // Send OTP Function

 exports.sendOTP = async (req , res) =>{
    try{
        //fetch email from request body
        const {email} = req.body;

            //check if user already exist
            const checkUserPresent = await User.findOne({email});

            //if user already exist , then return response
            if (checkUserPresent){
                return res.status(401).json({
                    success : false,
                    message : "User already exist",
                })
            }
            //Generate OTP

            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false,
            });
            console.log("otp generated : ", otp);

            //check unique otp or not 
            let result = await OTP.findOne({otp : otp});

            while(result){
                otp = otpGenerator(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false,
            }); 
            result = await OTP.findOne({otp : otp});
            }

            const otpPayload = {email, otp};

            //create entry for otp in DB
            const otpBody = await OTP.create(otpPayload);
            console.log(otpPayload);

            //return response successfull
            res.status(200).json ({
                success : true,
                message : "OTP send successfully",
                otp,
            })
            


    }
    catch(error){
        console.log(error);
        res.status(500).json ({
            success : false,
            message : error.message,
        })
    }
 };

 //SIGN UP Function

 exports.signUp = async (req, res) => {

   try {
         const {firstName,
    lastName,
    email,
    password, 
    confirmPassword,
    accountType,
    contactNumber, 
    otp} = req.body;

        // Validate Data
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
    return res.status(403).json({
        success : false,
        message : "All fields are required",
    })
 }

 // Match 2 Passwords

    if (password !== confirmPassword){
        return res.status(400).json({
        success : false,
        message : "password and confirm password donot match, please try again",
    })
 
    }
    // Check user already exist
    const existingUser = await User.findOne({email});
    if (existingUser){
        return res.status(400).json({
        success : false,
        message : "User is already registered",
        });
    }

    // Find most recent otp stored for user
    const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    if(recentOtp.length == 0){
        return res.status(400).json({
        success : false,
        message : "OTP found",
    })
}
    else if(otp !== recentOtp.otp){
        return res.status(400).json({
        success : false,
        message : "Invalid OTP",
    })
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Entry create in DB
    const profileDetail = await Profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null,

    })

    const User = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword, 
        
        accountType,
         additionalDetails:profileDetails._id,
         image : `https://api.dicebar.com/5.x/initials/svg?seed=${firstname} ${lastname}`,
    })

    // return Response

    return res.status(200).json({
        success : true,
        message : 'User registered Successfully',
        User,
    })
   }
   catch (error){
    console.log(error);
    return res.status(500).json({
        success : false,
        message : "User cannot be registered, Please try again",
    })

   }
 };

 exports.login = async (req, res) => {
    try{
        // Get data from req body
        const User = {email, password} = req.body;

        //Data Valodation
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : 'All fields are required',
            })
        }

        // check user exist or not
        // checked that user is not null
        const user = await User.findOne({email}).populate({additionalDetails});
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User is not registered , Please signup"
            })

        }
        if (await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType,

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expires : "2h",
            });
            user.token = token;
            user.password = undefined;

                //create cookies and send response
            const options = {
                expires : new Date (Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }
            res.cookie("token", token , options).status(200).json({
                success : true,
                token, 
                user,
                message : "Logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success : false,
                message : "password incorrect"
            })
        }
            
            

    }
    catch (error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Login Failure, Please try again"
        })
    }
 };

 // Change Password

 exports.changePassword = async (req,res) => {
    //
 }
 
 




 