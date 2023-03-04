import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"]
  },
  description: {
    type: String,
    required: [true, "Please add a course description"]
  },
  owner: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  lessons: {
    type: [ObjectId],
    ref: "Lesson",
    default: []
  },
  students: {
    type: [ObjectId],
    ref: "User",
    default: []
  }
});

export const CourseModel = mongoose.model("Course", CourseSchema);

