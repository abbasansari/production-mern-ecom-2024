import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

///////////////////////////////// Payment Gateway esy e gateway ko import krna prta h braintree nod sy ////////

//agr pulic key nt found aye to dot env file ko add krdien isi mein
//config env if its not in the root foler than use {path:""}
dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "tbvvdptg3kbtmt54", //process.env.BRAIN_TREE_MERCHANT_ID,
  publicKey: "6msknd77cp88ztjy", //process.env.BRAIN_TREE_PUBLIC_KEY,
  privateKey: "41982d3345f986c3a34d14ee3fe3c118", //process.env.BRAIN_TREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, price, shipping, description, category, quantity } =
      req.fields;
    const { photo } = req.files; // contains files
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });

      case !price:
        return res.status(500).send({ message: "price is required" });
      case photo && photo.size > 1048576:
        return res
          .status(500)
          .send({ message: "Photo is required and size less than 1mb" });
      case !description:
        return res.status(500).send({ message: "description is required" });
      case !category:
        return res.status(500).send({ message: "category is required" });
      case !quantity:
        return res.status(500).send({ message: "quantity is required" });
    }
    //creating a copy of product
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    //photo geting
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created SuccessFully",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error Creating Products", error });
  }
};

//getAllProductController
export const getAllProductController = async (req, res) => {
  try {
    //.select used to minus data  which we don't need from database .limit() to limit  the number of data that will be shown on one page .sort()
    //to shown on bases of recent products
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Data ",
      product,
      total: product.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting All Products",
      error: error.message,
    });
  }
};

//getSingleProductController

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res
      .status(200)
      .send({ success: true, message: "Single product found", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fethcing Single Product",
      error,
    });
  }
};

//product Photo Controller

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fethcig product photo",
      error,
    });
  }
};

//deleteProductController
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res
      .status(200)
      .send({ success: true, message: "Product Deleted SUccessfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error while Produt Deletion", error });
  }
};

//updateProductController
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, price, shipping, description, category, quantity } =
      req.fields;
    const { photo } = req.files; // contains files
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });

      case !price:
        return res.status(500).send({ message: "price is required" });
      case photo && photo.size > 1048576:
        return res
          .status(500)
          .send({ message: "Photo is required and size less than 1mb" });
      case !description:
        return res.status(500).send({ message: "description is required" });
      case !category:
        return res.status(500).send({ message: "category is required" });
      case !quantity:
        return res.status(500).send({ message: "quantity is required" });
    }
    //updating a product
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    //photo geting
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated SuccessFully",
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error Updating Products", error });
  }
};

////////////////////productFilterController////////////////////////////////

export const productFilterController = async (req, res) => {
  try {
    //geting data from frontend
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    //as a price filter we are getting singl check box and using mongo gte [0] means at 0 index [$0-$19] show results greate than 0 and less than 1
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(201).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error Applying Filters",
    });
  }
};

///////////////////////////////////productCountController pagination ///////////////////////////

export const productCountController = async (req, res) => {
  try {
    //products ka count total mein arha h estimatedDocumentCount() is function sy
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error Getting Count of Products",
      error,
    });
  }
};

///////////////////////////////////////////productListController pagination////////////////////////////////////

export const productListController = async (req, res) => {
  try {
    //kitny products per page pr show krwanay h
    const perPage = 2;
    //dynamic page url sy arha req.params sy access krhy h// agr to pgae ki value milti h to theek wrna 1 rhy gi
    const page = req.params.page ? req.params.page : 1;
    //.find sb kuch find kro .select photo ko hordo .skip  or .limit sirf 6 products dekhao .sort created at means new walay
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({ success: true, products, message: "Api Producr COntroller" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Error Geting Product List", error });
  }
};

//////////////////////////////////////////////// searchProductController //////////////////////////////

export const searchProductController = async (req, res) => {
  try {
    //sb sy phly keyword get ktna h jo url mein sy arha h
    const { keyword } = req.params;
    //results k andar desc or name ki base pr search krhy mtlb jahan b keyword mily wh data do  or option:"i" sy casesenstivity khtm hojati h
    const results = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, message: "Error in Search Product API", error });
  }
};

//////////////////////////////////////// Related ProductController ///////////////////////////////

export const relatedProductController = async (req, res) => {
  try {
    //url mein sy product or category id get krhy
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        //category ki base pr find krhy
        category: cid,
        //$ne ek function h means not included isy mt dekhao
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Similar Product API ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Fetching Similar products",
    });
  }
};

/////////////////////////////// productByCategoryController //////////////////////////////////

export const productByCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Succes productByCategoryController ",
      category,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////////payment gateway braintreeTokenController token k lyee///////////////////////////////////////

export const braintreeTokenController = async (req, res) => {
  try {
    //gateway jo uper define kia h usy use krhy or normal function islye use krhy kyu k braintree ki docs mein esy h
    //yh function ek object leta h and ek callback function
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        return res.status(400).send({ success: false, error });
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////////// braintreePaymentController Payment k lye ////////////////////////

export const braintreePaymentController = async (req, res) => {
  try {
    //details get krhy h customer sy or nonce braintree api ka apna h kuch and cart mtlb jo products h
    const { cart, nonce } = req.body;
    //cart mein jitny items uska total count b chahye
    let total = 0;
    //map kr k items ki price get krhy
    cart.map((item) => {
      total += item.price;
    });
    //transction krhy
    let newTransaction = gateway.transaction.sale(
      {
        amount: total, //amount jo usper total kia h wh h yh
        paymentMethodNonce: nonce, //nonce is the token which we got from client side after generating it using braintree sdk
        options: { submitForSettlement: true }, //settle hojaye to transaction complete hoi
      },
      //callback function define krke h
      function (error, result) {
        if (result) {
          const order = new orderModel({
            //object pass krwaa rhy
            products: cart, //cartSy arhy
            payment: result, //payment jo hmny orderModel mein define kia h sae wse spelling hon
            buyer: req.user._id,
          }).save(); //jaisy sb kuch miljata h to save krwaa doo
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
