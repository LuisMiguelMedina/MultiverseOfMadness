import { FC, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import './CampaignCarousel.scss';

export interface CampaignCarouselProps {
  campaigns: CampaignBase[];
  onAddNewWorld: () => void;
  onSelectCampaign?: (campaign: CampaignBase | null) => void;
}

type CarouselItem =
  | { isAddSlot: false; campaign: CampaignBase }
  | { isAddSlot: true; campaign?: never };

export const CampaignCarousel: FC<CampaignCarouselProps> = ({
  campaigns,
  onAddNewWorld,
  onSelectCampaign,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Build items array: all campaigns + add world slot
  const items: CarouselItem[] = [
    ...campaigns.map((c) => ({ isAddSlot: false as const, campaign: c })),
    { isAddSlot: true as const },
  ];

  const total = items.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Notify parent of selected campaign
  useEffect(() => {
    const activeItem = items[currentIndex];
    if (activeItem && !activeItem.isAddSlot && activeItem.campaign) {
      onSelectCampaign?.(activeItem.campaign);
    } else {
      onSelectCampaign?.(null);
    }
  }, [currentIndex, items, onSelectCampaign]);

  const getStatusBadge = (status: CampaignStatusType) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge-status status-active">● Campaña Activa</span>;
      case 'UPCOMING':
        return <span className="badge-status status-upcoming">◆ Próximamente</span>;
      case 'DEVELOPMENT':
        return <span className="badge-status status-dev">▲ En Desarrollo</span>;
      case 'ARCHIVED':
        return <span className="badge-status status-archived">■ Archivada</span>;
      default:
        return <span className="badge-status">{status}</span>;
    }
  };

  // Helper to render an item card
  const renderCard = (item: CarouselItem, position: 'center' | 'prev' | 'next', idx: number) => {
    if (item.isAddSlot) {
      return (
        <div
          key={`slot-${idx}`}
          className={`carousel-card add-slot-card card-pos-${position}`}
          onClick={() => {
            if (position === 'center') {
              onAddNewWorld();
            } else {
              setCurrentIndex(idx);
            }
          }}
          role="button"
          tabIndex={0}
          title={position === 'center' ? 'Registrar nueva campaña' : 'Seleccionar slot de nuevo mundo'}
        >
          <div className="add-slot-content">
            <div className="add-icon-halo">
              <i className="fas fa-plus" />
            </div>
            <span className="slot-badge">VTT Modular Slot</span>
            <h3 className="slot-title">Registrar Nuevo Mundo</h3>
            <p className="slot-desc">
              Añade una nueva campaña con su propia ficha descriptiva, Game Master, enlace a Foundry VTT
              y wiki de lore independiente.
            </p>
            <button
              type="button"
              className="btn-add-action"
              onClick={(e) => {
                e.stopPropagation();
                onAddNewWorld();
              }}
            >
              <i className="fas fa-cube me-1" />
              + Crear Campaña
            </button>
          </div>
        </div>
      );
    }

    const camp = item.campaign;

    return (
      <div
        key={camp.CampaignID}
        className={`carousel-card world-card card-pos-${position}`}
        onClick={() => {
          if (position !== 'center') {
            setCurrentIndex(idx);
          }
        }}
        role="button"
        tabIndex={0}
        title={position !== 'center' ? `Seleccionar ${camp.CampaignTitle}` : undefined}
      >
        {/* Banner with artwork / gradient */}
        <div className="card-header-banner">
          {camp.CampaignCoverUrl ? (
            <img src={camp.CampaignCoverUrl} alt={camp.CampaignTitle} className="banner-img" />
          ) : (
            <div className="banner-fallback-grid">
              <i className="fas fa-globe-americas fallback-icon" />
            </div>
          )}
          <div className="banner-overlay-gradient" />

          {/* Floating Badges */}
          <div className="banner-top-tags">
            {getStatusBadge(camp.CampaignStatus)}
            <span className="badge-system-pill">
              <i className="fas fa-microchip me-1" />
              {camp.CampaignSystem}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-main-body">
          <div className="card-title-group">
            <span className="card-world-label">Mundo VTT // Ref: {camp.CampaignID.toUpperCase()}</span>
            <h3 className="card-title">{camp.CampaignTitle}</h3>
          </div>

          <p className="card-description">{camp.CampaignDescription}</p>

          {/* Meta HUD Grid */}
          <div className="card-hud-grid">
            <div className="hud-cell">
              <span className="hud-label">
                <i className="fas fa-crown me-1" />
                Game Master
              </span>
              <span className="hud-value" title={camp.CampaignGameMaster}>
                {camp.CampaignGameMaster}
              </span>
            </div>

            <div className="hud-cell">
              <span className="hud-label">
                <i className="far fa-calendar-alt me-1" />
                Inicio
              </span>
              <span className="hud-value">{camp.CampaignStartDate || 'Por anunciar'}</span>
            </div>

            <div className="hud-cell">
              <span className="hud-label">
                <i className="fas fa-users me-1" />
                Agentes
              </span>
              <span className="hud-value">
                {camp.CampaignPlayerCount !== null ? `${camp.CampaignPlayerCount} Jugadores` : 'TBD'}
              </span>
            </div>

            <div className="hud-cell">
              <span className="hud-label">
                <i className="fas fa-dice-d20 me-1" />
                Sesiones
              </span>
              <span className="hud-value">
                {camp.CampaignSessionCount !== null ? `${camp.CampaignSessionCount} Sesiones` : '0'}
              </span>
            </div>
          </div>

          {/* Action Buttons for Center Card */}
          <div className="card-actions-row">
            <Link
              to={`/wiki/${camp.CampaignID}${
                camp.CampaignWikiHomeSlug ? `/${camp.CampaignWikiHomeSlug}` : ''
              }`}
              className="btn-card-wiki"
              onClick={(e) => {
                if (position !== 'center') e.preventDefault();
              }}
            >
              <i className="fas fa-book-journal-whills me-1" />
              <span>Explorar Wiki</span>
            </Link>

            {camp.CampaignFoundryUrl ? (
              <a
                href={camp.CampaignFoundryUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-card-foundry"
                title="Lanzar servidor Foundry VTT"
                onClick={(e) => {
                  if (position !== 'center') e.preventDefault();
                }}
              >
                <i className="fas fa-play me-1" />
                <span>Foundry VTT</span>
              </a>
            ) : (
              <button type="button" className="btn-card-disabled" disabled>
                <i className="fas fa-lock me-1" />
                <span>VTT Offline</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  return (
    <div className="campaign-carousel-wrapper">
      {/* Main Stage with Arrows and Cards */}
      <div className="carousel-stage">
        {/* Left Arrow */}
        <button
          type="button"
          className="carousel-nav-btn btn-prev"
          onClick={handlePrev}
          aria-label="Campaña anterior"
          title="Ver campaña anterior (Flecha Izquierda)"
        >
          <i className="fas fa-chevron-left" />
        </button>

        {/* 3D Track */}
        <div className="carousel-track">
          {total > 1 && renderCard(items[prevIndex], 'prev', prevIndex)}
          {renderCard(items[currentIndex], 'center', currentIndex)}
          {total > 1 && renderCard(items[nextIndex], 'next', nextIndex)}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          className="carousel-nav-btn btn-next"
          onClick={handleNext}
          aria-label="Campaña siguiente"
          title="Ver siguiente campaña (Flecha Derecha)"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      {/* Pagination Indicator Pips */}
      <div className="carousel-pips-bar">
        {items.map((it, idx) => (
          <button
            key={idx}
            type="button"
            className={`pip-indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir al mundo ${idx + 1}`}
            title={
              it.isAddSlot
                ? 'Registrar nuevo mundo'
                : `Seleccionar ${it.campaign.CampaignTitle}`
            }
          />
        ))}
      </div>
    </div>
  );
};
