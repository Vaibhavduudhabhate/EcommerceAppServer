import express from "express";
import {isAdmin, requireSignIn} from "../middlewares/authMiddleware.js"
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/create-category",requireSignIn,isAdmin,createCategoryController)

router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController)

router.get("/all-category",categoryController)

router.get("/single-category/:slug",singleCategoryController)

router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)



export default router;