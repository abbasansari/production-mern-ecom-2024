import express from "express";
import { isAdmin, requireSigin } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategories,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//Routes
//Create-Category
router.post(
  "/create-category",
  requireSigin,
  isAdmin,
  createCategoryController
);

//Update-Category
router.put(
  "/update-category/:id",
  requireSigin,
  isAdmin,
  updateCategoryController
);

//getAll-Category
router.get("/get-category", getAllCategories);

//Single-Category
router.get("/single-category/:slug", singleCategoryController);

//Delete-Category
router.delete(
  "/delete-category/:id",
  requireSigin,
  isAdmin,
  deleteCategoryController
);

export default router;
