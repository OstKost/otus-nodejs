import { ErrorResponse } from '../utils/errorResponse.js';
import { CourseModel } from '../models/CourseModel.js';

export const getCourses = async (req, res) => {
  const courses = await CourseModel.find().populate({
    path: 'lessons',
    select: '_id title description',
  });
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};

export const getCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await CourseModel.findById(courseId)
    .populate({
      path: 'lessons',
      select: '_id title description',
    });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
};

export const addCourse = async (req, res, next) => {
  const userId = req.user.id;

  req.body.owner = userId;

  const course = await CourseModel.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
};

export const updateCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  let course = await CourseModel.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`, 404),
    );
  }

  // Make sure user is course owner
  if (course.owner.toString() !== userId) {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to update course ${course._id}`,
        401,
      ),
    );
  }

  course = await CourseModel.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true,
  });

  // await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
};

export const deleteCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  const course = await CourseModel.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${courseId}`, 404),
    );
  }

  // Make sure user is course owner
  if (course.owner.toString() !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to delete course ${course._id}`,
        401,
      ),
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const addStudent = async (req, res, next) => {
  const ownerId = req.user.id;
  const userId = req.body.user;
  const courseId = req.params.courseId;

  let course = await CourseModel.findById(courseId);

  // Make sure user is course owner
  if (course.owner.toString() !== ownerId) {
    return next(
      new ErrorResponse(
        `User ${ownerId} is not authorized to update course ${course._id}`,
        401,
      ),
    );
  }

  course.students = [...course.students, userId];
  await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
};

export const deleteStudent = async (req, res, next) => {
  const ownerId = req.user.id;
  const userId = req.body.userId;
  const courseId = req.params.courseId;

  let course = await CourseModel.findById(courseId);

  // Make sure user is course owner
  if (course.owner.toString() !== ownerId) {
    return next(
      new ErrorResponse(
        `User ${ownerId} is not authorized to update course ${course._id}`,
        401,
      ),
    );
  }

  let students = [...course.students];
  const index = students.findIndex(userId);
  students.splice(index, 1);
  course.students = students;
  await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
};
