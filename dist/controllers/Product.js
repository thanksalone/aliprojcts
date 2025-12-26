import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { inValidDateCache } from "../utils/features.js";
// Revalidate on new , update or delete & new order
export const latestProduct = TryCatch(async (req, res, next) => {
    let product;
    if (myCache.has("latestProducts"))
        product = JSON.parse(myCache.get("latestProducts"));
    else {
        product = await Product.find().sort({ createdAt: -1 }).limit(5);
        myCache.set("latestProducts", JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
// Revalidate on new , update or delete & new order
export const categories = TryCatch(async (req, res, next) => {
    let category;
    if (myCache.has("latestProducts"))
        category = JSON.parse(myCache.get("Categories"));
    else {
        category = await Product.distinct("category");
        myCache.set("Categories", JSON.stringify(category));
    }
    return res.status(200).json({
        success: true,
        category,
    });
});
// Revalidate on new , update or delete & new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let product;
    if (myCache.has("Adminproducts"))
        product = JSON.parse(myCache.get("Adminproducts"));
    else {
        product = await Product.find({});
        myCache.set("Adminproducts", JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
// Revalidate on new , update or delete & new order
export const getsingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (myCache.has(`product.${id}`))
        product = JSON.parse(myCache.get(`product.${id}`));
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("product not found", 404));
        myCache.set(`product.${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    rm(product.photo, () => {
        console.log("old photo deleted deleted");
    });
    await product.deleteOne();
    ///prudct re validate remove from browser
    await inValidDateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    ///prudct re validate remove from browser
    await inValidDateCache({ product: true });
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleted deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (category)
        product.category = category;
    if (stock)
        product.stock = stock;
    if (price)
        product.price = price;
    await product.save();
    return res.status(200).json({
        success: true,
        message: "Product updated SuccessfullY Good",
        product,
    });
});
// export const updateProduct = TryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   // Add type checking
//   if (!id || typeof id !== 'string') {
//     return next(new ErrorHandler("Invalid product ID", 400));
//   }
//   // Type cast the body for TypeScript
//   const body = req.body as NewProductRequestBody;
//   const { name, price, stock, category } = body;
//   const photo = req.file as Express.Multer.File | undefined;
//   // Find the product
//   const product = await Product.findById(id);
//   if (!product) {
//     return next(new ErrorHandler("Product not found", 404));
//   }
//   // Handle photo update
//   if (photo) {
//     // Delete old photo if it exists
//     if (product.photo) {
//       try {
//         rm(product.photo, { force: true }, (err) => {
//           if (err) {
//             console.error("Error deleting old photo:", err);
//           }
//         });
//       } catch (error) {
//         console.error("Error deleting old photo:", error);
//       }
//     }
//     product.photo = photo.path;
//   }
//   // Update fields if provided
//   if (name !== undefined) product.name = name;
//   if (category !== undefined) product.category = category;
//   if (price !== undefined) product.price = Number(price);
//   if (stock !== undefined) product.stock = Number(stock);
//   // Validate before saving
//   try {
//     await product.validate();
//   } catch (validationError: any) {
//     return next(new ErrorHandler(`Validation error: ${validationError.message}`, 400));
//   }
//   // Save the updated product
//   await product.save();
//   return res.status(200).json({
//     success: true,
//     message: "Product updated successfully",
//     product,
//   });
// });
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price, id } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = { $regex: search, $options: 'i' };
    if (price)
        baseQuery.price = { $lte: Number(price) };
    if (category)
        baseQuery.category = category;
    if (id)
        baseQuery._id = id;
    // if (id) {
    //   if (mongoose.Types.ObjectId.isValid(id)) {
    //     baseQuery._id = id;
    //   } else {
    //     return res.status(400).json({
    //       success: false,
    //       message: 'Invalid product ID'
    //     });
    //   }
    // }
    // const products = await Product.find(baseQuery).sort(
    //   sort && {price: sort === "asc" ? 1 : -1}
    // ).limit(limit).skip(skip);
    // const filteredProducts = await Product.find(baseQuery);
    const productPromise = Product.find(baseQuery).sort(sort && { price: sort === "asc" ? 1 : -1 }).limit(limit).skip(skip);
    const [products, filteredProducts] = await Promise.all([
        productPromise, Product.find(baseQuery)
    ]);
    const totalProduts = filteredProducts.length;
    const totalPage = Math.ceil(totalProduts / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
        totalProduts,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("plz Add Photo", 404));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new ErrorHandler("plz add All fields", 404));
    }
    await Product.create({
        name,
        photo: photo?.path,
        category: category.toLowerCase(),
        price,
        stock,
    });
    ///prudct re validate remove from browser
    await inValidDateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
    });
});
// //use of faker to create random products in one click
// const generateRandomProducts = async (count: number = 10): Promise<void> => {
//   try {
//     const products = [];
//     for (let i = 0; i < count; i++) {
//       const product = {
//         name: faker.commerce.productName(),
//         photo: "uploads/26c47cad-197a-4bfd-aded-e1f7efbc2a59.png",
//         price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//         stock: faker.number.int({ min: 0, max: 100 }), // Fixed: faker.commerce.stock doesn't exist
//         category: faker.commerce.department(),
//         description: faker.commerce.productDescription(), // Added description
//         createdAt: new Date(faker.date.past()),
//         updatedAt: new Date(faker.date.recent()),
//         __v: 0,
//       };
//       products.push(product);
//     }
//     // Insert all products at once for better performance
//     await Product.insertMany(products);
//     console.log(`✅ Successfully generated ${count} products`);
//   } catch (error) {
//     console.error('❌ Error generating products:', error);
//   }
// };
// // Call the function
// generateRandomProducts(100);
//  const deleteRandomProducts = async(count:number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++){
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({success: true, message: "All products deleted except two 02 left"});
//  }
//  deleteRandomProducts(200000);
