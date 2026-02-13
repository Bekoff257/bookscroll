import { BookOpenText, CircleUserRound, House, PlusSquare, Search, ShieldCheck } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { appUser } = useAuth();

  return (
    <div className="min-h-screen pb-16 sm:pb-0">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/feed" className="text-xl font-semibold tracking-tight">BookScroll</Link>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-500 w-72">
            <Search size={16} /> Search books
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Link to="/feed"><House size={20} /></Link>
            <Link to="/upload"><PlusSquare size={20} /></Link>
            <Link to={appUser ? `/user/${appUser._id}` : '/auth'}><CircleUserRound size={20} /></Link>
            {appUser?.role === 'admin' && <Link to="/admin"><ShieldCheck size={20} /></Link>}
            {appUser && <button onClick={() => signOut(auth)} className="text-xs text-gray-500 hover:text-gray-700">Logout</button>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white sm:hidden">
        <div className="mx-auto flex h-14 max-w-md items-center justify-around">
          <Link to="/feed"><House size={20} /></Link>
          <Link to="/upload"><PlusSquare size={20} /></Link>
          <Link to="/feed"><BookOpenText size={20} /></Link>
          <Link to={appUser ? `/user/${appUser._id}` : '/auth'}><CircleUserRound size={20} /></Link>
          {appUser?.role === 'admin' && <Link to="/admin"><ShieldCheck size={20} /></Link>}
        </div>
      </nav>
    </div>
  );
}
