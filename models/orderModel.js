import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    //array of object h or ref relationship show krha h k product model ki base pr
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    payment: {},
    buyer: {
      //yh b user model k sth relation mein h
      type: mongoose.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "Not Processed",
      //enum ko hm multiple values pass krskty h or array mein
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Deleivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

//mongoose.model in first argument we define collection name and in second we define refernce of structure how db will look
export default mongoose.model("Order", orderSchema);
