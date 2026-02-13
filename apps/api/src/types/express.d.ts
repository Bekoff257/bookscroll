import type { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        uid: string;
        mongoUserId: Types.ObjectId;
        role: 'user' | 'admin';
      };
    }
  }
}

export {};
