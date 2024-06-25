import Jwt from "jsonwebtoken";
import users from "./Model/user.model.js";


export const VerifyJwt = async(req, resp, next) => {
    try{
        const token = req.cookies?.JwtToken || req.header("Authorization")?.replace("Bearer", "");
        console.log("this is the token from token from Middleware", token);

        if(!token) {
            return resp.status(401).json({message: "404 Unauthorized token not found !"}) 
        }

        const decodedToken = Jwt.verify(token, process.env.JWT_TOKEN);
        console.log("this is the decoded token", decodedToken);
        const CurrentUser = await users.findById(decodedToken._id).select("-password");
        

        if(!CurrentUser) {
            return resp.json("Invalid access token");
        }
        req.user = CurrentUser;
        next();



    }catch(err){
        console.log("Something went wrong !");
        return resp.status(500).json({message: "Invalid access token"});
    }

}