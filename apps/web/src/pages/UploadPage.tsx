import { FormEvent, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function UploadPage() {
  const { appUser } = useAuth();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!appUser || !coverFile || !pdfFile) return;
    setLoading(true);
    const ts = Date.now();
    const coverRef = ref(storage, `/covers/${appUser.firebaseUid}/${ts}-${coverFile.name}`);
    const pdfRef = ref(storage, `/pdfs/${appUser.firebaseUid}/${ts}-${pdfFile.name}`);
    await uploadBytes(coverRef, coverFile);
    await uploadBytes(pdfRef, pdfFile);
    const coverUrl = await getDownloadURL(coverRef);
    const pdfUrl = await getDownloadURL(pdfRef);
    await apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(',').map((x) => x.trim()).filter(Boolean),
        coverUrl,
        pdfUrl
      })
    });
    navigate('/feed');
    setLoading(false);
  };

  return (
    <section className="mx-auto max-w-[500px]">
      <form onSubmit={handleSubmit} className="ig-card space-y-4 p-4">
        <h1 className="text-lg font-semibold">Create book post</h1>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-gray-200 p-2 text-sm" />
        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-gray-200 p-2 text-sm" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3" placeholder="Description" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3" placeholder="tags, comma, separated" />
        <button disabled={loading} className="w-full rounded-xl bg-black p-3 text-white">{loading ? 'Uploading...' : 'Publish'}</button>
      </form>
    </section>
  );
}
