import { NextFunction, Request, Response } from 'express';
import { admin } from '../config/firebase';
import { User } from '../models/User';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      const seed = (decoded.email?.split('@')[0] || `user${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
      user = await User.create({
        firebaseUid: decoded.uid,
        username: `${seed}${Math.floor(Math.random() * 1000)}`,
        displayName: decoded.name || decoded.email || 'BookScroll User',
        photoUrl: decoded.picture
      });
    }

    req.auth = { uid: decoded.uid, mongoUserId: user._id, role: user.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}
