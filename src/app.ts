import express from "express";
import NodeCache from "node-cache"

// importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/orders.js";
import payementRoute from "./routes/orders.js";
import dashboardRoute from "./routes/stats.js";
import { connectDB } from "./utils/features.js";
import { errorMidleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";



config({
    path: "./.env",
});
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);

export const myCache = new NodeCache();

const app = express();
app.use(express.json());

//jo jo request hum krte hai morgan uski detail humein terminal mein deta hai dear Ali
app.use(morgan("dev"));



//user Routes
app.use("/api/v1/user", userRoute);

//product routes
app.use("/api/v1/product", productRoute);

//order routes
app.use("/api/v1/order", orderRoute);

//Payement Routes
app.use("/api/v1/payement", payementRoute);

//Dashboard or stats Routes
app.use("/api/v1/dashboard", dashboardRoute);



app.get("/", (req, res) => {
    res.send("Api Workig with /api/v1");
})


app.use("/uploads", express.static("uploads"));


// app.get("/product",(req,res) => {
//     res.send("asdfds");
// })

// const controllerA = (req,res) => {
//     res.send("sasags");
// }
// app.get("/users", controllerA);


app.use(errorMidleware)

app.listen(port, ()=>{
    console.log(`Server is working on http://localhost: ${port}`);
});