import { FC, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CampaignCarousel } from '../components/CampaignCarousel';
import { InteractiveCalendar } from '../components/InteractiveCalendar';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import { useCampaignHubViewModel } from '../viewModels/useCampaignHubViewModel';
import './CampaignHub.scss';

const LOCAL_CAMPAIGNS_KEY = 'mom_local_campaigns';
const OVERRIDES_CAMPAIGNS_KEY = 'mom_campaign_overrides';

export const CampaignHub: FC = () => {
  const {
    activeCampaign,
    otherCampaigns,
    isLoading,
    errorMessage,
  } = useCampaignHubViewModel();

  const [searchParams] = useSearchParams();

  // Debug mode active only if query parameter '?debug=1' is present
  const isDebug = useMemo(() => {
    if (searchParams.get('debug') === '1') return true;
    if (typeof window !== 'undefined' && window.location.search.includes('debug=1')) return true;
    return false;
  }, [searchParams]);

  // Stored custom campaigns created by user
  const [localExtraCampaigns, setLocalExtraCampaigns] = useState<CampaignBase[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_CAMPAIGNS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Stored edits/overrides to any campaign
  const [campaignOverrides, setCampaignOverrides] = useState<Record<string, Partial<CampaignBase>>>(() => {
    try {
      const stored = localStorage.getItem(OVERRIDES_CAMPAIGNS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Create Campaign Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSystem, setNewSystem] = useState<string>('D&D 5E Modificado');
  const [newDM, setNewDM] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newStatus] = useState<CampaignStatusType>('UPCOMING');

  // Edit Campaign Modal state
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignBase | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editSystem, setEditSystem] = useState<string>('');
  const [editDM, setEditDM] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editPlayerCount, setEditPlayerCount] = useState<number | ''>('');
  const [editSessionCount, setEditSessionCount] = useState<number | ''>('');
  const [editStatus, setEditStatus] = useState<CampaignStatusType>('ACTIVE');
  const [editCoverUrl, setEditCoverUrl] = useState<string>('');
  const [editFoundryUrl, setEditFoundryUrl] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');

  // Consolidate all campaigns starting with active one, plus local ones and overrides applied
  const allCampaigns = useMemo<CampaignBase[]>(() => {
    const list: CampaignBase[] = [];
    if (activeCampaign) {
      list.push(activeCampaign);
    }
    list.push(...otherCampaigns);
    list.push(...localExtraCampaigns);

    return list.map((camp) => {
      const override = campaignOverrides[camp.CampaignID];
      return override ? { ...camp, ...override } : camp;
    });
  }, [activeCampaign, otherCampaigns, localExtraCampaigns, campaignOverrides]);

  // Open Edit Modal with campaign's current data
  const handleOpenEditModal = (camp: CampaignBase) => {
    setEditingCampaign(camp);
    setEditTitle(camp.CampaignTitle);
    setEditSystem(camp.CampaignSystem);
    setEditDM(camp.CampaignGameMaster);
    setEditStartDate(camp.CampaignStartDate || '');
    setEditPlayerCount(camp.CampaignPlayerCount ?? '');
    setEditSessionCount(camp.CampaignSessionCount ?? '');
    setEditStatus(camp.CampaignStatus);
    setEditCoverUrl(camp.CampaignCoverUrl || '');
    setEditFoundryUrl(camp.CampaignFoundryUrl || '');
    setEditDesc(camp.CampaignDescription);
    setShowEditModal(true);
  };

  // Save changes to edited campaign
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const updated: Partial<CampaignBase> = {
      CampaignTitle: editTitle.trim(),
      CampaignSystem: editSystem.trim(),
      CampaignGameMaster: editDM.trim(),
      CampaignStartDate: editStartDate.trim() || null,
      CampaignPlayerCount: editPlayerCount === '' ? null : Number(editPlayerCount),
      CampaignSessionCount: editSessionCount === '' ? null : Number(editSessionCount),
      CampaignStatus: editStatus,
      CampaignCoverUrl: editCoverUrl.trim() || null,
      CampaignFoundryUrl: editFoundryUrl.trim() || null,
      CampaignDescription: editDesc.trim(),
    };

    setCampaignOverrides((prev) => {
      const next = {
        ...prev,
        [editingCampaign.CampaignID]: {
          ...prev[editingCampaign.CampaignID],
          ...updated,
        },
      };
      try {
        localStorage.setItem(OVERRIDES_CAMPAIGNS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    setShowEditModal(false);
    setEditingCampaign(null);
  };

  // Create new campaign
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

    setLocalExtraCampaigns((prev) => {
      const next = [...prev, created];
      try {
        localStorage.setItem(LOCAL_CAMPAIGNS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

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

        {isDebug && (
          <div className="mt-2">
            <span
              className="badge d-inline-flex align-items-center gap-2 px-3 py-1 text-uppercase"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                color: '#fcd34d',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
              }}
            >
              <i className="fas fa-terminal" />
              Modo Debug Activo (?debug=1) // Edición y Creación Habilitadas
            </span>
          </div>
        )}
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
        {!isLoading && (allCampaigns.length > 0 || isDebug) && (
          <CampaignCarousel
            campaigns={allCampaigns}
            isDebug={isDebug}
            onAddNewWorld={() => {
              if (isDebug) setShowAddModal(true);
            }}
            onEditCampaign={handleOpenEditModal}
          />
        )}
      </section>

      {/* ---------------- 3. INTERACTIVE SHARED CALENDAR (FIREBASE RTDB & GCAL) ---------------- */}
      <section className="hub-calendar-section">
        <InteractiveCalendar />
      </section>

      {/* ---------------- 4. ADD CAMPAIGN MODAL (ONLY IN DEBUG MODE) ---------------- */}
      {showAddModal && isDebug && (
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

      {/* ---------------- 5. EDIT CAMPAIGN MODAL (ONLY IN DEBUG MODE) ---------------- */}
      {showEditModal && editingCampaign && isDebug && (
        <div className="scifi-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="scifi-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-cyber">
              <h4>
                <i className="fas fa-pen-to-square me-2 text-warning" />
                Editar Crónica: {editingCampaign.CampaignTitle}
              </h4>
              <button
                type="button"
                className="btn-close-cyber"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form-cyber">
              <div className="form-group mb-3">
                <label>Título de la Crónica / Campaña</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6 form-group">
                  <label>Sistema de Juego</label>
                  <input
                    type="text"
                    required
                    value={editSystem}
                    onChange={(e) => setEditSystem(e.target.value)}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Game Master</label>
                  <input
                    type="text"
                    required
                    value={editDM}
                    onChange={(e) => setEditDM(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4 form-group">
                  <label>Estado</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as CampaignStatusType)}
                  >
                    <option value="ACTIVE">Activa (ACTIVE)</option>
                    <option value="UPCOMING">Próximamente (UPCOMING)</option>
                    <option value="DEVELOPMENT">En Desarrollo (DEVELOPMENT)</option>
                    <option value="ARCHIVED">Archivada (ARCHIVED)</option>
                  </select>
                </div>
                <div className="col-md-4 form-group">
                  <label>Aventureros (Héroes)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 4"
                    value={editPlayerCount}
                    onChange={(e) => setEditPlayerCount(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-md-4 form-group">
                  <label>Sesiones Jugadas</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej: 24"
                    value={editSessionCount}
                    onChange={(e) => setEditSessionCount(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6 form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="text"
                    placeholder="Ej: 15 de febrero de 2024"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Enlace Foundry VTT</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editFoundryUrl}
                    onChange={(e) => setEditFoundryUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>URL de Imagen de Portada</label>
                <input
                  type="url"
                  placeholder="https://... (vacío para fondo por defecto)"
                  value={editCoverUrl}
                  onChange={(e) => setEditCoverUrl(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label>Sinopsis / Descripción Narrativa</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions-cyber">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  <i className="fas fa-check me-1" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
