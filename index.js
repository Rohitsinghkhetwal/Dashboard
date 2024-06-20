import express from "express";
import dotenv from "dotenv";
import connectDB from "./Connection.js";
dotenv.config();

const app = express();
app.use(express.json());
connectDB();

//import all the route here !
import userRoute from "./routes/user.route.js"

app.use("/api/v1/users",userRoute);



app.listen(() => {
    console.log(`Server is running in port${process.env.PORT || 5000}`);
})