 const { default: mongoose } = require("mongoose");
const {instance} = require ("../config/razorpay");
 const Course = require ("../models/Course");
 const user = require ("../models/User");
 const mailSender = require ("../utils/mailSender");

 exports.capturPayment = async (req, res) => {

    const{course_id} = req.body;
    const user_id = req.user.id;

    //Validation 

    //valid course id
    if(!course_id){
        return res.json({
            success : false,
            message : "Please enter valid course id",
        })
    };
    //valid course detail
    let course;

    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success : false,
                message : "could not find the course"
            });
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success : false,
                message : "Student is already enrolled"
            });
        }


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }

    //order create successfully
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount * 100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes :{
            courseId : course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        //return response updated after   
        return res.status(200).json({
            success : true,
            courseName : course.courseName,
            courseDescription : course.courseDescription,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Could not initiate  order"
        })

    }
    
 }

 //be updated in payment.js
 
 // Some update in payment.js
    exports.verifySignature = async (req, res) => {

        const webhooksecret = "1234567890";
        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256", webhooksecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (digest === signature) {
           console.log("Valid signature");

           const { courseId, userId } = req.body.payload.payment.entity.notes;

           try{
            //fulfill the order

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id : courseId},
                {$push : {studentsEnrolled : userId}},
                {new : true},);

                if(!enrolledCourse){
                    return res.status(500).json({
                        success : false,
                        message : "Could not enroll the student"
                    });
                }
                console.log(enrolledCourse);

            // find the student and add the course to their list enrolled course me
            const enrolledStudent = await user.findByIdAndUpdate(
                {_id : userId},
                {$push : {courses : courseId}},
                {new : true},);

                console.log(enrolledStudent);
                

                //send mail for enrollment confirmation
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations on enrolling in the course!",
                    "Course Enrollment Confirmation"
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success : true,
                    message : "Signature verified and student enrolled successfully",
                });

           }
           catch(error){
            console.log(error);
            return res.status(500).json({
                success : false,
                message : error.message
            });       
        }

        
    }
    else{
        return res.status(400).json({
            success : false,
            message : "Invalid request"
        });
    }
}
