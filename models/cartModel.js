import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      default: 0,
    },
  });

const cartSchema = new mongoose.Schema({
    products: [itemSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpressP",
  },
  total: {
    type: Number,
    default: 0,
  },
  __v: { type: Number, select: false },
},{timestamps:true})

export default mongoose.model("ExpressPCart",cartSchema)