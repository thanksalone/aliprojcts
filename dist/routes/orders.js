import express from "express";
import { AllOrder, deleteOrder, getsingleOrder, myOrder, newOrder, ProcessOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
//api/v1/order/new
app.post("/new", newOrder);
//api/v1/order/my
app.get("/my", myOrder);
//api/v1/order/all
app.all("/all", adminOnly, AllOrder);
//api/v1/order/:id
// app.all("/:id",adminOnly, getsingleOrder);
app.route("/:id").get(getsingleOrder).put(adminOnly, ProcessOrder).delete(adminOnly, deleteOrder);
export default app;
