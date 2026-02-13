import { BadgeCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { AppUser, BookPost } from '../types';

export function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<AppUser | null>(null);
  const [posts, setPosts] = useState<BookPost[]>([]);

  useEffect(() => {
    apiFetch<{ user: AppUser; posts: BookPost[] }>(`/users/${id}`).then((data) => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, [id]);

  if (!user) return null;

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="ig-card p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 to-orange-300" />
          <div>
            <p className="flex items-center gap-1 text-lg font-semibold">{user.username} {user.verified && <BadgeCheck size={16} className="text-sky-500" />}</p>
            <p className="text-sm text-gray-500">{user.displayName}</p>
            <p className="text-xs text-gray-400">{posts.length} posts</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}`}>
            <img src={post.coverUrl} alt={post.title} className="aspect-square w-full rounded-xl object-cover" />
          </Link>
        ))}
      </div>
    </section>
  );
}
