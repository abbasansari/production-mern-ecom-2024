import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    //in ref we pass name of collection to relate product id and cat id are differnt mongoose.ObjectId help create a single
    category: { type: mongoose.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    photo: { data: Buffer, contentType: String },
    shipping: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
