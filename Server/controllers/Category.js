const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body; 
    if(!name){
        return res.status(400).json({
            success : false,
            message : "Category name is required",
        });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.showAllCategories = async (req, res) => {
    try{
        const categories = await Category.find({},{name:true, description:true});
        return res.status(200).json({
            success : true,
            message : "All categories fetched successfully",
            data : allcategories,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//category page details
exports.categoryPageDetails = async (req,res) => {
    try{
        //get category id 
        // get category id from req body
        const {categoryId} = req.body;
        //get course for specified category
        const selectedCategory = await Category.findById(categoryId)
        .populate("courses").exec();

        //validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        // get courses for the specified category
        //get different categories
        const differentCategories = await category.find({
            
            _id : {$ne : categoryId},
        }).populate("courses").exec();

        //get top selling courses
        const topSellingCourses = await Course.find({category : categoryId})
        .sort({studentsEnrolled : -1})
        .limit(10)
        .exec();

        //return response
        return res.status(200).json({
            success : true,
            message : "Category page details fetched successfully",
            data : {
                selectedCategory,
                differentCategories,
                topSellingCourses,
            },
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}