import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { FeedPage } from './pages/FeedPage';
import { PostPage } from './pages/PostPage';
import { UploadPage } from './pages/UploadPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function Protected({ children }: { children: JSX.Element }) {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <p className="p-6">Loading...</p>;
  if (!firebaseUser) return <Navigate to="/auth" replace />;
  return children;
}

function AdminProtected({ children }: { children: JSX.Element }) {
  const { appUser, loading } = useAuth();
  if (loading) return <p className="p-6">Loading...</p>;
  if (!appUser || appUser.role !== 'admin') return <Navigate to="/feed" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: '/auth', element: <AuthPage /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/feed" replace /> },
      { path: 'feed', element: <Protected><FeedPage /></Protected> },
      { path: 'post/:id', element: <Protected><PostPage /></Protected> },
      { path: 'upload', element: <Protected><UploadPage /></Protected> },
      { path: 'user/:id', element: <Protected><ProfilePage /></Protected> },
      { path: 'admin', element: <AdminProtected><AdminPage /></AdminProtected> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
