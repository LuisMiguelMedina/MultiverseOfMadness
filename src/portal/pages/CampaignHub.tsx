import { FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CampaignCarousel } from '../components/CampaignCarousel';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import { useCampaignHubViewModel } from '../viewModels/useCampaignHubViewModel';
import './CampaignHub.scss';

export const CampaignHub: FC = () => {
  const {
    activeCampaign,
    otherCampaigns,
    isLoading,
    errorMessage,
  } = useCampaignHubViewModel();

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignBase | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSystem, setNewSystem] = useState<string>('D&D 5E Modificado');
  const [newDM, setNewDM] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newStatus] = useState<CampaignStatusType>('UPCOMING');
  const [localExtraCampaigns, setLocalExtraCampaigns] = useState<CampaignBase[]>([]);

  // Consolidate all campaigns starting with the active one
  const allCampaigns = useMemo<CampaignBase[]>(() => {
    const list: CampaignBase[] = [];
    if (activeCampaign) {
      list.push(activeCampaign);
    }
    list.push(...otherCampaigns);
    list.push(...localExtraCampaigns);
    return list;
  }, [activeCampaign, otherCampaigns, localExtraCampaigns]);

  const focusedCampaign = selectedCampaign || allCampaigns[0] || null;

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
      CampaignWikiHomeSlug: slug,
      CampaignTags: ['Comunidad', 'Nuevo Mundo'],
    };

    setLocalExtraCampaigns((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDM('');
  };

  return (
    <div className="scifi-hub-container">
      {/* ---------------- 1. COMMAND HEADER ---------------- */}
      <header className="hub-command-header">
        <h1 className="header-main-title">
          MULTIVERSE OF MADNESS
        </h1>

        <p className="header-tagline">
          Los universos más cercanos a nosotros no tienen las mismas historias que contar, pero una verdad tienen todos. Somos y seremos pertenecientes al dictamen del cosmos
        </p>
      </header>

      {errorMessage && (
        <div className="alert alert-danger font-monospace mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2" />
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status" />
          <p className="mt-2 text-muted font-monospace">Sincronizando universos del multiverso...</p>
        </div>
      )}

      {/* ---------------- 2. CENTRALIZED WORLD SELECTOR CAROUSEL ---------------- */}
      <section className="hub-carousel-section">
        <CampaignCarousel
          campaigns={allCampaigns}
          onAddNewWorld={() => setShowAddModal(true)}
          onSelectCampaign={setSelectedCampaign}
        />
      </section>

      {/* ---------------- 3. FOCUSED CAMPAIGN ACTION HUD ---------------- */}
      {focusedCampaign && (
        <section className="hub-focused-hud-section">
          <div className="focused-hud-card">
            <div className="focused-hud-header">
              <div className="hud-badge-tag">
                <i className="fas fa-crosshairs me-1" />
                <span>Mundo Enfocado // Sector: {focusedCampaign.CampaignID.toUpperCase()}</span>
              </div>
              <span className="hud-status-chip">
                ● Estado: {focusedCampaign.CampaignStatus}
              </span>
            </div>

            <div className="focused-hud-body">
              <div className="hud-info-main">
                <h3 className="hud-campaign-title">{focusedCampaign.CampaignTitle}</h3>
                <p className="hud-campaign-desc">{focusedCampaign.CampaignDescription}</p>

                <div className="hud-meta-pills">
                  <span className="meta-pill">
                    <i className="fas fa-microchip me-1" />
                    <strong>Sistema:</strong> {focusedCampaign.CampaignSystem}
                  </span>
                  <span className="meta-pill">
                    <i className="fas fa-crown me-1" />
                    <strong>Game Master:</strong> {focusedCampaign.CampaignGameMaster}
                  </span>
                  <span className="meta-pill">
                    <i className="fas fa-dice-d20 me-1" />
                    <strong>Sesiones:</strong> {focusedCampaign.CampaignSessionCount ?? 0}
                  </span>
                </div>
              </div>

              <div className="hud-actions-group">
                <Link
                  to={`/wiki/${focusedCampaign.CampaignID}${
                    focusedCampaign.CampaignWikiHomeSlug ? `/${focusedCampaign.CampaignWikiHomeSlug}` : ''
                  }`}
                  className="btn-hud-wiki"
                >
                  <i className="fas fa-book-journal-whills me-2" />
                  <span>Entrar a la Wiki de este Mundo</span>
                </Link>

                {focusedCampaign.CampaignFoundryUrl ? (
                  <a
                    href={focusedCampaign.CampaignFoundryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-hud-foundry"
                  >
                    <i className="fas fa-play me-2" />
                    <span>Conectar a Foundry VTT</span>
                  </a>
                ) : (
                  <div className="btn-hud-disabled">
                    <i className="fas fa-clock me-2" />
                    <span>Servidor VTT en preparación</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 4. COMPATIBLE SYSTEMS ECOSYSTEM ---------------- */}
      <section className="hub-systems-section">
        <div className="section-headline">
          <span className="sub-tag">
            <i className="fas fa-cubes me-1" />
            Diversidad Lúdica // TTRPG Moderno
          </span>
          <h2 className="main-title">Ecosistema de Sistemas & Géneros</h2>
          <p className="desc">
            El Multiverse of Madness alberga campañas con dinámicas narrativas personalizadas, desde
            alta ciencia ficción y fantasía táctica hasta horror cósmico y operaciones encubiertas.
          </p>
        </div>

        <div className="systems-cards-grid">
          <div className="system-feature-card">
            <div className="system-icon-box">
              <i className="fas fa-dice-d20" />
            </div>
            <h4>D&D 5E Modificado</h4>
            <p>
              Combate táctico de 3 acciones, reloj de tensión de eventos mariposa y reglas de muerte
              hardcore adaptadas para una experiencia inmersiva.
            </p>
            <span className="system-badge-pill">Fantasía & Sci-Fi Híbrido</span>
          </div>

          <div className="system-feature-card">
            <div className="system-icon-box">
              <i className="fas fa-shield-halved" />
            </div>
            <h4>Cyber-Ops & Infiltración</h4>
            <p>
              Operaciones de reconocimiento dimensional, armamento adaptable, sigilo cibernético y
              protocolos tácticos de intervención rápida.
            </p>
            <span className="system-badge-pill">Militar & Cyberpunk</span>
          </div>

          <div className="system-feature-card">
            <div className="system-icon-box">
              <i className="fas fa-eye" />
            </div>
            <h4>Horror Cósmico & Eones</h4>
            <p>
              Enfrentamiento con entidades arcanas primordiales, pruebas de cordura mental y
              resolución de misterios en los bordes de la realidad.
            </p>
            <span className="system-badge-pill">Sobrenatural & Arcano</span>
          </div>

          <div className="system-feature-card">
            <div className="system-icon-box">
              <i className="fas fa-server" />
            </div>
            <h4>Foundry VTT Nativo</h4>
            <p>
              Mapas con iluminación dinámica, efectos visuales por capas, automatización de tiradas
              y sincronización instantánea con las fichas de agentes.
            </p>
            <span className="system-badge-pill">Infraestructura VTT</span>
          </div>
        </div>
      </section>

      {/* ---------------- 5. MULTIVERSE ACCESS PROTOCOL ---------------- */}
      <section className="hub-protocol-section">
        <div className="section-headline">
          <span className="sub-tag">
            <i className="fas fa-network-wired me-1" />
            Protocolo de Enlace // Guía Rápida
          </span>
          <h2 className="main-title">¿Cómo Explorar el Multiverso?</h2>
          <p className="desc">
            Sigue estos tres pasos para adentrarte en cualquiera de nuestras campañas activas.
          </p>
        </div>

        <div className="protocol-steps-grid">
          <div className="protocol-step-card">
            <div className="step-number">01</div>
            <h4>Selecciona un Universo</h4>
            <p>
              Navega en el carrusel interactivo para examinar las crónicas activas, sus sistemas de
              juego y sinopsis de ambientación.
            </p>
          </div>

          <div className="protocol-step-card">
            <div className="step-number">02</div>
            <h4>Desclasifica su Wiki</h4>
            <p>
              Haz clic en "Explorar Wiki" en la card del mundo para acceder a su enciclopedia
              dedicada: facciones, personajes, lugares y reglas específicas.
            </p>
          </div>

          <div className="protocol-step-card">
            <div className="step-number">03</div>
            <h4>Conéctate a Foundry VTT</h4>
            <p>
              Lanza la conexión directa al servidor de juego cuando la sesión esté en vivo para
              tomar control de tu ficha de personaje y el mapa de batalla.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 6. GLOBAL METRICS ---------------- */}
      <section className="hub-metrics-section">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-value">3+</span>
            <span className="metric-label">Universos Catalogados</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">25+</span>
            <span className="metric-label">Sesiones Crónicas</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">100%</span>
            <span className="metric-label">Wikis Aisladas por Mundo</span>
          </div>
          <div className="metric-box">
            <span className="metric-value">VTT 24/7</span>
            <span className="metric-label">Soporte Foundry Integrado</span>
          </div>
        </div>
      </section>

      {/* ---------------- 7. ADD CAMPAIGN MODAL ---------------- */}
      {showAddModal && (
        <div className="scifi-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="scifi-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-cyber">
              <h4>
                <i className="fas fa-plus-circle me-2" />
                Registrar Nuevo Mundo TTRPG
              </h4>
              <button
                type="button"
                className="btn-close-cyber"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="modal-form-cyber">
              <div className="form-group mb-3">
                <label>Título de la Campaña / Mundo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Crónicas de los Eones: Éxodo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6 form-group">
                  <label>Sistema de Juego</label>
                  <input
                    type="text"
                    placeholder="Ej: D&D 5E, Cyberpunk RED..."
                    value={newSystem}
                    onChange={(e) => setNewSystem(e.target.value)}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Game Master</label>
                  <input
                    type="text"
                    placeholder="Nombre o alias del DM"
                    value={newDM}
                    onChange={(e) => setNewDM(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Sinopsis / Ambientación</label>
                <textarea
                  rows={3}
                  placeholder="Describe brevemente la premisa del mundo y sus particularidades narrativas..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions-cyber">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  <i className="fas fa-save me-1" />
                  Registrar en el Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
