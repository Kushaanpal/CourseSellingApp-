import express from "express";//Is a backend framework for building RESTful api with nodejs.(Representational State Transfer API)
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();

const allowedOrigins=[
  "https://course-selling-app-rust.vercel.app",
  "https://localhost:5173"
];
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
  origin: function (origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
},
  credentials: true,  //so we can handle cookies, CORS, authorization
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Define routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/order",orderRoute);


//cloudinary configuration code
cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
