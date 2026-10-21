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

  const isBTTF = !selectedCampaign || selectedCampaign.CampaignID === 'bttf';

  return (
    <div className="scifi-hub-container">
      {/* ---------------- 1. COMMAND HEADER ---------------- */}
      <header className="hub-command-header">
        <div className="header-pill-badge">
          <i className="fas fa-satellite-dish me-2" />
          <span>Centro de Operaciones & Lore Multiversal</span>
        </div>

        <h1 className="header-main-title">
          MULTIVERSE OF MADNESS
        </h1>

        <p className="header-tagline">
          Catálogo de universos y campañas VTT. Selecciona una card para explorar su expediente de lore,
          facciones y servidor de juego.
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
          <p className="mt-2 text-muted font-monospace">Sincronizando universos...</p>
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

      {/* ---------------- 3. LORE PILLARS (WHEN BTTF IS SELECTED) ---------------- */}
      {isBTTF && (
        <section className="active-lore-pillars-section">
          <div className="section-headline">
            <span className="sub-tag">
              <i className="fas fa-microchip me-1" />
              Expedientes Clave de la Campaña
            </span>
            <h2 className="main-title">Pilares de Back To The Future</h2>
            <p className="desc">
              Accede a los archivos geopolíticos, facciones y mecánicas que rigen la Dimensión 21
              en la convergencia temporal de Volkxus.
            </p>
          </div>

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
                Pieza tocada/movida, combate narrativo de 3 acciones y eventos caóticos mariposa.
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* ---------------- 4. FEATURED LORE DOSSIERS ---------------- */}
      <section className="featured-lore-section">
        <div className="section-headline">
          <span className="sub-tag">
            <i className="fas fa-database me-1" />
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
              <i className="fas fa-arrow-right ms-1" />
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
              <i className="fas fa-arrow-right ms-1" />
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
              <i className="fas fa-arrow-right ms-1" />
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
              <i className="fas fa-arrow-right ms-1" />
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
              <i className="fas fa-arrow-right ms-1" />
            </span>
          </Link>

          {/* Card 6: Maestro Soldador Glen Eldric */}
          <Link to="/wiki/bttf/back-to-the-future-past-and-future" className="lore-dossier-card">
            <span className="card-category-badge">Magia Vs Ciencia // Filosofía</span>
            <h4 className="card-dossier-title">La Disputa de la Magia y la Ciencia</h4>
            <p className="card-snippet">
              "La magia es solo ciencia que aún no ha sido analizada o descubierta". El conflicto
              ideológico entre los conservadores de Volkxus, el Partido Libertador y el Partido
              Unificador.
            </p>
            <span className="card-footer-cta">
              <span>Leer expediente completo</span>
              <i className="fas fa-arrow-right ms-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------- 5. ADD CAMPAIGN MODAL ---------------- */}
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
