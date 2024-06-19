import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const result = await mongoose.connect(process.env.MONGO_URI);
        if(result){
            console.log(" Connection Established successfully !");
        }else {
            console.log("Somthing went wrong !");
        }

    }catch(err){
        console.log("Something went wrong !", err);
    }

}

export default connectDB;