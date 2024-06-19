import express from "express";
import dotenv from "dotenv";
import connectDB from "./Connection.js";
dotenv.config();

const app = express();
app.use(express.json());
connectDB();



app.get("/", (req, res) => {
    res.json("hi there !");
})


app.listen(() => {
    console.log(`Server is running in port${process.env.PORT}`);
})