import { Schema, model, Types } from 'mongoose';

const likeSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    postId: { type: Types.ObjectId, ref: 'BookPost', required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const Like = model('Like', likeSchema);
