import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';
import './CampaignCard.scss';

export interface CampaignCardProps {
  campaign: CampaignBase;
  isFeatured?: boolean;
}

export const CampaignCard: FC<CampaignCardProps> = ({ campaign, isFeatured = false }) => {
  const [imgError, setImgError] = useState(false);

  const getStatusLabel = (status: CampaignStatusType): string => {
    switch (status) {
      case 'ACTIVE':
        return 'Campaña Activa';
      case 'UPCOMING':
        return 'Próximamente';
      case 'DEVELOPMENT':
        return 'En Desarrollo';
      case 'ARCHIVED':
        return 'Archivada';
      default:
        return status;
    }
  };

  const statusClass = `status-${campaign.CampaignStatus.toLowerCase()}`;

  // Default sci-fi backdrop gradient if no image or error
  const renderBanner = () => {
    if (campaign.CampaignCoverUrl && !imgError) {
      return (
        <img
          src={campaign.CampaignCoverUrl}
          alt={campaign.CampaignTitle}
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div className="banner-fallback">
        <i className="fas fa-dice-d20" />
      </div>
    );
  };

  return (
    <div className={`campaign-card ${isFeatured ? 'featured' : ''}`}>
      <div className="campaign-banner">
        {renderBanner()}
        <div className="banner-overlay" />

        <div className={`campaign-status-badge ${statusClass}`}>
          <span className="status-dot" />
          {getStatusLabel(campaign.CampaignStatus)}
        </div>

        <div className="campaign-system-pill">
          <i className="fas fa-microchip" />
          <span>{campaign.CampaignSystem}</span>
        </div>
      </div>

      <div className="campaign-body">
        <h3 className="campaign-title">{campaign.CampaignTitle}</h3>
        <p className="campaign-description">{campaign.CampaignDescription}</p>

        <div className="campaign-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Game Master</span>
            <span className="meta-value" title={campaign.CampaignGameMaster}>
              {campaign.CampaignGameMaster}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Inicio / Ciclo</span>
            <span className="meta-value">{campaign.CampaignStartDate || 'Por anunciar'}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Jugadores</span>
            <span className="meta-value">
              {campaign.CampaignPlayerCount !== null ? `${campaign.CampaignPlayerCount} Jugadores` : 'TBD'}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Dificultad</span>
            <span className="meta-value">
              {campaign.CampaignDifficulty || 'Intermedio'}
            </span>
          </div>
        </div>

        {campaign.CampaignTags.length > 0 && (
          <div className="campaign-tags">
            {campaign.CampaignTags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="campaign-actions">
          <Link
            to={`/wiki/${campaign.CampaignID}${
              campaign.CampaignWikiHomeSlug ? `/${campaign.CampaignWikiHomeSlug}` : ''
            }`}
            className="btn-wiki"
          >
            <i className="fas fa-book-journal-whills" />
            <span>Wiki</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
