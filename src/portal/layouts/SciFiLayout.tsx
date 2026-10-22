import { FC } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
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
            <div className="brand-crest">
              <div className="crest-inner">
                <i className="fas fa-cubes" />
              </div>
            </div>
            <div className="brand-titles">
              <span className="brand-title-main">MULTIVERSE OF MADNESS</span>
              <span className="brand-subtitle-tag">Lore & Campaign Archive</span>
            </div>
          </Link>

          <nav aria-label="Navegación principal">
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/campaigns"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <i className="fas fa-globe-americas" />
                  <span>Campañas & Universos</span>
                </NavLink>
              </li>
            </ul>
          </nav>

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
        <div className="footer-inner">
          <div className="footer-brand">
            <h4>MULTIVERSE OF MADNESS</h4>
            <p>
              Plataforma y enciclopedia canónica de campañas de rol de mesa. Ciencia ficción, magia
              arcana de los Eones y narrativas caóticas ambientadas en dimensiones convergentes.
            </p>
          </div>

          <div className="footer-col">
            <h5>Navegación</h5>
            <ul>
              <li>
                <Link to="/campaigns">Centro de Campañas</Link>
              </li>
              <li>
                <a
                  href="http://practically-marine.tun.ply.gg:61342"
                  target="_blank"
                  rel="noreferrer"
                >
                  Servidor Foundry VTT
                </a>
              </li>
              <li>
                <Link to="/login">Acceso Terminal ZRK</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Sistemas de Rol</h5>
            <ul>
              <li>
                <span className="text-secondary">D&D 5E Narrativa Caótica</span>
              </li>
              <li>
                <span className="text-secondary">Cyber-Ops Táctico</span>
              </li>
              <li>
                <span className="text-secondary">Horror Cósmico & Eones</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Comunidad & DM</h5>
            <ul>
              <li>
                <span className="text-secondary">Host: Luis Medina (Luismi)</span>
              </li>
              <li>
                <span className="text-secondary">Protocolo: Foundry VTT 24/7</span>
              </li>
              <li>
                <span className="text-secondary">Ciudadela ZAREK // Multiverso</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024-2026 MULTIVERSE OF MADNESS // CIUDADELA ZAREK</span>
          <span>DISEÑADO PARA TRANSMISIÓN NARRATIVA Y GESTIÓN VTT</span>
        </div>
      </footer>
    </div>
  );
};
