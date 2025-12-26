import mongoose from "mongoose";

const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "Plz EnterCoupon Code"],
        unique: true,
    },
    amount: {
        type: Number,
        required:[true, "plz enter the amount"],
    },
});


export const Coupon = mongoose.model("Coupon", schema)