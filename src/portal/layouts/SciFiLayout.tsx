import { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth';
import './SciFiLayout.scss';

export const SciFiLayout: FC = () => {
  const { session } = useAuth();

  return (
    <div className="scifi-portal-shell fantasy-theme">
      {/* Medieval Fantasy Top Navigation Bar */}
      <header className="scifi-topbar fantasy-topbar">
        <div className="topbar-inner">
          <Link to="/campaigns" className="brand-mark">
            <span className="brand-title-main">PAPUSTANES EN MAZMORRAS</span>
          </Link>

          <div className="topbar-actions">
            <a
              href="http://practically-marine.tun.ply.gg:61342"
              target="_blank"
              rel="noreferrer"
              className="btn-vtt-quick"
              title="Abrir mesa virtual en el servidor Foundry VTT"
            >
              <i className="fas fa-dice-d20 vtt-fantasy-icon" />
              <span>Foundry VTT</span>
            </a>

            {session ? (
              <Link to="/dashboard" className="btn-intranet-login">
                <i className="fas fa-shield-halved" />
                <span>Gremio ({session.username})</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-intranet-login">
                <i className="fas fa-dungeon" />
                <span>Acceso Aventurero</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Stage */}
      <div className="scifi-main-stage">
        <Outlet />
      </div>

      {/* Medieval Fantasy Global Footer */}
      <footer className="scifi-footer fantasy-footer">
        <div className="footer-bottom">
          <span>© 2024-2026 PAPUSTANES EN MAZMORRAS // CRÓNICAS Y AVENTURAS DE ROL</span>
          <span>SALA DE AVENTURAS Y GESTIÓN VTT</span>
        </div>
      </footer>
    </div>
  );
};
