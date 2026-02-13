import { Schema, model, Types } from 'mongoose';

const bookPostSchema = new Schema(
  {
    uploaderId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    coverUrl: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const BookPost = model('BookPost', bookPostSchema);
