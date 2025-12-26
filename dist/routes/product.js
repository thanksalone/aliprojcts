import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import { categories, deleteProduct, getAdminProducts, getAllProducts, getsingleProduct, latestProduct, newProduct, updateProduct } from "../controllers/product.js";
const app = express.Router();
app.post("/new", singleUpload, newProduct);
// Searching All field routes - filter route
//api/v1/product/all
app.get("/all", getAllProducts);
//api/v1/product/latest
app.get("/latest", latestProduct);
//api/v1/product/categories
app.get("/categories", categories);
//api/v1/product/Admin-products
app.get("/Admin-products", getAdminProducts);
//api/v1/product/:id
app.route("/:id").get(getsingleProduct).put(singleUpload, updateProduct).delete(deleteProduct);
export default app;
