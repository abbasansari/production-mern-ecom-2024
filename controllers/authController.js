import { copmarePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validation
    if ((!name || !email, !password || !phone || !address || !answer)) {
      return res.send({ message: "All fields are required " });
    }

    //in following case key value pairs are same we can write only email if we want
    const existingUser = await userModel.findOne({ email: email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already register please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save user password:hashedPassword key is password and its value is hashedpassword
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered SuccessFully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};
//while passing multiple functions curly braces are used

//POST Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //check user if email register or not in db
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "EMAIL IS NOT REGISTERED",
      });
    }
    //comparing password pass 1 is getting at login and user.pass is hashed pass saved in db
    const match = await copmarePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "INVALID PASSWORD",
      });
    }
    //if matched creating token {1 on which base } , secret key from .env
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login SuccessFully!",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ERROR IN LOGIN",
      error,
    });
  }
};

// forgotPasswordController logic

export const forgotPasswordController = async (req, res) => {
  try {
    //destructuring the data in body
    var { email, answer, newpassword } = req.body;
    //validation
    if (!email) {
      res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        success: false,
        message: "Answer is required",
      });
    }
    if (!newpassword) {
      res.status(400).send({
        success: false,
        message: "Password is required",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }

  //checking email and answer in findone if keypair value are same than we can write single one
  const user = await userModel.findOne({ email, answer });
  //validation
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User not found or Answer is incorrect",
    });
  }
  //updating password
  const hashed = await hashPassword(newpassword);
  console.log("Hashed Pass", hashed);
  await userModel.findByIdAndUpdate(user._id, { password: hashed });
  res.status(200).send({
    success: true,
    message: "Password Updated Successfully",
  });
};

//test controller

export const testController = (req, res) => {
  console.log("protected Route");
  res.send({
    success: true,
    message: "Protected Route is Clicked",
  });
};

///////////////////////////////////// updateProfileController ////////////////////////////////////////////////

export const updateProfileController = async (req, res) => {
  try {
    //destructuring
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({
        error: "Password is require and should be 6 charachter long",
      });
    }
    //hashing password agr to milta h than hash kro nahi to rehny do
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //update data find by id ty update 3 para leta h phly id jis base pr find krna h dosra data 3sra new ki true
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        address: address || user.address,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    console.log(updatedUser);
    res.status(200).send({
      success: true,
      message: "User Updated SuccessFully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating  Profile",
    });
  }
};

///////////////////////////////// Order //////////////////////////////////////

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id }) //buyer jo ordermodel mein h
      .populate("products", "-photo") //products ko populate kro photo chor k
      .populate("buyer", "name"); //buyer ka sirf name dekhaoo
    res.json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Error While Getting Orders", error });
  }
};

////////////// getAllOrdersController Admin ////////////////////////////
// /sort({createdAt : '-1'}) mtlb latet phly
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Admin Orders Error", error });
  }
};

//////////////////////////////// orderStatusChangeController //////////////////////////////////////////////

export const orderStatusChangeController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    ); //jb update req kro to new true lazmi kroo
    res.json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error updating status", error });
  }
};
