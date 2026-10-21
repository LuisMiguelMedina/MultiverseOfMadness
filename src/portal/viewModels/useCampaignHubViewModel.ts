/**
 * ViewModel for CampaignHub conforming to Constitution_Brendup.md MVVM architecture.
 * Encapsulates presentation logic, consumes CampaignDataAccess, and exposes reactive state and actions.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CampaignDataAccess } from '../dataAccess/CampaignDataAccess';
import { CampaignBase, CampaignStatusType } from '../models/Campaigns/CampaignModels';

export interface CampaignHubViewModelResult {
  campaigns: CampaignBase[];
  activeCampaign: CampaignBase | null;
  otherCampaigns: CampaignBase[];
  searchTerm: string;
  selectedStatus: CampaignStatusType | 'ALL';
  isLoading: boolean;
  errorMessage: string | null;
  setSearchTerm: (term: string) => void;
  setSelectedStatus: (status: CampaignStatusType | 'ALL') => void;
  refresh: () => void;
}

export function useCampaignHubViewModel(): CampaignHubViewModelResult {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatusType | 'ALL'>('ALL');
  const [campaigns, setCampaigns] = useState<CampaignBase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCampaigns = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);

    const response = CampaignDataAccess.List({
      SearchTerm: searchTerm ? searchTerm : null,
      Status: selectedStatus === 'ALL' ? null : selectedStatus,
    });

    if (response.CodeNumber === 200 && response.Result) {
      setCampaigns(response.Result);
    } else {
      setErrorMessage(response.Message || 'No se pudieron cargar las campañas.');
      setCampaigns([]);
    }

    setIsLoading(false);
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.CampaignStatus === 'ACTIVE') || null;
  }, [campaigns]);

  const otherCampaigns = useMemo(() => {
    return campaigns.filter((c) => c.CampaignID !== activeCampaign?.CampaignID);
  }, [campaigns, activeCampaign]);

  return {
    campaigns,
    activeCampaign,
    otherCampaigns,
    searchTerm,
    selectedStatus,
    isLoading,
    errorMessage,
    setSearchTerm,
    setSelectedStatus,
    refresh: fetchCampaigns,
  };
}
