import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { inValidDateCacheType } from "../types/types.js";

export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017", {
        dbName: "Ecommerce_24",
    }).then((c) => console.log(`DB Connected to ${c.connection.host} 27017`))
    .catch((e) => console.log(e));
}



export const inValidDateCache = async({product, order, admin}:inValidDateCacheType) => {
    if (product){
        const productKeys: string[] =["latestProducts","Adminproducts","Categories",];
        const product = await Product.find({}).select("_id");
        product.forEach((i) => {
        productKeys.push(`product-${i._id}`);
        })
      myCache.del(productKeys)
     }
    if (order){ }
    if (admin){ }
};