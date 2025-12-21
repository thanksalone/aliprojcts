import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";

export const newProduct = TryCatch(async(
    req:Request<{},{},NewProductRequestBody>,
    res,
    next,
)=>{
   const {name, price ,category, stock}=req.body;

   const photo = req.file;
    if(!photo) return next(new ErrorHandler("plz Add Photo", 404));
   if(!name || !price || !stock || !category){
    rm(photo.path, ()=>{
      console.log("deleted");
    });
       return next(new ErrorHandler("plz add All fields", 404));

   }

   await Product.create({
    name,
    photo : photo?.path,
    category: category.toLowerCase(),
    price,
    stock,
 })
 return res.status(201).json({
    success: true,
    message: "Product Created Successfully",
 })
})



 export const latestProduct = TryCatch(async(req,res,next)=>{
  const product = await Product.find().sort({createdAt: -1}).limit(5);
  return res.status(200).json({
    success: true,
    product,
  })
 })
   

  export const categories = TryCatch(async(req,res,next)=>{
  const category = await Product.distinct("category");
  return res.status(200).json({
    success: true,
    category,
  })
 })


 export const getAdminProducts = TryCatch(async(req,res,next)=>{
  const product = await Product.find({});
  return res.status(200).json({
    success: true,
    product,
  })
 })

 export const getsingleProduct = TryCatch(async(req,res,next)=>{
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("product not found", 404));

  return res.status(200).json({
    success: true,
    product,
  })
 })



  export const deleteProduct = TryCatch(async(req,res,next)=>{
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("product not found", 404));

 rm(product.photo, ()=>{
      console.log("old photo deleted deleted");
    });

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  })
 })











 
 
// export const updateProduct = TryCatch(async(req:Request<{},{},NewProductRequestBody>,res,next)=>{
//   const id = req.params;
//   console.log(id)
//   console.log("BODY:", req.body);
// console.log("FILE:", req.file);
//   const {name, price, stock, category} = req.body; 
//    const photo = req.file;
//   const product = await Product.findById(id);

//   if (!product) return next(new ErrorHandler("product not found", 404));


//    if(photo){
//     rm(product.photo, ()=>{
//       console.log("old photo deleted deleted");
//     });
//     product.photo = photo.path
//    }

//    if(name) product.name = name;
//    if(category) product.category = category;
//    if(stock) product.stock = stock;
//    if(price) product.price = price;

//    await product.save();

//    return res.status(200).json({
//      success: true,
//      message: "Product updated SuccessfullY Good",
//    })
//  }) 

export const updateProduct = TryCatch(async (req:Request<{},{},NewProductRequestBody>, res, next) => {
  const { id } = req.params;
    console.log("BODY:", req.body);
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  console.log("BODY:", req.body);

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (photo) {
    if (product.photo) {
      rm(product.photo, { force: true }, () => {});
    }
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});
