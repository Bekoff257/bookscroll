import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { BookPost } from '../types';
import { PostCard } from '../components/PostCard';

export function FeedPage() {
  const [posts, setPosts] = useState<BookPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFeed = async (next = false) => {
    setLoading(true);
    const data = await apiFetch<{ posts: BookPost[]; nextCursor: string | null }>(`/feed${next && cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
    setPosts((prev) => (next ? [...prev, ...data.posts] : data.posts));
    setCursor(data.nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && cursor && !loading) {
        loadFeed(true);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [cursor, loading]);

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (currentlyLiked) await apiFetch(`/posts/${postId}/like`, { method: 'DELETE' });
    else await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, likedByMe: !currentlyLiked, likesCount: p.likesCount + (currentlyLiked ? -1 : 1) } : p)));
  };

  return (
    <section className="mx-auto max-w-[500px] space-y-4">
      <div className="ig-card p-3">
        <div className="flex gap-2 overflow-x-auto">
          {['For You', 'Following', '#Fantasy', '#Romance', '#SelfHelp', '#SciFi'].map((chip) => (
            <span key={chip} className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">{chip}</span>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {posts.map((post) => <PostCard key={post._id} post={post} onLike={toggleLike} />)}
      </div>
      {loading && <p className="text-center text-sm text-gray-400">Loading...</p>}
    </section>
  );
}
