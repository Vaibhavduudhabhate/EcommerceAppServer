import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js"
import productsRoutes from "./routes/peoductsRoute.js"
import addToCartRoutes from "./routes/addToCartRoutes.js"
dotenv.config();

const app = express();

//middlewars call starts
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));
//middlewars call ends

app.use('/api', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product',productsRoutes)
app.use('/api/addtocart',addToCartRoutes)

//database connection
connectDB();


app.get("/",(req,res)=>{
    res.send({
        message:"welcome to express server on live"
    })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT ,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgCyan.white)
})