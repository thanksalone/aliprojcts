import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";



export const newCoupon = TryCatch(async(req,res,next)=>{
    const {coupon, amount} = req.body;
    if(!coupon || !amount) return next(new ErrorHandler("plz enter All Fields", 404));

    await Coupon.create({code: coupon, amount});

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created SuccessfullY`,
    });
    
});


export const applyDiscount = TryCatch(async(req,res,next)=>{
    const {coupon} = req.query;

    const discount =  await Coupon.findOne({code: coupon});

    if(!discount) return next (new ErrorHandler("invalid Coupon code", 400))

    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
    
});


export const allCoupon = TryCatch(async(req,res,next)=>{
    
    const allcoupon =  await Coupon.find({});

    return res.status(200).json({
        success: true,
        allcoupon,
    });
    
});


export const deleteCoupon = TryCatch(async(req,res,next)=>{
    const {id} = req.params;
    
    const coupon =  await Coupon.findById(id);
    if(!coupon) return next(new ErrorHandler("Coupon Not Found", 404));

    coupon?.deleteOne();
    return res.status(200).json({
        success: true,
        message: `coupon ${coupon} deleted successfully`,
    });
    
});