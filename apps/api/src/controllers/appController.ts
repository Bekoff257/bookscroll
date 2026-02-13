import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { BookPost } from '../models/BookPost';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { User } from '../models/User';

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.auth!.mongoUserId);
  res.json({ user });
}

export async function getFeed(req: Request, res: Response) {
  const limit = 10;
  const cursor = req.query.cursor as string | undefined;
  const query: any = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};
  const posts = await BookPost.find(query).sort({ createdAt: -1 }).limit(limit + 1).populate('uploaderId');
  const page = posts.slice(0, limit);
  const nextCursor = posts.length > limit ? page[page.length - 1].createdAt.toISOString() : null;
  const liked = await Like.find({ userId: req.auth!.mongoUserId, postId: { $in: page.map((p) => p._id) } });
  const likedSet = new Set(liked.map((l) => String(l.postId)));

  res.json({
    posts: page.map((p) => ({ ...p.toObject(), likedByMe: likedSet.has(String(p._id)) })),
    nextCursor
  });
}

export async function createPost(req: Request, res: Response) {
  const post = await BookPost.create({ ...req.body, uploaderId: req.auth!.mongoUserId });
  res.status(201).json({ post });
}

export async function getPost(req: Request, res: Response) {
  const post = await BookPost.findById(req.params.id).populate('uploaderId');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const liked = await Like.exists({ userId: req.auth!.mongoUserId, postId: post._id });
  res.json({ post: { ...post.toObject(), likedByMe: !!liked } });
}

export async function likePost(req: Request, res: Response) {
  const postId = new Types.ObjectId(req.params.id);
  await Like.updateOne({ userId: req.auth!.mongoUserId, postId }, { $setOnInsert: { userId: req.auth!.mongoUserId, postId } }, { upsert: true });
  await BookPost.updateOne({ _id: postId }, { $inc: { likesCount: 1 } });
  res.json({ ok: true });
}

export async function unlikePost(req: Request, res: Response) {
  const result = await Like.deleteOne({ userId: req.auth!.mongoUserId, postId: req.params.id });
  if (result.deletedCount) await BookPost.updateOne({ _id: req.params.id }, { $inc: { likesCount: -1 } });
  res.json({ ok: true });
}

export async function getComments(req: Request, res: Response) {
  const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 }).populate('userId', 'username displayName photoUrl verified');
  res.json({ comments });
}

export async function addComment(req: Request, res: Response) {
  const comment = await Comment.create({ postId: req.params.id, userId: req.auth!.mongoUserId, text: req.body.text });
  await BookPost.updateOne({ _id: req.params.id }, { $inc: { commentsCount: 1 } });
  res.status(201).json({ comment });
}

export async function getProfile(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const posts = await BookPost.find({ uploaderId: user._id }).sort({ createdAt: -1 }).populate('uploaderId');
  res.json({ user, posts });
}

export async function adminSearchUsers(req: Request, res: Response) {
  const q = (req.query.query as string) || '';
  const regex = new RegExp(q, 'i');
  const users = await User.find({ $or: [{ username: regex }, { displayName: regex }] }).limit(30);
  res.json({ users });
}

export async function adminToggleVerify(req: Request, res: Response) {
  const user = await User.findByIdAndUpdate(req.params.id, { verified: !!req.body.verified }, { new: true });
  res.json({ user });
}
