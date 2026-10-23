import { FC, useState, useMemo } from 'react';
import { CampaignCarousel } from '../components/CampaignCarousel';
import { InteractiveCalendar } from '../components/InteractiveCalendar';
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
          Campañas
        </h1>
        <p className="header-tagline-quote">
          Los universos más cercanos a nosotros no tienen las mismas historias que contar, pero una
          verdad tienen todos. Somos y seremos pertenecientes al dictamen del cosmos
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
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2 text-muted font-monospace">Consultando los reinos y crónicas del multiverso...</p>
        </div>
      )}

      {/* ---------------- 2. CENTRALIZED WORLD SELECTOR CAROUSEL ---------------- */}
      <section className="hub-carousel-section">
        <CampaignCarousel
          campaigns={allCampaigns}
          onAddNewWorld={() => setShowAddModal(true)}
        />
      </section>

      {/* ---------------- 3. INTERACTIVE SHARED CALENDAR (FIREBASE RTDB & GCAL) ---------------- */}
      <section className="hub-calendar-section">
        <InteractiveCalendar />
      </section>

      {/* ---------------- 3. ADD CAMPAIGN MODAL ---------------- */}
      {showAddModal && (
        <div className="scifi-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="scifi-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-cyber">
              <h4>
                <i className="fas fa-scroll me-2 text-warning" />
                Registrar Nueva Crónica / Reino
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
                  <i className="fas fa-feather-pointed me-1" />
                  Añadir al Códice de Campañas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
