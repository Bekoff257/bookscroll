import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { BookPost, CommentType } from '../types';
import { PostCard } from '../components/PostCard';

export function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BookPost | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState('');

  const load = async () => {
    const postRes = await apiFetch<{ post: BookPost }>(`/posts/${id}`);
    const commentRes = await apiFetch<{ comments: CommentType[] }>(`/posts/${id}/comments`);
    setPost(postRes.post);
    setComments(commentRes.comments);
  };

  useEffect(() => {
    load();
  }, [id]);

  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    await apiFetch(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
    setText('');
    load();
  };

  if (!post) return null;

  return (
    <section className="mx-auto max-w-[500px] space-y-4">
      <PostCard post={post} />
      <div className="ig-card p-3">
        <iframe src={post.pdfUrl} title={post.title} className="h-80 w-full rounded-xl border border-gray-200" />
        <a href={post.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-lg bg-black px-3 py-2 text-sm text-white">Open PDF in new tab</a>
      </div>
      <div className="ig-card p-3">
        <p className="mb-2 font-medium">Comments</p>
        <div className="space-y-2">
          {comments.map((c) => <p key={c._id} className="text-sm"><span className="font-medium">{c.userId.username}</span> {c.text}</p>)}
        </div>
        <form onSubmit={addComment} className="mt-3 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded-xl border border-gray-200 p-2 text-sm" placeholder="Add a comment" />
          <button className="rounded-xl bg-black px-3 text-sm text-white">Post</button>
        </form>
      </div>
    </section>
  );
}
