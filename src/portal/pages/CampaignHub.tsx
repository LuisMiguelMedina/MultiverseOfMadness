import { FC } from 'react';
import { CampaignCard } from '../components/CampaignCard';
import { CampaignStatusType } from '../models/Campaigns/CampaignModels';
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

  const filterOptions: Array<{ label: string; value: CampaignStatusType | 'ALL' }> = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Activas', value: 'ACTIVE' },
    { label: 'Próximas', value: 'UPCOMING' },
    { label: 'Desarrollo', value: 'DEVELOPMENT' },
  ];

  return (
    <div className="campaign-hub-page">
      <header className="hub-header">
        <div className="header-info">
          <div className="hub-badge">
            <i className="fas fa-satellite-dish" />
            <span>Módulo de Control VTT</span>
          </div>
          <h1 className="hub-title">Centro de Campañas & Universos</h1>
          <p className="hub-subtitle">
            Selecciona un mundo activo para explorar su Lore, reglas y expedientes, o lanza su servidor de juego.
          </p>
        </div>

        <div className="header-controls">
          <div className="search-box">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Buscar por título, tag o sistema…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
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
      </header>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2" />
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando mundos…</span>
          </div>
          <p className="mt-2 text-muted font-monospace">Sincronizando mundos dimensionales…</p>
        </div>
      ) : (
        <>
          {activeCampaign && (selectedStatus === 'ALL' || selectedStatus === 'ACTIVE') && (
            <section className="featured-campaign-wrapper">
              <div className="section-label">
                <i className="fas fa-star" />
                <span>Campaña Principal Activa</span>
              </div>
              <CampaignCard campaign={activeCampaign} isFeatured={true} />
            </section>
          )}

          <section className="other-campaigns-section">
            <div className="section-label">
              <i className="fas fa-layer-group" />
              <span>Líneas Temporales & Futuras Campañas</span>
            </div>

            <div className="campaigns-grid">
              {otherCampaigns.map((camp) => (
                <CampaignCard key={camp.CampaignID} campaign={camp} isFeatured={false} />
              ))}

              <div className="new-campaign-slot">
                <i className="fas fa-plus-circle" />
                <h4>Nueva Campaña / Mundo</h4>
                <p>
                  Espacio reservado para registrar futuras crónicas, universos paralelos y sus wikis de lore.
                </p>
                <span className="slot-badge">Registro Modular Disponible</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
