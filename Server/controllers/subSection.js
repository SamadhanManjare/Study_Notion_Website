const subSection = require ("../models/SubSection");
const section = require ("../models/Section");
const { imageUploadtoCloudinary } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

exports.createSubSection = async (req, res) => {

    try{
        //fetch data from req body
        const{sectionId, title, timeDuration, Description} = req.body;

        //extract file video
        const video = req.files.videoFile;

        //validation 
        if(!sectionId || !title || !timeDuration || !Description){
            return res.status(400).json({
                success : false,
                message : "All fields are required",

            })
        }

        //upload video to cloudinary
        const uploadDetails = await imageUploadtoCloudinary(video, process.env.FOLDER_NAME);

        //create a subsection
        const createSubSection = await subSection.create({
            title : title,
            timeDuration : timeDuration,
            Description : Description,
            videoUrl : uploadDetails.secure_url,

        });

        //update section with this subsection object ID
        const updatedSection = await Section.findByIdAndUpdate({id : sectionId},
                                                    {
                                                        $push :{
                                                            subSection : SubSectionDetails._id,
                                                        }
                                                    },{new : true}
        );

        //log updated section here, after adding populate query
        //return response
        return res.status(200).json({
            success : true,
            message : " Sub Section created successfully",
            updatedSection,
        })

    }
    catch{
         console.log(error);
        return res.status(500).json({
            success : false,
            message : "Unable to update section, please try again ",
            error : error.message,
        }); 
    }
    
}