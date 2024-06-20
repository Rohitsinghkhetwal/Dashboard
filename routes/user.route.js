import { Router } from "express";
import { LogOut, LoginUser, RegisterUser, deleteUser, getAllUsers, updateUser } from "../Controller/user.controller.js";
import { upload } from "../Multer.js";
import {VerifyJwt} from "../Middleware.js"

const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "imageUrl",
            maxCount: 1,
        }
    ]),
    RegisterUser
);
router.route("/login").post(LoginUser);
router.route("/getAll").get(VerifyJwt,getAllUsers);
router.route("/update/:id").put(VerifyJwt, updateUser);
router.route("/logout").post(VerifyJwt, LogOut);
router.route("/delete/:id").delete(VerifyJwt, deleteUser);

export default router;