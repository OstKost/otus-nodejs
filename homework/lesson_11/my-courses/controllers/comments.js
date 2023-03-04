import { ErrorResponse } from '../utils/errorResponse.js';
import { CommentModel } from '../models/CommentModel.js';
import { LessonModel } from '../models/LessonModel.js';

export const getComments = async (req, res) => {
  const comments = await CommentModel.find();
  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
};

export const getComment = async (req, res, next) => {
  const commentId = req.params.id;
  const comment = await CommentModel.findById(commentId);
  //   .populate({
  //   path: 'comment',
  //   select: 'name description',
  // });

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${commentId}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
};

export const addComment = async (req, res, next) => {
  const lessonId = req.params.lessonId;
  const userId = req.user.id;
  req.body.user = userId;
  req.body.lesson = lessonId;
  const comment = await CommentModel.create(req.body);
  await LessonModel.findByIdAndUpdate(lessonId, { $push: { comments: comment._id } });
  res.status(200).json({
    success: true,
    data: comment,
  });
};

export const updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  let comment = await CommentModel.findById(commentId);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${commentId}`, 404),
    );
  }

  // Make sure user is comment owner
  if (comment.owner.toString() !== userId) {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to update comment ${comment._id}`,
        401,
      ),
    );
  }

  comment = await CommentModel.findByIdAndUpdate(commentId, req.body, {
    new: true,
    runValidators: true,
  });

  await comment.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
};

export const deleteComment = async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${commentId}`, 404),
    );
  }

  // Make sure user is comment owner
  if (comment.owner.toString() !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to delete comment ${comment._id}`,
        401,
      ),
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
};
