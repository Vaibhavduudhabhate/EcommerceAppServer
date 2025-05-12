import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs"
import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";

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
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").limit(12).sort({createdAt:-1}).populate('category')
        res.status(200).send({
            success: true,
            product,
            message: "single product"
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
            message:"Product updated successfully",
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

export const productFilterController = async(req,res)=>{
    console.log("asdadasdasd")
try {
    const {checked ,radio} = req.body;
    console.log(req.body)
    let args = {}
    if(checked.length > 0) args.category =checked; 
    if(radio.length) args.price = {$gte : radio[0],$lte : radio[1]}
    const products = await productModel.find(args).select("-photo");
    res.status(200).send({
        success:true,
        products
    })
} catch (error) {
    console.log(error)
    res.status(400).send({
        success:false,
        message:"Error while filtering Products"
    })
}
}

// export const productCountController = async (req,res) =>{
//     try {
//         const { checked, radio } = req.body; // Assuming you are sending filters in the request body
//         let filter = {};

//         // Filter by category (checked)
//         if (checked && checked.length > 0) {
//             filter.category = { $in: checked };
//         }

//         // Filter by price range (radio)
//         if (radio && radio.length === 2) {
//             filter.price = { $gte: radio[0], $lte: radio[1] };
//         }
//         const total = await productModel.find({}).estimatedDocumentCount();
//         res.status(200).send({
//             success:true,
//             total
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({
//             success:false,
//             message:"Error while paginating Products"
//         })
//     }
// }

// export const productListController = async(req,res)=>{
//     try {
//         const { checked, radio } = req.body;
//         const perpage = 4;
//         const page = req.params.page || 1;
//         let filter = {};

//         // Filter by category (checked)
//         if (checked && checked.length > 0) {
//             filter.category = { $in: checked };
//         }

//         // Filter by price range (radio)
//         if (radio && radio.length === 2) {
//             filter.price = { $gte: radio[0], $lte: radio[1] };
//         }
//         const products = await productModel.find({}).select("-photo").skip((page-1) * perpage).limit(perpage).sort({createdAt : -1})
//         res.status(200).send({
//             success:true,
//             products
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({
//             success:false,
//             message:"Error in per page"
//         })
//     }
// }

export const searchProductController = async(req,res) =>{
try {
    const {keyword} = req.params;
    const result = await productModel.find({
        $or : [
            {name:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}}
        ]
    }).select("-photo")
    res.json(result)
} catch (error) {
    console.log(error)
    res.status(400).send({
        success:false,
        message:"Error in search",
        error
    })
}
}


// export var pagination = async(req,res)=>{
//     const data = await User.findAll({})
//     // res.status(200).json({data:data})
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 2;

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
    
//     const results = {};
    
//     results.results = data.slice(startIndex, endIndex);
//     if (endIndex < data.length) {
//         results.next = {
//             page: page + 1,
//             limit: limit
//         };
//     }

//     if (startIndex > 0) {
//         results.previous = {
//             page: page - 1,
//             limit: limit
//         };
//     }


//     res.json(results);
// }

// export const userList = async (req, res) => {  
//     console.log("entered",req.query.page)
//     try {  
//       let offsetNo;
//       let pgeno = req.query.page == undefined ? 1 : req.query.page;
//       pgeno = Number(pgeno); // making it a numeric value
//       console.log('pgeno',pgeno)
  
//       const allcount = await productModel.count({});
//         console.log('allcount',allcount)
//       const filteredRecordCount = await productModel.count({
//         paranoid: true,
//       });
//       console.log('filteredRecordCount',filteredRecordCount)
//       let total_pages = Math.ceil(filteredRecordCount / 2);
//       console.log('total_pages',total_pages)
//       if (filteredRecordCount == 0) {
//         console.log("entered")
//         return res.status(200).json({
//           data: [],
//           message: "No records found ",
//           success: true,
//         });
//       } else {
//         console.log("entered else")
//         if (pgeno == 0) {
//           pgeno = 1;
//           offsetNo = 0;
//         } else if (pgeno == total_pages) {
//           offsetNo = 2 * (total_pages - 1);
//         } else if (pgeno == 1) {
//           offsetNo = 0;
//         } else {
//           offsetNo = 2 * (pgeno - 1);
//         }
//       }
  
//       const { rows,count } = await productModel.findAndCountAll({
//         limit:2,
//         // where: condition,
//         paranoid: true,
//         offset: offsetNo,
//         // attributes: {
//         //   exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
//         // },
//         // include: [
//         //   {
//         //     model: Charities,
//         //     // paranoid: false,
  
//         //     as: "charities",
//         //     attributes: ["charity_name"],
//         //     // Specify the columns you want from the charity model
//         //   },
//         // ],
//         // order: [["createdAt", "DESC"]],
//       });
  
//       let nxtpgeno = pgeno + 1;
//       let prepgeno = pgeno - 1;
  
//       if (rows.length == 0) {
//         return res.status(200).json({
//           data: [],
//           message: "No records found ",
//           success: true,
//         });
//       }
  
//       if (rows.length > 2) {
//         if (pgeno == 1) {
//           return res.status(200).json({
//             data: rows,
//             success: true,
//             record_count: filteredRecordCount,
//             current_page: pgeno,
//             next_page: nxtpgeno,
//             total_page: total_pages,
//             total_records: allcount,
//           });
//         }
//       } else {
//         if (pgeno == 1) {
//           return res.status(200).json({
//             data: rows,
//             success: true,
//             record_count: filteredRecordCount,
//             current_page: pgeno,
//             total_page: total_pages,
//             total_records: allcount,
//           });
//         }
//       }
  
//       if (pgeno == total_pages) {
//         return res.status(200).json({
//           data: rows,
//           success: true,
//           record_count: filteredRecordCount,
//           current_page: pgeno,
//           previous_page: prepgeno,
//           total_page: total_pages,
//           total_records: allcount,
//         });
//       }
//       return res.status(200).json({
//         data: rows,
//         success: true,
//         current_page: pgeno,
//         previous_page: prepgeno,
//         next_page: nxtpgeno,
//         total_page: total_pages,
//         total_records: allcount,
//         record_count: filteredRecordCount,
//       });
//     } catch {
//       (err) => {
//         next(err);
//       };
//     }
//   };


export const productsPaginationController = async (req, res, next) => {
  console.log("entered", req.query.page);
  
  try {
    let offsetNo;
    let pgeno = req.query.page == undefined ? 1 : req.query.page;
    pgeno = Number(pgeno);
    console.log('pgeno', pgeno);

    const allcount = await productModel.countDocuments({});
    console.log('allcount', allcount);

    const filteredRecordCount = await productModel.countDocuments({ });
    console.log('filteredRecordCount', filteredRecordCount);

    let total_pages = Math.ceil(filteredRecordCount / 2);
    console.log('total_pages', total_pages);

    if (filteredRecordCount == 0) {
      console.log("No records found.");
      return res.status(200).json({
        data: [],
        message: "No records found",
        success: true,
      });
    }

    // Determine the offset based on the page number
    if (pgeno == 0) {
      pgeno = 1;
      offsetNo = 0;
    } else if (pgeno == total_pages) {
      offsetNo = 2 * (total_pages - 1);
    } else if (pgeno == 1) {
      offsetNo = 0;
    } else {
      offsetNo = 2 * (pgeno - 1);
    }

    // Query the products with pagination (limit and skip)
    const products = await productModel.find()
      .skip(offsetNo)
      .limit(2);  // Adjust the limit if needed

    let nxtpgeno = pgeno + 1;
    let prepgeno = pgeno - 1;

    if (products.length === 0) {
      return res.status(200).json({
        data: [],
        message: "No records found",
        success: true,
      });
    }

    // Response structure with pagination details
    return res.status(200).json({
      data: products,
      success: true,
      record_count: filteredRecordCount,
      current_page: pgeno,
      next_page: nxtpgeno,
      previous_page: prepgeno,
      total_page: total_pages,
      total_records: allcount,
    });

  } catch (err) {
    console.error("Error in userList:", err);  // Log the error
    next(err);  // Pass the error to the error handler
  }
};

export const relatedProductsController = async(req,res)=>{
    console.log(req.params)
    try {
        const {pid,cid} = req.params
        
        if (!mongoose.Types.ObjectId.isValid(pid) || !mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({
                success: false,
                message: "Invalid product ID or category ID",
            });
        }
        console.log(pid,cid)
        const product = await productModel.find({
            _id:{$ne:pid},
            category:cid
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success:true,
            product
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error in related product",
            error
        })
    }
}

export const productCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products = await productModel.find({category}).populate("category")
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
       console.log(error);
       res.status(400).send({
        success:false,
        error,
        message:"error while getting products"
       }) 
    }
}