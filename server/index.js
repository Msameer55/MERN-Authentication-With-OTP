import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js"
const app = express();
const PORT = 5000;

connectDB();

app.use(cors({
  origin : import.meta.env.VITE_API_URL,
  credentials : true
}));
app.use(express.json());


// API Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/auth/v1", authRoutes)

app.listen(PORT, ()=> {
    console.log(` Server running at PORT ${PORT}`)
})