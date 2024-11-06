import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, getAllProductController, getSingleProductController, productDeleteController, productPhotoController, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController)
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController)

router.get("/get-product",getAllProductController)
router.get("/get-product/:slug",getSingleProductController)
router.get("/product-photo/:pid",productPhotoController)
router.delete("/delete-product/:pid",productDeleteController)



export default router;