const Section = require("../models/Section");
const Course = require ("../models/Course");

exports.createSection = async (req,res) => {
    try{
        //data fetch
        const {sectioName , CourseId} = req.body;
        //data validation
        if(!sectioName || !CourseId){
            return res.status(400).json({
                success : false,
                message : "Missing Properties",
            })
        }
        //create section 
        const newSection = await Section.create({sectionName});

        //update course wwwith section update id

        const updateCourseDetail = await Course.findByIdAndUpdate( CourseId,
            {
                $push : {
                    courseContent : newSection._id,
                }
            },
            {new : true}
        );

        //use populate to replace sections/subsections both in the updated coursedetails

        //return response
        return res.status(200).json({
            success : true,
            message : "Section created successfully",
            updateCourseDetail,
        });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Section is not created ",
            error : error.message,
        })

    }
    
}

exports.updateSection = async (req, res) => {

    try{
        //data input
        const{sectionName, sectionId} = req.body;

        //data validation
        if(!sectioName || !sectionId){
            return res.status(400).json({
                success : false,
                message : "Missing Properties",
            })
        }

        //update section 
        const updateSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new : true});

        //return response
        return res.status(200).json({
            success : true,
            message : "Section updated successfully",
            updateCourseDetail,
        });
    }
    catch(error){
         console.log(error);
        return res.status(500).json({
            success : false,
            message : "Unable to update section, please try again ",
            error : error.message,
        });
    }
    
}

// Delete section

exports.deleteSection = async (req, res) => {

    try{
        //get ID assuming that we are sending ID in params
        const {sectionId} = req.body;

        //use findByIdandDelete
        await section.findByIdAndUpdate(sectionId);

        //return response
        return res.status(200).json({
            success : true,
            message : "Section Deleted Successfully",
        })
    }
    catch(error){
       console.log(error);
        return res.status(500).json({
            success : false,
            message : "Unable to update section, please try again ",
            error : error.message,
        });     
    }
    
}