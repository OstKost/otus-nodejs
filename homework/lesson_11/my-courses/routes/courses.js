import express from 'express';
import * as controller from '../controllers/courses.js';
import * as controllerLessons from '../controllers/lessons.js';
import { protect } from '../middleware/routeProtect.js';
import { studentProtect } from '../middleware/studentProtect.js';

export const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(controller.getCourses)
  .post(protect, controller.addCourse);

router
  .route('/:courseId')
  .get(controller.getCourse)
  .put(protect, controller.updateCourse)
  .delete(protect, controller.deleteCourse);

router
  .route('/:courseId/lessons')
  .get(controllerLessons.getLessons)
  .post(protect, controllerLessons.addLesson);

router
  .route('/:courseId/lessons/:lessonId')
  .get(studentProtect, controllerLessons.getLesson)
  .put(protect, controllerLessons.updateLesson)
  .delete(protect, controllerLessons.deleteLesson);

router
  .route('/:courseId/students/:userId*?')
  .post(protect, controller.addStudent)
  .delete(protect, controller.deleteStudent);

