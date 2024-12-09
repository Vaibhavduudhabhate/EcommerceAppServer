import express from "express";
import { addItemToCart, decreaseQuantity, getCart, removeItem } from "../controllers/cartController.js";
const router = express.Router();

router.post("/add_to_cart/:userId", addItemToCart);
router.get("/get_cart/:userId", getCart);
router.patch("/decrease_quantity/:userId", decreaseQuantity);
router.delete("/remove_item/:userId", removeItem);

export default router;
