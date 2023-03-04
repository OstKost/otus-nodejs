import express from 'express';
import * as controller from '../controllers/users.js';

export const router = express.Router({ mergeParams: true });

router
  .route('/:id')
  .get(controller.getUser)
  .put(controller.updateUser);
