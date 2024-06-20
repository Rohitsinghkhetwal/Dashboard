import { v2 as cloudinary } from "cloudinary";
import fs from "fs";   
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SECRET_KEY,
});

const uploadCloudinary = async(LocaFilePath) => {
    try{
        if(!LocaFilePath) {
            return "404 not found !"
        }
        const response = await cloudinary.uploader.upload(LocaFilePath, {
            resource_type: "image"
        });
        fs.unlinkSync(LocaFilePath);
        return response;

    }catch(err){
        fs.unlinkSync(LocaFilePath);
        console.log("Something went wrong here !");
        return null;
    }
}

export  {uploadCloudinary};