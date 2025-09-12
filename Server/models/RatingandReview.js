const mongoose = require("mongoose");

const ratingandreview = new mongoose.schema ({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    rating : {
        type : Number,
        required : true,
    },
    review : {
        type : String,
        required : true,
    }


});

module.exports = mongoose.model("RatingandReview", ratingandreview);