import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const LessonSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a lesson title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a lesson description'],
  },
  video: {
    type: String,
    required: [true, 'Please add a lesson video file'],
  },
  course: {
    type: ObjectId,
    ref: 'Course',
    required: true,
  },
  comments: {
    type: [ObjectId],
    ref: 'Comment',
    default: [],
  },
  attachments: {
    type: [{
      value: String,
      mimetype: String,
    }],
    default: [],
  },
});

export const LessonModel = mongoose.model('Lesson', LessonSchema);

