import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      //while using trim remove spaces before and after
      trim: true,
    },
    email: {
      type: String,
      required: true,
      //unique true ensure user with unique email
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      //{} yh use kr k multiline kr skty h hm
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    //timestamps is used whereobject is finishing
  },
  { timestamps: true }
);
//mongoose.model in first argument we define collection name and in second we define refernce of structure how db will look
export default mongoose.model("Users", userSchema);
