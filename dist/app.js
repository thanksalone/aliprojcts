import express from "express";
import NodeCache from "node-cache";
// importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import { connectDB } from "./utils/features.js";
import { errorMidleware } from "./middlewares/error.js";
const port = 4000;
connectDB();
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
//user Routes
app.use("/api/v1/user", userRoute);
//product routes
app.use("/api/v1/product", productRoute);
app.get("/", (req, res) => {
    res.send("Api Workig with /api/v1");
});
app.use("/uploads", express.static("uploads"));
// app.get("/product",(req,res) => {
//     res.send("asdfds");
// })
// const controllerA = (req,res) => {
//     res.send("sasags");
// }
// app.get("/users", controllerA);
app.use(errorMidleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost: ${port}`);
});
