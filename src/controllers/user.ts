import { NextFunction, Request, Response } from "express";
import { NewUserRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
// import { error } from "node:console";

export const newUser = TryCatch (
  async (
 req: Request/*<{},{},NewUserRequestBody>*/,
 res:Response,
 next:NextFunction
) =>{


    
   const {name, email, photo, gender, dob, _id} = req.body;

   let user= await User.findById(_id);

   if (user) 
        return res.status(200).json({
      sucess:true,
    message: `WelCome, ${user.name}`,
  });

  if(!_id || !name || !email || !photo || !gender || !dob)
    return next( new ErrorHandler("Plz Add All Fields", 400))
    user = await User.create({name, email, photo, gender, dob: new Date(dob), _id});
    return res.status(200).json({
        success: true,
        message: `Welcom, ${user.name}`,
    })


})



export const getAllUsers = TryCatch(async(req, res, next)=>{
  const users = await User.find({});

  return res.status(201).json({
    success: true,
    message: users
  })

})



export const getUser = TryCatch(async(req,res,next)=>{
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid User id", 404));

  return res.status(201).json({
    success: true,
    message: user
  })

})

export const deleteUser = TryCatch(async(req,res,next)=>{
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid User id", 404));

   await user.deleteOne(); 
  return res.status(201).json({
    success: true,
    message: `User ${user.name} is deleted successfully`
  })

})


