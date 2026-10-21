import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './portal/theme.scss';
import { AuthProvider } from './portal/auth';
import { ProtectedRoute } from './portal/ProtectedRoute';
import { Layout } from './portal/Layout';
import { Login } from './portal/Login';
import { Register } from './portal/pages/Register';
import { Dashboard } from './portal/pages/Dashboard';
import { Profile } from './portal/pages/Profile';
import { Logs } from './portal/pages/Logs';
import { Players } from './portal/pages/Players';
import { Anuncios } from './portal/pages/Anuncios';
import { Directorio } from './portal/pages/Directorio';
import { Misiones } from './portal/pages/Misiones';
import { Articulos } from './portal/pages/Articulos';
import { Settings } from './portal/pages/Settings';
import { CampaignHub } from './portal/pages/CampaignHub';
import { WikiArticleView } from './portal/pages/WikiArticleView';

// Multiverse of Madness — the ZRK intranet portal & Sci-Fi Lore / Campaign Hub.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
const router = createBrowserRouter(
  [
    {
      element: (
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      ),
      children: [
        { index: true, element: <Navigate to="/campaigns" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        {
          element: <Layout />,
          children: [
            { path: 'campaigns', element: <CampaignHub /> },
            { path: 'wiki', element: <Navigate to="/wiki/bttf" replace /> },
            { path: 'wiki/:campaignID', element: <WikiArticleView /> },
            { path: 'wiki/:campaignID/:articleSlug', element: <WikiArticleView /> },
            {
              element: <ProtectedRoute />,
              children: [
                { path: 'dashboard', element: <Dashboard /> },
                { path: 'profile', element: <Profile /> },
                { path: 'logs', element: <Logs /> },
                { path: 'monitoreo', element: <Players /> },
                { path: 'anuncios', element: <Anuncios /> },
                { path: 'directorio', element: <Directorio /> },
                { path: 'misiones', element: <Misiones /> },
                { path: 'articulos', element: <Articulos /> },
                { path: 'settings', element: <Settings /> },
              ],
            },
          ],
        },
        { path: '*', element: <Navigate to="/campaigns" replace /> },
      ],
    },
  ],
  basename ? { basename } : undefined,
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
