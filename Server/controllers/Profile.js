 const profile = require("../models/Profile");
 const User = require("../models/User");

 exports.updateProfile = async (req, res) => {

    try{
        //get data
        const {dateOfBirth="", about = "", contactNumber , gender} = req.body;
        //get userID
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return req.status(400).json({
                success : false,
                message : "All fields are required"
            });
        }
        //find profile 
        const userDetails = await User.findByID(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //  return response
        return res.status(200).json({
            success : true,
            message : "Profile updated successfully",
            profileDetails,
        })


    }
    catch(error){

        return res.status(500).json({
            success : false,
            error : error.message,
        })
    }
    
 }

 // delete account

 exports.deleteAccount = async (req, res) => {

    try{
        //get id
        const id = req.user.id;

        //validation
        const userDetails = await user.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User not found",
            })
        }

        //delete profile
        await Profile.findByIdandDelete({_id:userDetails.additionalDetails});

        //delete user
        await user.findByIdandDelete({_id : id});

        //unenroll user from all unenrolled courses

        //return response
        return res.status(200).json({
            success : true,
            message : "Account deleted successfully",
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User cannot be deleted successfully",
        })

    }
    
 }

 exports.getAllUserDetails = async (req, res) => {

    try{

        const id = get.user.id;

        //validation and get all user details
        const userDetails = await user.findByID(id).populate("additionalDetails").exec();

        //return response
        return res.status(500).json({
            success : true,
            message : "User data fetched successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        })

    }
    
 }