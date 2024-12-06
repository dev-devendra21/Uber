import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const app = express();
import connectToDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";



connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Hello World!");
});



app.use("/users", userRoutes);

export default app;
