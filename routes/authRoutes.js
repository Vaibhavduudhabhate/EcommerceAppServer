import express from "express";
import { forgotPasswordContainer, loginController, registerController, TestController, updateProfileController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.get('/test',requireSignIn,isAdmin, TestController);

router.post('/forgot-password',forgotPasswordContainer)

router.get("/user-auth",requireSignIn ,(req,res)=>{
    res.status(200).send({ok:true})
})

router.get("/admin-auth",requireSignIn,isAdmin ,(req,res)=>{
    res.status(200).send({ok:true})
})

// Update Profile
router.post("/profile",requireSignIn ,updateProfileController)

export default router;