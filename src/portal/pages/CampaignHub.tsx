import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { CampaignCard } from '../components/CampaignCard';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import { useCampaignHubViewModel } from '../viewModels/useCampaignHubViewModel';
import './CampaignHub.scss';

export const CampaignHub: FC = () => {
  const {
    activeCampaign,
    otherCampaigns,
    searchTerm,
    selectedStatus,
    isLoading,
    errorMessage,
    setSearchTerm,
    setSelectedStatus,
  } = useCampaignHubViewModel();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSystem, setNewSystem] = useState<string>('D&D 5E Modificado');
  const [newDM, setNewDM] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newStatus, setNewStatus] = useState<CampaignStatusType>('UPCOMING');
  const [localExtraCampaigns, setLocalExtraCampaigns] = useState<CampaignBase[]>([]);

  const filterOptions: Array<{ label: string; value: CampaignStatusType | 'ALL' }> = [
    { label: 'Todos los Mundos', value: 'ALL' },
    { label: 'Activas', value: 'ACTIVE' },
    { label: 'Próximamente', value: 'UPCOMING' },
    { label: 'En Desarrollo', value: 'DEVELOPMENT' },
  ];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created: CampaignBase = {
      CampaignID: slug,
      CampaignTitle: newTitle,
      CampaignSlug: slug,
      CampaignSystem: newSystem || 'TTRPG Sci-Fi',
      CampaignDescription: newDesc || 'Nueva crónica multiversal en preparación.',
      CampaignCoverUrl: null,
      CampaignBannerUrl: null,
      CampaignStatus: newStatus,
      CampaignGameMaster: newDM || 'Game Master',
      CampaignStartDate: 'Por anunciar',
      CampaignPlayerCount: null,
      CampaignSessionCount: 0,
      CampaignFoundryUrl: null,
      CampaignWikiHomeSlug: null,
      CampaignTags: ['Comunidad', 'Nuevo Mundo'],
    };

    setLocalExtraCampaigns((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDM('');
  };

  const allDisplayOtherCampaigns = [...otherCampaigns, ...localExtraCampaigns];

  return (
    <div className="scifi-hub-container">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="hub-hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <i className="fas fa-satellite-dish" />
            <span>Centro de Operaciones & Lore Multiversal</span>
          </div>

          <h1 className="hero-main-title">
            MULTIVERSE OF MADNESS <br />
            <span className="title-accent">Back To The Future: Past & Future</span>
          </h1>

          <p className="hero-tagline">
            Una narrativa caótica en la fractura del espacio-tiempo. Donde la alta tecnología de
            Volkxus colisiona con el misterio primordial de los Eones y la magia del reino
            espiritual. Explora 29 expedientes canónicos, comanda facciones imperiales y conéctate al
            servidor de juego.
          </p>

          {/* Live HUD Ribbon */}
          <div className="hero-hud-ribbon">
            <div className="hud-item">
              <span className="status-live-indicator" />
              <span>
                Foundry VTT: <strong>En Línea</strong>
              </span>
            </div>
            <div className="hud-item">
              <i className="fas fa-crown" />
              <span>
                Game Master: <strong>Luis Medina (Luismi)</strong>
              </span>
            </div>
            <div className="hud-item">
              <i className="fas fa-skull-crossbones" />
              <span>
                Modo: <strong>Hardcore (Narrativa Caótica)</strong>
              </span>
            </div>
            <div className="hud-item">
              <i className="fas fa-book-bookmark" />
              <span>
                Base de Datos: <strong>29 Expedientes Clasificados</strong>
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Link to="/wiki/bttf" className="btn-cta-primary">
              <i className="fas fa-book-journal-whills" />
              <span>Explorar Wiki de Lore</span>
            </Link>

            <a
              href="http://practically-marine.tun.ply.gg:61342"
              target="_blank"
              rel="noreferrer"
              className="btn-cta-vtt"
            >
              <i className="fas fa-dice-d20" />
              <span>Lanzar Servidor Foundry VTT</span>
            </a>

            <Link to="/wiki/bttf/trifarix" className="btn-cta-ghost">
              <i className="fas fa-shield-halved" />
              <span>Ver Facciones Imperiales</span>
            </Link>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="alert alert-danger font-monospace mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2" />
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status" />
          <p className="mt-2 text-muted font-monospace">Sincronizando universos...</p>
        </div>
      )}

      {/* ---------------- 2. ACTIVE CAMPAIGN PANORAMIC SHOWCASE ---------------- */}
      {activeCampaign && (selectedStatus === 'ALL' || selectedStatus === 'ACTIVE') && (
        <section className="active-world-showcase">
          <div className="section-headline">
            <span className="sub-tag">
              <i className="fas fa-star" />
              Mundo Activo en Curso
            </span>
            <h2 className="main-title">Back To The Future: Past & Future</h2>
            <p className="desc">
              Campaña oficial iniciada el 15 de febrero de 2024. Diseñada para llevar a los jugadores
              a experiencias de juego con party dividida, combate narrativo de 3 acciones y eventos
              caóticos basados en la teoría del caos.
            </p>
          </div>

          <div className="world-panoramic-card">
            <div className="world-panoramic-banner">
              <img
                src="https://static.wikia.nocookie.net/multiverse-of-madness/images/0/08/Site-background-dark/revision/latest?cb=20260421043235&path-prefix=es"
                alt="Back To The Future banner"
              />
              <div className="banner-gradient-overlay" />

              <div className="banner-floating-meta">
                <div className="badge-row">
                  <span className="badge-active">● Campaña Activa</span>
                  <span className="badge-system">D&D 5E — Narrativa Caótica</span>
                </div>
              </div>
            </div>

            <div className="world-panoramic-content">
              <h3 className="world-title">{activeCampaign.CampaignTitle}</h3>
              <p className="world-description">{activeCampaign.CampaignDescription}</p>

              {/* Stats Bar */}
              <div className="world-stats-grid">
                <div className="stat-cell">
                  <span className="stat-label">Fecha de Inicio</span>
                  <span className="stat-val">{activeCampaign.CampaignStartDate}</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-label">Agentes Asignados</span>
                  <span className="stat-val">{activeCampaign.CampaignPlayerCount} Jugadores Activos</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-label">Sesiones de Rol</span>
                  <span className="stat-val">{activeCampaign.CampaignSessionCount} Sesiones</span>
                </div>
                <div className="stat-cell">
                  <span className="stat-label">Dificultad</span>
                  <span className="stat-val">Hardcore & Mortalidad Alta</span>
                </div>
              </div>

              {/* Pillars of Lore Navigation */}
              <div className="lore-pillars-grid">
                <Link to="/wiki/bttf/trifarix" className="pillar-card">
                  <i className="fas fa-shield-halved pillar-icon" />
                  <h5>La Trifarix</h5>
                  <p>
                    El poder tripartito: Familia Fahrenheit, Casa Celsius y la Oligarquía de Valrius.
                  </p>
                </Link>

                <Link to="/wiki/bttf/casa-bloodfallen" className="pillar-card">
                  <i className="fas fa-droplet pillar-icon" />
                  <h5>Casa Bloodfallen</h5>
                  <p>
                    La dinastía vampírica militar de Kelberos Bloodfallen y el Señor de la Sangre.
                  </p>
                </Link>

                <Link to="/wiki/bttf/dimension21-volkxus" className="pillar-card">
                  <i className="fas fa-mountain-city pillar-icon" />
                  <h5>Dimensión 21 & Volkxus</h5>
                  <p>El régimen meritocrático, los estados caídos y el monopolio de petra magus.</p>
                </Link>

                <Link to="/wiki/bttf/back-to-the-future-past-and-future" className="pillar-card">
                  <i className="fas fa-scroll pillar-icon" />
                  <h5>Reglas & Mecánicas</h5>
                  <p>
                    Pieza tocada/movida, combate narrativo sin slots y eventos caóticos mariposa.
                  </p>
                </Link>
              </div>

              {/* Actions */}
              <div className="world-actions-bar">
                <Link
                  to={`/wiki/${activeCampaign.CampaignID}/${activeCampaign.CampaignWikiHomeSlug}`}
                  className="btn-enter-world-wiki"
                >
                  <i className="fas fa-book-open-reader" />
                  <span>Acceder a la Wiki de Esta Campaña</span>
                </Link>

                {activeCampaign.CampaignFoundryUrl && (
                  <a
                    href={activeCampaign.CampaignFoundryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-open-foundry"
                  >
                    <i className="fas fa-play" />
                    <span>Lanzar Servidor de Juego (Foundry VTT)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 3. WORLDS SELECTOR GRID (FUTURE CAMPAIGNS) ---------------- */}
      <section className="worlds-selector-section">
        <div className="section-headline">
          <span className="sub-tag">
            <i className="fas fa-layer-group" />
            Catálogo de Universos VTT
          </span>
          <h2 className="main-title">Líneas Temporales & Futuras Crónicas</h2>
          <p className="desc">
            Al igual que en Foundry VTT, cada campaña funciona como un mundo modular independiente
            con su propio sistema de juego, personajes y wiki de lore asociada.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="hub-filter-bar">
          <div className="search-wrapper">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Filtrar mundos por título o tag…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-pill-filters">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={selectedStatus === opt.value ? 'active' : ''}
                onClick={() => setSelectedStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of worlds */}
        <div className="worlds-grid">
          {allDisplayOtherCampaigns.map((camp) => (
            <CampaignCard key={camp.CampaignID} campaign={camp} isFeatured={false} />
          ))}

          {/* Interactive Slot to Add Future Campaigns */}
          <div
            className="campaign-card featured"
            style={{
              borderStyle: 'dashed',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '340px',
              padding: '2rem',
              textAlign: 'center',
            }}
            onClick={() => setShowAddModal(true)}
          >
            <div style={{ color: '#00ffff', fontSize: '2.5rem', marginBottom: '1rem' }}>
              <i className="fas fa-plus-circle" />
            </div>
            <h4
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: '#ffffff',
                marginBottom: '0.5rem',
              }}
            >
              Registrar Nueva Campaña
            </h4>
            <p style={{ color: '#8fa0c4', fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto 1.25rem' }}>
              Añade un nuevo mundo de juego al catálogo con su ficha descriptiva y su propia wiki de lore.
            </p>
            <span
              style={{
                background: 'rgba(0, 255, 255, 0.15)',
                border: '1px solid #00ffff',
                color: '#00ffff',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: '4px',
              }}
            >
              + Añadir Mundo
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 4. FEATURED LORE DOSSIERS (FANDOM COMPOSITION) ---------------- */}
      <section className="featured-lore-section">
        <div className="section-headline">
          <span className="sub-tag">
            <i className="fas fa-database" />
            Enciclopedia Canónica
          </span>
          <h2 className="main-title">Expedientes Destacados del Lore</h2>
          <p className="desc">
            Acceso directo a las figuras más influyentes, las potencias imperiales y las anomalías
            dimensionales extraídas del archivo central.
          </p>
        </div>

        <div className="lore-cards-grid">
          {/* Card 1: Kelberos Bloodfallen */}
          <Link to="/wiki/bttf/kelberos-bloodfallen" className="lore-dossier-card">
            <span className="card-category-badge">Personaje Jugable // Casa Bloodfallen</span>
            <h4 className="card-dossier-title">Kelberos Bloodfallen</h4>
            <p className="card-snippet">
              Heredero militar de la Casa Bloodfallen. Especializado en artes de combate con sangre y
              resistencia aumentada. Su lealtad familiar rivaliza con la ambición del Señor de la
              Sangre.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>

          {/* Card 2: Kasumi Ryoko */}
          <Link to="/wiki/bttf/kasumi-ryoko" className="lore-dossier-card">
            <span className="card-category-badge">Past & Future // Personaje</span>
            <h4 className="card-dossier-title">Kasumi Ryoko</h4>
            <p className="card-snippet">
              Guerrera ágil con dominio de técnicas ancestrales. Procedente de una dimensión paralela
              donde el pasado místico aún preserva sus artes secretas contra la invasión de la
              tecnología.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>

          {/* Card 3: Telemachus Absol */}
          <Link to="/wiki/bttf/telemachus-absol" className="lore-dossier-card">
            <span className="card-category-badge">BTTF2 PC // Agente de Campo</span>
            <h4 className="card-dossier-title">Telemachus Absol</h4>
            <p className="card-snippet">
              Especialista táctico con armamento adaptativo y enlace dimensional. Figura clave en la
              segunda fase de infiltración temporal en Volkxus.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>

          {/* Card 4: La Trifarix */}
          <Link to="/wiki/bttf/trifarix" className="lore-dossier-card">
            <span className="card-category-badge">Facción Imperial // Poder Supremo</span>
            <h4 className="card-dossier-title">La Trifarix</h4>
            <p className="card-snippet">
              Estructura tripartita que domina el imperio: Familia Fahrenheit (fuerza militar), Casa
              Celsius (investigación técnica) y la Oligarquía de Valrius (diplomacia y comercio).
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>

          {/* Card 5: Dimensión 21 */}
          <Link to="/wiki/bttf/dimension21-volkxus" className="lore-dossier-card">
            <span className="card-category-badge">Plano Dimensional // Geopolítica</span>
            <h4 className="card-dossier-title">Dimensión 21: Volkxus</h4>
            <p className="card-snippet">
              Nación meritocrática y xenofóbica nacida tras la conquista de los estados de Necrora y
              Aiolis. Monopolistas de los artefactos forjados en Petra Magus.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>

          {/* Card 6: Los Eones */}
          <Link to="/wiki/bttf/eones" className="lore-dossier-card">
            <span className="card-category-badge">Cosmología // Deidades Primordiales</span>
            <h4 className="card-dossier-title">Los Eones Primordiales</h4>
            <p className="card-snippet">
              El manuscrito más extenso del multiverso. Describe a las entidades cósmicas ancestrales,
              sus jerarquías de sangre y los orígenes del choque entre Magia y Ciencia.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right" />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------- 5. MODAL REGISTRAR NUEVA CAMPAÑA ---------------- */}
      {showAddModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h4>
                <i className="fas fa-plus-circle me-2 text-info" />
                Registrar Nueva Campaña / Mundo
              </h4>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label>Título de la Campaña</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cyber-City: Protocolo Omega"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Sistema de Juego</label>
                  <input
                    type="text"
                    placeholder="Ej. D&D 5E, Cyberpunk RED, Savage Worlds..."
                    value={newSystem}
                    onChange={(e) => setNewSystem(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Game Master / DM</label>
                  <input
                    type="text"
                    placeholder="Nombre del DM"
                    value={newDM}
                    onChange={(e) => setNewDM(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Estado Inicial</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CampaignStatusType)}
                  >
                    <option value="UPCOMING">Próximamente</option>
                    <option value="DEVELOPMENT">En Desarrollo</option>
                    <option value="ACTIVE">Activa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Breve Resumen de la Trama / Lore</label>
                  <textarea
                    rows={3}
                    placeholder="Describe el contexto de este nuevo universo..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
