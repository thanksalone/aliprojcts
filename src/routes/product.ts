import express from "express"
import { singleUpload } from "../middlewares/multer.js";
import { categories, deleteProduct, getAdminProducts, getsingleProduct, latestProduct, newProduct, updateProduct } from "../controllers/product.js";


const app = express.Router();

app.post("/new",singleUpload, newProduct);


app.get("/latest", latestProduct);

app.get("/categories", categories);

app.get("/Admin-products", getAdminProducts);

app.route("/:id").get(getsingleProduct).put(updateProduct).delete(deleteProduct);



export default app;

