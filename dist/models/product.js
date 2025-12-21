import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "plz enter your Name"],
    },
    photo: {
        type: String,
        required: [true, "plz enter your Photo"],
    },
    price: {
        type: Number,
        required: [true, "plz enter your Stock"],
    },
    stock: {
        type: Number,
        required: [true, "plz enter your Stock"],
    },
    category: {
        type: String,
        required: [true, "plz enter your Category"],
        trim: true,
    },
}, {
    timestamps: true,
});
export const Product = mongoose.model("Product", schema);
