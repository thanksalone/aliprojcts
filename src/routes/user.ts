import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new",adminOnly, newUser);

//route - /api/v1/user/users
app.get("/all",adminOnly, getAllUsers);


//route - /api/v1/user/randomuser
// app.get("/:id", getUser);
// app.delete("/:id", deleteUser);

app.route("/:id").get(getUser).delete(adminOnly, deleteUser);


export default app;