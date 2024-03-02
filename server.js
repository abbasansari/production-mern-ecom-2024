import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
//whencer use import export we need to mention file extension
import connectDB from "./config/db.js";
//For Deployment ///////////////////////////////////////////////
import path from "path";
import {fileURLToPath} from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//config env if its not in the root foler than use {path:""}
dotenv.config();
//database config
connectDB();
//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//For Deployment //////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, "./client/build"))); ///for deployment only

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoutes);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html")); ///for deployment only
});
// //rest api for development purpose
// app.get("/", (req, res) => {
//   res.send("<h1> Welcom to Ecommerce App </h1>");
//   // res.status(200).json("<h1> Welcom to Ecommerce App </h1>");
// });

//port
const PORT = process.env.PORT || 8000;

//run app
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`.bgCyan.white);
});
