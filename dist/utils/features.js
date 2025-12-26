import mongoose, { Error } from "mongoose";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";
export const connectDB = (url) => {
    mongoose.connect(url, {
        dbName: "Ecommerce_24",
    }).then((c) => console.log(`DB Connected to ${c.connection.host} 27017`))
        .catch((e) => console.log(e));
};
export const inValidDateCache = async ({ product, order, admin, userId }) => {
    if (product) {
        const productKeys = ["latestProducts", "Adminproducts", "Categories",];
        const product = await Product.find({}).select("_id");
        product.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
        const orderKyes = ["AllOrder", `my-orders-${userId}`];
        const orders = await Order.find({}).select("_id");
        orders.forEach((i) => {
            orderKyes.push(`order-${i._id}`);
        });
        myCache.del(orderKyes);
    }
    if (admin) { }
};
export const reduceStock = async (orderItems) => {
    console.log("order cut Successfullly");
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Note Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
