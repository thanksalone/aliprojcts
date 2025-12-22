import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";



export const errorMidleware = (err:ErrorHandler,reqr:Request<any>,res:Response,next:NextFunction) => {
    err.message ||= "internal Server Error";
    err.statusCode ||= 500;
    return res.status(err.statusCode).json({
        sucess: true,
        message: err.message

    })
};

export const TryCatch = (func:ControllerType)=> 
    (req:Request,res:Response,next:NextFunction)=> {
return Promise.resolve(func(req, res, next)).catch(next);
}
