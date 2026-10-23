import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import './CampaignCarousel.scss';

export interface CampaignCarouselProps {
  campaigns: CampaignBase[];
  isDebug?: boolean;
  onAddNewWorld: () => void;
  onEditCampaign?: (campaign: CampaignBase) => void;
  onSelectCampaign?: (campaign: CampaignBase | null) => void;
}

type CarouselItem =
  | { isAddSlot: false; campaign: CampaignBase }
  | { isAddSlot: true; campaign?: never };

export const CampaignCarousel: FC<CampaignCarouselProps> = ({
  campaigns,
  isDebug,
  onAddNewWorld,
  onEditCampaign,
  onSelectCampaign,
}) => {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Active debug mode check: explicit prop or '?debug=1' in query
  const activeDebug = useMemo(() => {
    if (isDebug !== undefined) return isDebug;
    if (searchParams.get('debug') === '1') return true;
    if (typeof window !== 'undefined' && window.location.search.includes('debug=1')) return true;
    return false;
  }, [isDebug, searchParams]);

  // Build items array: all campaigns + add world slot only in debug mode (?debug=1)
  const items: CarouselItem[] = useMemo(() => {
    const list: CarouselItem[] = campaigns.map((c) => ({ isAddSlot: false as const, campaign: c }));
    if (activeDebug) {
      list.push({ isAddSlot: true as const });
    }
    return list;
  }, [campaigns, activeDebug]);

  const total = items.length;

  // Keep index within bounds if items change
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (total <= 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 0) return;
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
  const renderCard = (
    item: CarouselItem | undefined,
    position: 'center' | 'prev' | 'next',
    idx: number,
  ) => {
    if (!item) {
      return null;
    }

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
              <i className="fas fa-scroll" />
            </div>
            <span className="slot-badge">Códice de Campañas</span>
            <h3 className="slot-title">Crear Nueva Crónica</h3>
            <p className="slot-desc">
              Añade un nuevo reino o campaña con su ambientación, Game Master, enlace a Foundry VTT y
              enciclopedia de lore.
            </p>
            <button
              type="button"
              className="btn-add-action"
              onClick={(e) => {
                e.stopPropagation();
                onAddNewWorld();
              }}
            >
              <i className="fas fa-feather-pointed me-1" />
              + Nueva Crónica
            </button>
          </div>
        </div>
      );
    }

    const camp = item.campaign;
    const isBttf =
      camp.CampaignID.toLowerCase() === 'bttf' ||
      camp.CampaignSlug?.toLowerCase().includes('bttf') ||
      camp.CampaignTitle.toLowerCase().includes('back to the future');

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
            <div className="banner-tags-left">
              {getStatusBadge(camp.CampaignStatus)}
              {activeDebug && (
                <button
                  type="button"
                  className="badge-debug-edit-tool"
                  title="Editar Crónica (Modo ?debug=1)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCampaign?.(camp);
                  }}
                >
                  <i className="fas fa-pen-to-square me-1" />
                  <span>Editar</span>
                </button>
              )}
            </div>
            <span className="badge-system-pill">
              <i className="fas fa-scroll me-1" />
              {camp.CampaignSystem}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-main-body">
          <div className="card-title-group">
            <div className="card-title-meta-bar">
              <span className="card-world-label">Crónica // Ref: {camp.CampaignID.toUpperCase()}</span>
              {activeDebug && (
                <button
                  type="button"
                  className="btn-card-debug-edit-header"
                  title="Editar Crónica (Modo ?debug=1)"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCampaign?.(camp);
                  }}
                >
                  <i className="fas fa-edit me-1" />
                  <span>Editar</span>
                </button>
              )}
            </div>
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
                <i className="fas fa-shield-halved me-1" />
                Aventureros
              </span>
              <span className="hud-value">
                {camp.CampaignPlayerCount !== null ? `${camp.CampaignPlayerCount} Héroes` : 'TBD'}
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
              <i className="fas fa-book-open me-1" />
              <span>Explorar Crónica</span>
            </Link>

            {camp.CampaignFoundryUrl ? (
              <a
                href={camp.CampaignFoundryUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-card-foundry"
                title="Entrar a la mesa virtual Foundry VTT"
                onClick={(e) => {
                  if (position !== 'center') e.preventDefault();
                }}
              >
                <i className="fas fa-dice-d20 me-1" />
                <span>Mesa VTT</span>
              </a>
            ) : (
              <button type="button" className="btn-card-disabled" disabled>
                <i className="fas fa-lock me-1" />
                <span>Mesa Cerrada</span>
              </button>
            )}

            {activeDebug && (
              <button
                type="button"
                className="btn-card-debug-action-edit"
                title="Editar esta campaña (?debug=1)"
                onClick={(e) => {
                  if (position !== 'center') e.preventDefault();
                  e.stopPropagation();
                  onEditCampaign?.(camp);
                }}
              >
                <i className="fas fa-feather-pointed me-1" />
                <span>Editar</span>
              </button>
            )}
          </div>

          {/* Acceso Aventurero integrado dentro de la card de Back To The Future */}
          {isBttf && (
            <div className="card-bttf-auth-row">
              <Link
                to={session ? '/dashboard' : '/login'}
                className="btn-card-adventurer"
                title={session ? `Entrar a la intranet del gremio (${session.username})` : 'Acceso Aventurero'}
                onClick={(e) => {
                  if (position !== 'center') e.preventDefault();
                }}
              >
                <i className={session ? 'fas fa-shield-halved me-1' : 'fas fa-dungeon me-1'} />
                <span>{session ? `Gremio (${session.username})` : 'Acceso Aventurero'}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (total === 0) {
    return null;
  }

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
              it?.isAddSlot
                ? 'Registrar nuevo mundo'
                : `Seleccionar ${it?.campaign?.CampaignTitle || 'Crónica'}`
            }
          />
        ))}
      </div>
    </div>
  );
};
