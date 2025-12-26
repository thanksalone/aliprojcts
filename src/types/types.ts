import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    // role: string;
    _id: string;
    dob: Date;
}

export interface NewProductRequestBody {
    // id?:string;
    name: string;
    photo: string;
    category: string;
    price: number;
    stock: number;
 
}




export type ControllerType = (
    req: Request,
     res: Response,
      next: NextFunction) => 
    Promise<void | Response<any, Record<string, any>>> 


export type SearcgRequestQuery = {
    search?: string;
    price?: number;
    category?: string;
    sort?: string;
    page?: number;
    id?:string
}

export interface BaseQuery {
       name?: {
      $regex: string;
      $options: string;
    };
    price?: {$lte: number};
    category?:string;
    _id?:string;
    
}

export type inValidDateCacheType = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
}


///order ... Data
export type orderItemsType = {
    name: string,
    photo: string,
    price: number,
    quantity: number,
    productId: string,
};

export type shippingInfoType = {
    address: string,
    city: string,
    country: string,
    state: string,
    pinCode: number,
   
};
export interface newOrderRequestBody {
    shippingInfo: shippingInfoType;
    user:string;
    subTotal: number;
    tax:number,
    // shippingCharges: number,
    // discount: number,
    total: number,
    orderItems: orderItemsType[],

}
