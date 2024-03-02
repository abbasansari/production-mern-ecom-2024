import express from "express";
import {
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusChangeController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSigin } from "../middlewares/authMiddleware.js";

//router object // if define routes in separate file routing object lgta h bhai
const router = express.Router();

//routing
//REFISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//FORGET PASSWORD || METHOD POST
router.post("/forgotpassword", forgotPasswordController);

//test route
router.get("/test", requireSigin, isAdmin, testController);

//protected  user routes
router.get("/userauth", requireSigin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//protected  admin routes
router.get("/admin-auth", requireSigin, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Updat UserProfile Croute
router.put("/profile", requireSigin, updateProfileController);

//Order of users
router.get("/orders", requireSigin, getOrdersController);

//admin All Orders
router.get("/all-orders", requireSigin, isAdmin, getAllOrdersController);

//orders status change
router.put(
  "/order-status/:orderId",
  requireSigin,
  isAdmin,
  orderStatusChangeController
);
export default router;
