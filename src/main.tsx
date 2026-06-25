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

// Multiverse of Madness — the ZRK intranet portal, now its own standalone site.
// Public gate (login/register) + an auth-guarded app (pathless guard keeps URLs flat).
const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
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
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
