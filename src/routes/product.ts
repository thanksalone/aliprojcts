import express from "express"
import { singleUpload } from "../middlewares/multer.js";
import { categories, deleteProduct, getAdminProducts, getAllProducts, getsingleProduct, latestProduct, newProduct, updateProduct } from "../controllers/product.js";


const app = express.Router();

app.post("/new",singleUpload, newProduct);

// Searching All field routes - filter route
app.get("/all", getAllProducts);

app.get("/latest", latestProduct);

app.get("/categories", categories);

app.get("/Admin-products", getAdminProducts);

app.route("/:id").get(getsingleProduct).put(singleUpload,updateProduct).delete(deleteProduct);



export default app;

