const Course = require ("../models/Course");
const Tags = require("../models/tags");
const User = require ("../models/User");
const {imageUploadtoCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req,res) => {

    try{

        const {courseName, courseDescription, Whatyouwilllearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation 
        if(!courseName || !courseDescription || !Whatyouwilllearn || !price || !tag){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }

        //check for instructor
        const userId = req.User.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details :", instructorDetails);


        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "Instructor Details are not found "
            })
        }

        //Check given tag is valid or not
        const tagDetails = await Tags.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success : false,
                message : "Tag details not found"
            })
        }

        //Upload image to cloudinary
        const thumbnailImage = await imageUploadtoCloudinary(thumbnail, process.env.FOLDER_NAME);

         //create an entry for create course
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor,
        whatyouwilllearn,
        tags : tagDetails._id,
        price,
        thumbnail : thumbnailImage.secure_url,
    })

    //add new course to the user schema of instructor
    await User.findByIdAndUpdate(
        {
            _id : instructorDetails._id
        },
        {
            $push :{
                courses : newCourse._id,
            }
        },
        {new : true},
    )

    //Update the tag ka schema
    // todo : 

    //return response
    return res.status(200).json (
        {
            success : true,
            message : "Course created successfully",
            data : newCourse,
        }
    )
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            

            success : false,
            message : "Failed to create a course",
            error : error.message,
        })
    }
    
   
}

//get all courses handler function

exports.showAllCourses = async (req,res) => {
    try{
         const allCourses = await Course.find({}, {
            courseName : true,
           price : true,
           thumbnail : true,
           instructor : true,
           ratingsandreviews : true,
           studentsEnrolled : true,

         }).populate("instructor").exec();
    }
    catch(error){
         console.log(error);
         return res.status(500).json({
            success : false,
            message : "cannot fetch course data",
            error : error.message,
         })
    }
}

// get all course detail
exports.getCourseDetails = async (req,res) => {
    try{
        // get id
        const courseId = req.body;
        //find course detail
        const courseDetails = await Course.find(
            {id : courseId}
        ).populate ({
            path : "instructor",
            populate : {
                path : "additionalDetails",
        },
    }).populate("category")
    .populate("ratingsandreviews")
    .populate({
        path: "courseContent",
        populate :{
            path : "subSection",
        }
    }).exec();

    //validation
    if(!courseDetails){
        return res.status(404).json({
            success : false,
            message : `Course not found with ${courseId}`
        });

        //return response
        return res.status(404).json({
            success : true,
            message : "Course Detail fetched successfully",
            data : courseDetails,   
        });
    }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to fetch course details",
            error : error.message,
        })
    }
}