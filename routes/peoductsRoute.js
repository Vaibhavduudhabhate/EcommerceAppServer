import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, getAllProductController, getSingleProductController,  productCategoryController,  productDeleteController, productFilterController,  productPhotoController, productsPaginationController, relatedProductsController, searchProductController, updateProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController)
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController)

router.get("/get-product",getAllProductController)
router.get("/get-product/:slug",getSingleProductController)
router.get("/product-photo/:pid",productPhotoController)
router.delete("/delete-product/:pid",productDeleteController)
router.post("/product-filter",productFilterController)
// router.post("/product-count",productCountController)
// router.get("/product-list/:page",productListController)
router.get("/search/:keyword",searchProductController)
router.get("/pagination",productsPaginationController)
router.get("/related-products/:pid/:cid",relatedProductsController)
router.get("/product-category/:slug",productCategoryController)


export default router;