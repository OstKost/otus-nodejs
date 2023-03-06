import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const CommentSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Please add a comment text"]
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  lesson: {
    type: ObjectId,
    ref: "Lesson",
    required: true
  }
});

export const CommentModel = mongoose.model("Comment", CommentSchema);

