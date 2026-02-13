import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    postId: { type: Types.ObjectId, ref: 'BookPost', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Comment = model('Comment', commentSchema);
