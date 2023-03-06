import path from 'path';
import { ErrorResponse } from '../utils/errorResponse.js';
import { LessonModel } from '../models/LessonModel.js';
import { CourseModel } from '../models/CourseModel.js';
import { root } from '../../../utils/dirname.js';

export const getLessons = async (req, res) => {
  const courseId = req.params.courseId;
  const lessons = await LessonModel.find({ course: courseId }, '-video -attachments -comments');
  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons,
  });
};

export const getLesson = async (req, res, next) => {
  const studentId = req.studentId;
  const lessonId = req.params.lessonId;

  // Check is student
  let fields;
  const course = await CourseModel.findOne({ lessons: lessonId });
  const isOwner = course && course.owner.toString() === studentId;
  const isStudent = course && course.students.includes(studentId);
  const hasAccess =isOwner || isStudent;

  if (!hasAccess) {
    fields = '-video -attachments -comments';
  }

  const lesson = await LessonModel.findById(lessonId, fields).populate('comments');
  if (!hasAccess) lesson.depopulate('comments');

  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
};

export const addLesson = async (req, res, next) => {
  const courseId = req.params.courseId;
  req.body.course = courseId;
  // Handle video file
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a video file`, 400));
  }
  const file = req.files.video;
  console.log('DEBUG:', 'lessons => video', file);
  // Check the file type
  // if (!file.mimetype.startsWith('video')) {
  //   return next(new ErrorResponse('Please upload an video', 400));
  // }
  // Check the file size
  const maxSize = process.env.MAX_FILE_UPLOAD;
  if (file.size > maxSize) {
    return next(
      new ErrorResponse(`Please upload a video less then ${maxSize}`, 400),
    );
  }
  // Move file
  const filePath = path.join(root, 'homework', 'lesson_11', 'my-courses', 'public', file.name);
  file.mv(filePath, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    req.body.video = file.name;
    const lesson = await LessonModel.create(req.body);
    const lessonId = lesson._id;
    await CourseModel.findByIdAndUpdate(courseId, { $push: { lessons: lessonId } });
    res.status(200).json({
      success: true,
      data: lesson,
    });
  });
};

export const updateLesson = async (req, res, next) => {
  const lessonId = req.params.lessonId;
  const courseId = req.params.courseId;
  const userId = req.user.id;

  const course = await CourseModel.findById(courseId);

  if (!course || !course.lessons.includes(lessonId)) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId} in course ${courseId}`, 404),
    );
  }

  let lesson = await LessonModel.findById(lessonId);

  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId}`, 404),
    );
  }

  // Make sure user is lesson owner
  if (course.owner.toString() !== userId) {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to update lesson ${lesson._id}`,
        401,
      ),
    );
  }

  lesson = await LessonModel.findByIdAndUpdate(lessonId, req.body, {
    new: true,
    runValidators: true,
  });

  await lesson.save();

  res.status(200).json({
    success: true,
    data: lesson,
  });
};

export const deleteLesson = async (req, res, next) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const userId = req.user.id;

  const course = await CourseModel.findById(courseId);

  if (!course || !course.lessons.includes(lessonId)) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId} in course ${courseId}`, 404),
    );
  }

  const lesson = await LessonModel.findById(lessonId);

  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId}`, 404),
    );
  }

  // Make sure user is lesson owner
  if (course.owner.toString() !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to delete lesson ${lesson._id}`,
        401,
      ),
    );
  }

  await lesson.remove();

  res.status(200).json({
    success: true,
    data: lessonId,
  });
};


export const addAttachment = async (req, res, next) => {
  const lessonId = req.params.lessonId;
  const userId = req.user.id;

  const course = await CourseModel.findOne({ lessons: lessonId });
  if (!course || !course.lessons.includes(lessonId)) {
    return next(
      new ErrorResponse(`No course with the lesson id ${lessonId}`, 404),
    );
  }

  let lesson = await LessonModel.findById(lessonId);
  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${lessonId}`, 404),
    );
  }
  // Make sure user is lesson owner
  if (course.owner.toString() !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${userId} is not authorized to delete lesson ${lesson._id}`,
        401,
      ),
    );
  }
  // Handle files
  if (req.files) {
    const file = req.files.attachment;
    const mimetype = file.mimetype;
    // Check the file size
    const maxSize = process.env.MAX_FILE_UPLOAD;
    if (file.size > maxSize) {
      return next(
        new ErrorResponse(`Please upload an image less then ${maxSize}`, 400),
      );
    }
    // Move file
    const filePath = path.join(root, 'homework', 'lesson_11', 'my-courses', 'public', file.name);
    file.mv(filePath, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
      const attachment = { value: file.name, mimetype };
      await LessonModel.findByIdAndUpdate(lessonId, { $push: { attachments: attachment } });
      lesson = await LessonModel.findById(lessonId);
      res.status(200).json({ success: true, data: lesson });
    });
  }

  // Handle other attachments
  if (!req.files && req.body) {
    const attachment = { value: req.body.attachment, mimetype: null };
    await LessonModel.findByIdAndUpdate(lessonId, { $push: { attachments: attachment } });
    lesson = await LessonModel.findById(lessonId);
    res.status(200).json({ success: true, data: lesson });
  }
};
