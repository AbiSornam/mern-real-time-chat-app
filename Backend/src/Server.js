import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./Routes/auth.route.js"
import ChatRoutes from "./Routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import UserRoutes from "./Routes/user.route.js";
import cors from "cors";
dotenv.config(); 
const app = express();
const port = process.env.PORT ;
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true     //allows cookies from frontend

}

))
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/api/auth" , AuthRoutes)
app.use("/api/users" , UserRoutes)
app.use("/api/chat",ChatRoutes)

app.listen(port,()=>{
    console.log(`Server Started on port   http://localhost:${port}`  );
    connectDB();
})
