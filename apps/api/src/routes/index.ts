import { Router } from 'express';
import {
  addComment,
  adminSearchUsers,
  adminToggleVerify,
  createPost,
  getComments,
  getFeed,
  getMe,
  getPost,
  getProfile,
  likePost,
  unlikePost
} from '../controllers/appController';
import { requireAdmin, requireAuth } from '../middleware/auth';

export const router = Router();

router.use(requireAuth);
router.get('/me', getMe);
router.get('/feed', getFeed);
router.post('/posts', createPost);
router.get('/posts/:id', getPost);
router.post('/posts/:id/like', likePost);
router.delete('/posts/:id/like', unlikePost);
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', addComment);
router.get('/users/:id', getProfile);

router.get('/admin/users', requireAdmin, adminSearchUsers);
router.patch('/admin/users/:id/verify', requireAdmin, adminToggleVerify);
