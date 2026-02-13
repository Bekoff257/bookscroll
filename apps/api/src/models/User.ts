import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    photoUrl: String,
    verified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = model('User', userSchema);
