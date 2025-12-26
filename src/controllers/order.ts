import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { newOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { inValidDateCache, reduceStock } from "../utils/features.js";
// import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";


export const newOrder = TryCatch(async(req:Request<{},{},newOrderRequestBody>,res,next)=>{
    const {shippingInfo,orderItems,user,subTotal,tax,total} = req.body;
    

    if (!shippingInfo || !orderItems || !user || !subTotal || !tax
        //  || !shippingCharges  || !discount
        || !total) return next(new ErrorHandler("Plz Add All Field", 400));
    const proct = await Product.findById(orderItems[0].productId);
    if(proct && proct.stock < orderItems[0].quantity){
        return next(new ErrorHandler(`Only ${proct.stock} items are available in stock, That are less than you order Quantity`, 400));
    }           
    const orderd await Order.create({
        shippingInfo,orderItems,user,subTotal,tax,total
    });
    await reduceStock(orderItems);
      

    await inValidDateCache({
        product: true,
         order: true,
          admin: true,
           userId: user,
            productId: orderd.orderItems.map((i)=>String(i.productId))
        });

    res.status(201).json({
        success: true,
        message: "Oder Placed Successfully",
    })

});


export const myOrder = TryCatch(async(req,res,next)=>{
    const {id: user} = req.query;
    let orders = [];

    const key = `my-orders-${user}`

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
        orders = await Order.find({user});
        if(!orders) return next (new ErrorHandler("Product Not Found", 404));
        myCache.set(key, JSON.stringify(orders));    
    }

    return res.status(201).json({
        success: true,
        orders,
    })
})



export const AllOrder = TryCatch(async(req,res,next)=>{
    
    let orders = [];

    const key = "AllOrder"

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));    
    }

    return res.status(201).json({
        success: true,
        orders,
    })
})



export const getsingleOrder = TryCatch(async(req,res,next)=>{
    const {id} = req.params;

    let orders;

    const key = `order-${id}`

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
        orders = await Order.findById(id).populate("user", "name");
        if(!orders) return next(new ErrorHandler("order Not Found", 404));
        myCache.set(key, JSON.stringify(orders));    
    }

    return res.status(201).json({
        success: true,
        orders,
    })
})





export const ProcessOrder = TryCatch(async(req,res,next)=>{
   const {id} = req.params;

   const order = await Order.findById(id);
   if(!order) return next(new ErrorHandler("Order Not Fount", 404));

    switch (order.status) {
        case "Processing":
                order.status = "Shipped";
            break;
        case "Shipped":
                order.status = "Delivered";
            break; 
        default:
                order.status = "Delivered"
            break;
    }

    await order.save();

    const nowStatus = await Order.findById(id);
    const newOutput = nowStatus?.status;

    await inValidDateCache({product: true, order: true, admin: true, userId: order.user,orderId: String(order._id)});


    res.status(201).json({
        success: true,
        message: `order ${newOutput} SuccessfullY`,
    })

});


export const deleteOrder = TryCatch(async(req,res,next)=>{
   const {id} = req.params;

   const order = await Order.findById(id);
   if(!order) return next(new ErrorHandler("Order Not Fount", 404));

  

    await order.deleteOne();

 
    await inValidDateCache({product: true, order: true, admin: true, userId: order.user,orderId: String(order._id)});

    res.status(201).json({
        success: true,
        message: "Order Deleted Successfully",
    })

});



