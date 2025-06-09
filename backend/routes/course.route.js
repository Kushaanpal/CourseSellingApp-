import express from "express"; //create web server and handle routes
import { buyCourse, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js";
import userMiddleWare from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

router.post("/create",adminMiddleware,createCourse);
router.put("/update/:courseId",adminMiddleware,updateCourse); 
router.delete("/delete/:courseId",adminMiddleware,deleteCourse);
router.get("/courses",getCourses);
router.get("/:courseId",courseDetails);

router.post("/buy/:courseId",userMiddleWare, buyCourse)
export default router;