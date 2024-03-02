import express from "express";
import { isAdmin, requireSigin } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productByCategoryController,
  braintreePaymentController,
  braintreeTokenController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
//router object
const router = express.Router();

//Routes
//Create-Product
router.post(
  "/create-product",
  requireSigin,
  isAdmin,
  //to get pictures
  formidable(),
  createProductController
);

//Update-Product
router.put(
  "/update-product/:pid",
  requireSigin,
  isAdmin,
  formidable(),
  updateProductController
);
//Get-Product
router.get("/get-product", getAllProductController);

//Get-Single Product
router.get("/get-product/:slug", getSingleProductController);

////Get-Product-Product
router.get("/product-photo/:pid", productPhotoController);

////Delete-Product-Product
router.delete("/delete-product/:pid", deleteProductController);

////Product-Filter
router.post("/product-filters", productFilterController);

////product count total
router.get("/product-count", productCountController);

//pagination product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//smiliar product
router.get("/related-product/:pid/:cid", relatedProductController);

//product by category
router.get("/product-category/:slug", productByCategoryController);

///////////////////payment Gateway verify the account paypal through token //////////////////
router.get("/braintree/token", braintreeTokenController);

//payment
router.post("/braintree/payment", requireSigin, braintreePaymentController);

export default router;
