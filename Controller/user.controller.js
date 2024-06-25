import { uploadCloudinary } from "../Cloudnary.js";
import bcrypt from "bcrypt";
import users from "../Model/user.model.js";
import Jwt from "jsonwebtoken";

const generateJwtToken = (_id) => {
  const userAuthenticated = Jwt.sign({ _id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.EXPIRE_IN,
  });
  return userAuthenticated;
};
//Registering api

export const RegisterUser = async (req, resp) => {
  try {
    const { name, email, mobile, designation, gender, course, password } =
      req.body;
    if (
      ![name, email, mobile, designation, gender, course, password].every(
        (field) => field?.trim()
      )
    ) {
      return resp.status(400).json("All Fields are required !");
    }

    const existingUser = await users.findOne({
      $or: [{ name, email }],
    });

    if (existingUser) {
      return resp.status(400).json("User already exist !");
    }

    //imageUrl
    const imageUrlLocalPath = req.files?.imageUrl[0].path;
    console.log("local path here +++>", imageUrlLocalPath);

    if (!imageUrlLocalPath) {
      resp.status(400).json("Image url path not found !");
    }

    //upload to cloudinary
    const uploadImageToCloudinary = await uploadCloudinary(imageUrlLocalPath);

    if (!uploadImageToCloudinary || !uploadImageToCloudinary.url) {
      return resp.status(400).json("Image Upload failed !");
    }

    if (!uploadImageToCloudinary) {
      resp.status(401).json("ImageUrl is required !");
    }

    //hashing the password
    const passwordHash = await bcrypt.hash(password, 12);

    const UsersEntry = await users.create({
      name,
      email,
      password: passwordHash,
      designation,
      mobile,
      gender,
      imageUrl: uploadImageToCloudinary.url,
      course,
    });

    return resp.status(200).json(UsersEntry);
  } catch (err) {
    console.log("something  went wrong !", err);
    resp.status(400).json("somethign went wrong !");
  }
};

// login api

export const LoginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;

    const ExistingUser = await users.findOne({ email });
    console.log("This should be comapred", ExistingUser);
    if (!ExistingUser) {
      return resp
        .status(400)
        .json({ message: "User not found! Please Register First" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const ComparePassword = await bcrypt.compare(
      password,
      ExistingUser.password
    );
    if (ComparePassword) {
      const JwtToken = generateJwtToken(ExistingUser._id);
      return resp
        .status(200)
        .cookie("JwtToken", JwtToken, options)
        .json({
          token: JwtToken,
          user: { 
            name: ExistingUser.name,
            email: ExistingUser.email,
          },
        });
    } else {
      resp.status(400).json({ message: "wrong email or password !" });
    }
  } catch (err) {
    console.log("Error while logging in !", err);
    return resp.status(401).json({ message: "Something went wrong !" });
  }
};
//getAll users api

export const getAllUsers = async (req, resp) => {
  try {
    const result = await users.find().select("-password");
    resp.status(200).json(result);
  } catch (err) {
    console.log("Something went wrong while getting the users", err);
    return resp.status(400).json({ message: "Error in getting users" });
  }
};

//updation api

export const updateUser = async (req, resp) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const { id } = req.params;
    console.log(
      "[inside the body !]",
      name,
      email,
      mobile,
      designation,
      gender,
      course
    );

    const FieldsToUpdate = {};

    if (name) FieldsToUpdate.name = name.trim();
    if (email) FieldsToUpdate.email = email.trim();
    if (mobile) FieldsToUpdate.mobile = mobile.trim();
    if (designation) FieldsToUpdate.designation = designation.trim();
    if (gender) FieldsToUpdate.gender = gender.trim();
    if (course) FieldsToUpdate.course = course.trim();

    // updating the cloudinary images
    if (req.files?.imageUrl) {
      const imageUrlPath = req.files?.imageUrl[0]?.path;

      const uploadImage = await uploadCloudinary(imageUrlPath);
      if (uploadImage && uploadImage.url) {
        FieldsToUpdate.imageUrl = uploadImage.url;
      } else {
        return resp.status(400).json("Image upload failed");
      }
    }

    if (Object.keys(FieldsToUpdate).length === 0) {
      return resp.status(400).json("No valid field is provided for update !");
    }

    const updatingUsers = await users.findByIdAndUpdate(
      id,
      {
        $set: FieldsToUpdate,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatingUsers) {
      return resp.status(400).json({ message: "User not found !" });
    }
    return resp.status(200).json(updatingUsers);
  } catch (err) {
    console.log("Error while updating the user");
    resp.status(500).json({ message: "Error while updating the User !" });
  }
};

//logout api

export const LogOut = async (req, resp) => {
  try {
    console.log("this is auth middleware user", req.user);
    const result = await users.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          JwtToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    console.log("this is result from logout", result);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return resp
      .status(200)
      .clearCookie("JwtToken", options)
      .json({ message: "User logged out successfully !" });
  } catch (err) {
    return resp.status(400).json({ message: "User not logged out !" });
  }
};

//delete api
export const deleteUser = async (req, resp) => {
  try {
    const { id } = req.params;
    console.log("this is a id from delete User api backend", id)
    if (!id) {
      resp.status(400).json({ message: "Select the user first -" });
    }
    const deleteUser = await users.findByIdAndDelete(id);
    console.log("Deleteing user in Delete api", deleteUser);
    resp.status(200).json({ message: "User Deleted Successfully...." });
  } catch (err) {
    resp
      .status(400)
      .json({ message: "something went wrong while deleting the user" });
  }
};

//create employee
export const CreateEmployee = async (req, resp) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    if (
      ![name, email, mobile, designation, gender, course].every((field) =>
        field?.trim()
      )
    ) {
      return resp.status(400).json("All Fields are required !");
    }


     const imageUrlLocalPath = req.files?.imageUrl[0].path;
    

     if (!imageUrlLocalPath) {
       resp.status(400).json("Image url path not found !");
     }

     //upload to cloudinary
     
     
      let uploadImageToCloudinary = await uploadCloudinary(imageUrlLocalPath);    

     if (!uploadImageToCloudinary || !uploadImageToCloudinary.url) {
       return resp.status(400).json("Image Upload failed !");
     }

     if (!uploadImageToCloudinary) {
       resp.status(401).json("ImageUrl is required !");
     }

     let employee = await users.create({
       name,
       email,
       designation,
       mobile,  
       gender,
       imageUrl: uploadImageToCloudinary.url,
       course,
     });
     return resp.status(200).json(employee);

  } catch (err) {
    console.log("Something went wrong !",err);
  }
};
