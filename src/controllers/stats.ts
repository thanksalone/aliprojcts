import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";


export const getDashboardStats = TryCatch(async(req,res,next)=>{
    let stats = {};
    if(myCache.has("admin-stats")) stats = JSON.parse(myCache.get("admin-stats") as string);
    else {
        const today = new Date();

        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        const startOfThisMonth =  new Date(today.getFullYear(),today.getMonth(), 1);
        const startOfLastMonth =   new Date(today.getFullYear(),today.getMonth() - 1, 1);
        const endOfLastMonth =   new Date(today.getFullYear(),today.getMonth(), 0);

        const thisMonth = {
            start: startOfThisMonth,
            end: today,
        };
        const lastMonth = {
            start: startOfLastMonth,
            end: endOfLastMonth,
        };


        const thisMonthProductsPromise = Product.find({
            createdAt:{
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

         const lastMonthProductsPromis = Product.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });

//////////////////////

         const thisMonthUsersPromise = User.find({
            createdAt:{
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

         const lastMonthUsersPromis = User.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });


        //////////////////////

         const thisMonthOrdersPromise = Order.find({
            createdAt:{
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });

         const lastMonthOrdersPromis = Order.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });

        const lastSixMonthOrderPromise = Order.find({
            createdAt:{
                $gte: sixMonthAgo,
                $lte: today,
            }
        })






        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProduct,
            lastMonthUsers,
            lastMonthOrders,
            productCount,
            userCount,
            allOrders,
            lastSixMOnthOrders,
            categories,
        ]  = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromis,
            lastMonthUsersPromis,
            lastMonthOrdersPromis,
            Product.countDocument(),
            User.countDocument(),
            Order.find({}).select("total"),
            lastSixMonthOrderPromise,
            Product.distinct("category");
        ]);


    const thisMonthRevenue = thisMonthOrders.reduce(
        (total, order) => total + (order.total || 0), 0
    );


    const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0), 0
    );




        
        // const productChangePercentage = calculatePercentage(thisMonthProducts.length, lastMonthProduct.length);
        // const userChangePercentage = calculatePercentage(thisMonthUsers.length, lastMonthUsers.length);
        // const ordersChangePercentage = calculatePercentage(thisMonthOrders.length, lastMonthOrders.length);


        // stats = {productChangePercentage, userChangePercentage, ordersChangePercentage};

        // ye ooper ko comment kr ke mai ne neechay banaya 

        const changePrecent = {
        revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue)
        product : calculatePercentage(thisMonthProducts.length, lastMonthProduct.length),
        user :calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
        orders : calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        }


           cosnt revenue = allOrders.reduce(
            (total, order) => total + (order.total || 0), 0
        );

        const count = {
            revenue,
            user: userCount,
            product: productCount,
            order: allOrders.length,
            
        };

        const orderMonthCount = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);

        lastSixMOnthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();

            if(monthDiff < 6) {
                // orderMonthCount[5 - monthDiff] += 1;
                //...use botthom as ooper 6 hai to neechay b 6 likha for simplicity
                orderMonthCount[6 - monthDiff -1] += 1;
                orderMonthlyRevenue[6 - monthDiff -1] += order.total;
            };
        });


        const categoriesCountPromise = categories.map((category) => {Product.countDocument({category})});
        const categoriesCount = await Promise.all(categoriesCountPromise);




        const stats = {
            changePrecent,
            count,
            chart:{
                orderMonthCount,
                orderMonthlyRevenue,
            }
        };
    };


    return res.status(200).json({
        success: true,
        stats,
    })


});

export const getPieCharts = TryCatch(async()=>{});

export const getBarCharts = TryCatch(async()=>{});

export const getLineCharts = TryCatch(async()=>{});