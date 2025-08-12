import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
const app = express();
const PORT = 5000;

connectDB();

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}));
app.use(express.json());


// API Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/auth/v1", authRoutes)
app.use("/api/user/v1", userRoutes)

app.listen(PORT, ()=> {
    console.log(` Server running at PORT ${PORT}`)
})