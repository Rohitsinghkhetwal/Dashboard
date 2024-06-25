import express from "express";
import dotenv from "dotenv";
import connectDB from "./Connection.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();


//import all the route here !
import userRoute from "./routes/user.route.js"


app.use("/api/v1/users",userRoute);



app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running in port${process.env.PORT}`);
})