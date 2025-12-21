//middleware to make sure tha admin only allowed to make changes
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Sale Login kr pehle", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Sale Fake iD dalta hai", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("saale Aukat nahi hai teri", 401));
    next();
});
