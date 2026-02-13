import { FormEvent, useState } from 'react';
import { apiFetch } from '../lib/api';
import { AppUser } from '../types';

export function AdminPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    const data = await apiFetch<{ users: AppUser[] }>(`/admin/users?query=${encodeURIComponent(query)}`);
    setUsers(data.users);
  };

  const toggle = async (id: string, verified: boolean) => {
    await apiFetch(`/admin/users/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ verified: !verified }) });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, verified: !verified } : u)));
  };

  return (
    <section className="mx-auto max-w-[500px] ig-card p-4">
      <h1 className="mb-3 text-lg font-semibold">Admin</h1>
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input className="flex-1 rounded-xl border border-gray-200 p-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="username or display name" />
        <button className="rounded-xl bg-black px-3 text-white">Search</button>
      </form>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="flex items-center justify-between rounded-xl border border-gray-200 p-2">
            <p className="text-sm">{u.username} <span className="text-gray-400">({u.displayName})</span></p>
            <button onClick={() => toggle(u._id, u.verified)} className="rounded-lg border border-gray-300 px-2 py-1 text-xs">
              {u.verified ? 'Unverify' : 'Verify'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
