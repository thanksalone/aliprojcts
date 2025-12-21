import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "plz Add ID"],
    },
    name: {
        type: String,
        required: [true, "plz enter your Name"],
    },
    email: {
        type: String,
        unique: [true, "Email already Exist"],
        required: [true, "plz enter your Mail"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Plz Add your photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "plz Enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Plz Enter Date of Birth"],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth()
        && today.getDate() < dob.getDate()) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
