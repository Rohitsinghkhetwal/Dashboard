import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    required: true,
    enum: ["HR", "Manager", "Sales"]
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  course: {
    type: String,
    required: true,
    enum: ["MCA", "BCA", "BSC"],
  },
  imageUrl: {
    type: String,
  }
}, {
    timestamps: true,
});

const users = mongoose.model("users", userSchema);
export default users;