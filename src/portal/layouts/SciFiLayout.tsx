import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth';
import './SciFiLayout.scss';

export const SciFiLayout: FC = () => {
  const { session } = useAuth();

  return (
    <div className="scifi-portal-shell">
      {/* Sci-Fi Top Navigation Bar */}
      <header className="scifi-topbar">
        <div className="topbar-inner">
          <Link to="/campaigns" className="brand-mark">
            <span className="brand-title-main">MULTIVERSE OF MADNESS</span>
          </Link>

          <div className="topbar-actions">
            <a
              href="http://practically-marine.tun.ply.gg:61342"
              target="_blank"
              rel="noreferrer"
              className="btn-vtt-quick"
              title="Abrir túnel directo al servidor Foundry VTT"
            >
              <span className="vtt-dot" />
              <span>Foundry VTT</span>
            </a>

            {session ? (
              <Link to="/dashboard" className="btn-intranet-login">
                <i className="fas fa-terminal" />
                <span>Intranet ({session.username})</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-intranet-login">
                <i className="fas fa-key" />
                <span>Acceso Agente</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Stage */}
      <div className="scifi-main-stage">
        <Outlet />
      </div>

      {/* Modern Sci-Fi Global Footer */}
      <footer className="scifi-footer">
        <div className="footer-bottom">
          <span>© 2024-2026 MULTIVERSE OF MADNESS // CIUDADELA ZAREK</span>
          <span>DISEÑADO PARA TRANSMISIÓN NARRATIVA Y GESTIÓN VTT</span>
        </div>
      </footer>
    </div>
  );
};
