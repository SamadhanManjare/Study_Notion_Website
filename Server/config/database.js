const mongoose = require("mongoose");
require("mongoose").config;

 exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        usenewurlparser : true,
        useunifiedTopology : true,
    })
    .then( () => console.log("Mongo DB connected Successfully"))
    .catch( (error) => {
            console.log("DB connection failed");
            console.log(error);
            process.exit(1);
    } )
 };