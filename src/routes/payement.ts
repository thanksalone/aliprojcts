import express from 'express'
import { allCoupon, applyDiscount, deleteCoupon, newCoupon } from '../controllers/Payement.js';


const app = express.Router();

// route - /api/v1/payement/coupon/new
app.post("coupon/new", newCoupon);

// route - /api/v1/payement/discount
app.get("/discount",applyDiscount);

// route - /api/v1/payement/coupon/all
app.get("/coupon/all",allCoupon);

// route - /api/v1/payement/coupon/:id
app.delete("/coupon/:id",deleteCoupon);

export default app;