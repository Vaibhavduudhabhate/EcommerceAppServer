import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

//middlewars call starts
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));
//middlewars call ends

app.use('/api', authRoutes);

//database connection
connectDB();


app.get("/",(req,res)=>{
    res.send({
        message:"welcome to express server"
    })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT ,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgCyan.white)
})