/**
 * Pure data models for Campaigns conforming to Constitution_Brendup.md.
 * Models contain zero methods and only define typed properties.
 */

export type CampaignStatusType = 'ACTIVE' | 'UPCOMING' | 'ARCHIVED' | 'DEVELOPMENT';
export type CampaignDifficultyType = 'Begginer friendly' | 'Intermedio' | 'Difícil' | 'Hardcore';

export interface CampaignCustomButton {
  id: string;
  label: string;
  url: string;
  color?: string | null;
}

export interface CampaignBase {
  CampaignID: string;
  CampaignTitle: string;
  CampaignSlug: string;
  CampaignSystem: string;
  CampaignDescription: string;
  CampaignCoverUrl: string | null;
  CampaignBannerUrl: string | null;
  CampaignStatus: CampaignStatusType;
  CampaignGameMaster: string;
  CampaignStartDate: string | null;
  CampaignPlayerCount: number | null;
  CampaignSessionCount: number | null;
  CampaignDifficulty?: CampaignDifficultyType | string | null;
  CampaignBorderColor?: string | null;
  CampaignButtonColor?: string | null;
  CampaignCustomButtons?: CampaignCustomButton[];
  CampaignFoundryUrl: string | null;
  CampaignWikiHomeSlug: string | null;
  CampaignTags: string[];
}

export interface CampaignInsert extends CampaignBase {}

export interface CampaignUpdate extends CampaignBase {}

export interface CampaignFind {
  CampaignID: string;
}

export interface CampaignFilter {
  SearchTerm: string | null;
  Status: CampaignStatusType | null;
}
