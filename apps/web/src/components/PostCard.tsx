import { Bookmark, Heart, MessageCircle, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookPost } from '../types';

export function PostCard({ post, onLike }: { post: BookPost; onLike?: (postId: string, liked: boolean) => void }) {
  return (
    <article className="ig-card overflow-hidden transition hover:shadow-md">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-400 to-orange-300" />
          <div className="text-sm">
            <p className="font-medium flex items-center gap-1">{post.uploaderId.username} {post.uploaderId.verified && <BadgeCheck size={14} className="text-sky-500" />}</p>
          </div>
        </div>
        <MoreHorizontal size={18} />
      </div>
      <img src={post.coverUrl} alt={post.title} className="h-96 w-full object-cover bg-gray-100" />
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onLike?.(post._id, !!post.likedByMe)} className="hover:text-pink-500"><Heart fill={post.likedByMe ? 'currentColor' : 'none'} size={20} /></button>
            <Link to={`/post/${post._id}`}><MessageCircle size={20} /></Link>
          </div>
          <Bookmark size={20} />
        </div>
        <p className="font-semibold text-sm">{post.title}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
        <p className="mt-1 text-xs text-gray-500">{post.likesCount} likes • {post.commentsCount} comments</p>
        <Link to={`/post/${post._id}`} className="mt-1 block text-xs text-gray-500 hover:text-gray-700">View comments</Link>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
      </div>
    </article>
  );
}
