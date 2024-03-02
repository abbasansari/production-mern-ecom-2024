import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    //destructuring the name
    const { name } = req.body;
    //validation
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    //checking if category already exist
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: true, message: "Category Already Exist" });
    }
    //saving the category if validation passes new categoryModel({name,slug:slugify(name)})
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    return res
      .status(201)
      .send({ success: true, message: "New Category Created", category });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category!!",
    });
  }
};

//updateCategoryController
export const updateCategoryController = async (req, res) => {
  try {
    //destructuring
    const { name } = req.body;
    const { id } = req.params;
    //updating and in 3rd parameter we need to provide new at time of updating
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//getAllCategories controller

export const getAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res
      .status(200)
      .send({ success: true, message: "All Categories List", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching all Categories ",
      error,
    });
  }
};

//singleCategoryController

export const singleCategoryController = async (req, res) => {
  try {
    const singleCategory = await categoryModel.findOne({
      slug: req.params.slug,
    });
    res
      .status(200)
      .send({ success: true, message: "Got single category ", singleCategory });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting single category",
      error,
    });
  }
};

//deleteCategoryController
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryDeleted = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
      categoryDeleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Category deleted successfully",
      error,
    });
  }
};
