import { Router } from "express";
import { RegisterUser } from "../Controller/user.controller.js";
import { upload } from "../Multer.js";

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

export default router;