import express from 'express';
import * as controller from '../controllers/lessons.js';
import * as controllerComments from '../controllers/comments.js';
import { protect } from '../middleware/routeProtect.js';

export const router = express.Router({ mergeParams: true });

router
  .route('/:lessonId/attachments')
  .post(protect, controller.addAttachment);

router
  .route('/:lessonId/comments')
  .get(protect, controllerComments.getComments)
  .post(protect, controllerComments.addComment);

router
  .route('/:lessonId/comments/:commentId')
  .get(protect, controllerComments.getComment)
  .put(protect, controllerComments.updateComment)
  .delete(protect, controllerComments.deleteComment);


