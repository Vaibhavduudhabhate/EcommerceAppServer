import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs"

export const createProductController = async (req,res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send("Name is required")
            case !description:
                return res.status(500).send("Description is required")
            case !price:
                return res.status(500).send("Price is required")
            case !category:
                return res.status(500).send("Category is required")
            case !quantity:
                return res.status(500).send("Quantity is required")
            case !shipping:
                return res.status(500).send("Shipping is required")
            case photo && photo.size > 100000:
                return res.status(500).send("Photo is required and should be less than 1 mb")
        }
        const products = await productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();

        res.status(201).send({
            success:true,
            message:"product created successfully",
            products
        })
    } catch (error) {
        console.log(error),
            res.status(500).send({
                success: false,
                error,
                message: "Error while creating product"
            })
    }
}

export const getAllProductController = async( req,res ) =>{
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1})

        res.status(200).send({
            success:true,
            products,
            message:"AllProducts",
            total_count:products.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting product list"
        })
    }
}

export const getSingleProductController = async(req,res) =>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            product,
            message: "Error while getting single product list"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single product list"
        })
    }
}

export const productPhotoController = async(req,res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting photo"
        })
    }
}

export const productDeleteController = async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting product"
        })
    }
}

export const updateProductController = async(req,res)=>{
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send("Name is required")
            case !description:
                return res.status(500).send("Description is required")
            case !price:
                return res.status(500).send("Price is required")
            case !category:
                return res.status(500).send("Category is required")
            case !quantity:
                return res.status(500).send("Quantity is required")
            case !shipping:
                return res.status(500).send("Shipping is required")
            case photo && photo.size > 100000:
                return res.status(500).send("Photo is required and should be less than 1 mb")
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,{
        ...req.fields ,slug:slugify(name)
        },{new:true});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();

        res.status(201).send({
            success:true,
            message:"product updated successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating product"
        })
    }
} 