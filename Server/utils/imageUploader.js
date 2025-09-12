const cloudinary = require('cloudinary').v2

exports.imageUploadtoCloudinary = async (file, height,folder, quality) => {
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
    
}