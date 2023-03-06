import { CourseModel } from '../models/CourseModel.js';
import { LessonModel } from '../models/LessonModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const renderCourses = async (req, res) => {
  const courses = await CourseModel.find();
  const content = { title: 'Courses', header: 'Courses', courses };
  res.render('courses', content);
};

export const renderCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await CourseModel.findById(courseId).populate({
      path: 'lessons',
      select: '_id title description',
    });
    if (!course) res.render('notFound', { message: `Course ${courseId} not found` });
    console.log('DEBUG:', 'views => course', course);
    const content = { title: `Course `, header: course?.title, course };
    res.render('course', content);
  } catch (e) {
    res.render('notFound', { message: e.message });
  }
};

export const renderLesson = async (req, res) => {
  const studentId = req.studentId;
  const lessonId = req.params.lessonId;

  // Check is student
  let fields = '';
  const course = await CourseModel.findOne({ lessons: lessonId });
  const isOwner = course && course.owner.toString() === studentId;
  const isStudent = course && course.students.includes(studentId);
  const hasAccess = isOwner || isStudent;

  if (!hasAccess) {
    fields = '-video -attachments -comments';
  }

  const lesson = await LessonModel.findById(lessonId, fields).populate('comments');;
  if (!hasAccess) lesson.depopulate('comments');
  if (!lesson) res.render('notFound', { message: `Lesson ${lessonId} not found` });

  const content = { title: `Lesson ` + lesson.title , header: lesson.title, hasAccess, lesson };
  res.render('lesson', content);
};
