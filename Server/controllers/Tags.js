 const Tags = require ("../models/tags");


 exports.createTag = async (req, res) => {
    try{
        const {name, description} = req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //create entry in db
        const tagDetails = await Tags.create({
            name : name,
            description : description,
        });
        console.log(tagDetails);

        return res.status(200).json({
            success : true,
            message : "Tag created successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
    
 }

 //get all atg handler function

 exports.showAllTags = async (req, res) => {
    try{
        const allTags = await Tags.find({},{name : true, description : true});
    res.status(200).json({
        success : true,
        message : "All Tags returned successfully",
        allTags,
    });
    }
    catch(error){
        return res.status(400).json({
            success : false,
            message : error.message,
        })
    }

    
 }