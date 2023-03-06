import express from "express";
import * as controller from "../controllers/views.js";
import { studentProtect } from '../middleware/studentProtect.js';

export const router = express.Router();

router.get("/", controller.renderCourses);
router.get("/courses", controller.renderCourses);
router.get("/courses/:courseId", controller.renderCourse);
router.get("/lessons/:lessonId", controller.renderLesson);

