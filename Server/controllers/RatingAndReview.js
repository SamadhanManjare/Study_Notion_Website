 const RatingandReview = require("../models/RatingandReview");
 const Course = require("../models/Course");
const e = require("express");

 //create rating
 exports.createRating = async (req,res) => {
    try{
        //get user id
        const userId = req.user.id;

        //fetch data from requet body
        const {courseId, rating, review} = req.body;
        //check if user is enrolled or not
        const course = await Course.findOne({_id : courseId, studentsEnrolled : {$eleMatch : { $eq : userId}}});
        if(!course){
            return res.status(404).json({
                success : false,
                message : "Student is not enrolled in this course",
            });
        }
        //check user has already given review or not
        const alreadyReviewed = await RatingandReview.findOne({user : userId, course : courseId});
        if(alreadyReviewed){
            return res.status(400).json({
                success : false,
                message : "You have already reviewed this course",
            });
        }
        //create rating and review
        const ratingReview = await RatingandReview.create({
            user : userId,
            course : courseId,
            rating,
            review
        });
        return res.status(201).json({
            success : true,
            message : "Rating and review created successfully",
            data : ratingReview
        });

        //update course rating
        await Course.findByIdAndUpdate({_id : courseId}, 
           {
            $push : {RatingandReview : ratingReview._id},

           },
         {new : true});
         console.log(updatedCourseDetails);

         //return response
         return res.status(200).json({
             success : true,
             message : "Course rating updated successfully",
             ratingReview,
         });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to create rating",
            error : error.message,
        })
    }
}

//get average rating of a course
exports.getAverageRating = async (req,res) => {
    try{
        //get course id from params
        const courseId = req.body.courseId;
        //calculate average rating using aggregation
        const result = await RatingandReview.aggregate([
            {$match : {course : new mongoose.Types.ObjectId(courseId)} },
            {
                $group : { _id : null, averageRating : {$avg : "$rating"}, }
            }
        ]);

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success : true,
                message : "Average rating fetched successfully",
                averageRating : result[0].averageRating,
            });

           
            }
             //return response
            return res.status(200).json({               
                success : true,
                message : "Average rating fetched successfully",
                averageRating : 0
                
            });
        
        
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to get average rating",
            error : error.message,
        })
    }
}

//get all ratings and reviews of a course
exports.getAllRatingAndReview = async (req,res) => {
    try{
        //get course id from params

        //fetch all ratings and reviews of a course
        const allratingAndReviews = await RatingandReview.find({})
                            .sort({rating : "desc"})
                            .populate({
                                path : "user",
                                select : "firstName lastName email image",
                            })
                            .populate({
                                path : "course",
                                select : "courseName",
                            })
                            .exec();
        //return response
        return res.status(200).json({
            success : true,
            message : " ratings and reviews created successfully",
            ratingReview,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to get all ratings and reviews",
            error : error.message,
        });
    }  
} 