import { uploadCloudinary } from "../Cloudnary.js";
import bcrypt from "bcrypt";
import users from "../Model/user.model.js";



export const RegisterUser = async(req, resp) => {
    
        const {name, email, mobile, Designation, gender, course, password} = req.body;
        if([name, email, mobile, password, Designation, gender, course].some((field) => field?.trim() === "")) {
            return resp.status(401).json("All fields are required !");
        }
        const existingUser = await users.findOne({
            $or: [{name, email}],
        });

        if(existingUser) {
            return resp.status(400).json("User already exist !");
        }

        //imageUrl
        const imageUrlLocalPath = req.files?.imageUrl[0].path;

        if(!imageUrlLocalPath){
            resp.status(400).json("Image url path not found !");
        }

        //upload to cloudinary
        const uploadImageToCloudinary = await uploadCloudinary(imageUrlLocalPath);

        if(!uploadImageToCloudinary){
            resp.status(401).json("ImageUrl is required !");
        }

        //hashing the password

        const passwordHash = await bcrypt.hash(password, 12);

        const UsersEntry = await users.create({
            name,
            email,
            password: passwordHash,
            Designation,
            mobile,
            gender,
            imageUrl: uploadImageToCloudinary.url,
            course,
        });

        console.log("this is response", UsersEntry);

        return resp.status(200).json(UsersEntry);
}