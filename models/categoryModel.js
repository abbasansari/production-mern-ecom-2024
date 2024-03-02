import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    //slug is used to replace space with -
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

//mongoose.model in first argument we define collection name and in second we define refernce of structure how db will look
export default mongoose.model("Category", categorySchema);
