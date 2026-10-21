/**
 * DataAccess layer for Campaigns conforming to Constitution_Brendup.md.
 * All classes and methods are strictly static, adhere to transactional responses,
 * and contain zero unhandled throw statements.
 */

import { CAMPAIGNS_SEED } from '../data/campaigns.seed';
import { CampaignBase, CampaignFilter, CampaignFind } from '../models/Campaigns/CampaignModels';
import { ResponseObject } from '../models/Common/TransactionModels';

export class CampaignDataAccess {
  /**
   * Lists campaigns matching optional filter criteria.
   */
  public static List(filter?: CampaignFilter | null): ResponseObject<CampaignBase[]> {
    try {
      let results: CampaignBase[] = [...CAMPAIGNS_SEED];

      if (filter) {
        if (filter.Status) {
          results = results.filter((c) => c.CampaignStatus === filter.Status);
        }
        if (filter.SearchTerm) {
          const query = filter.SearchTerm.toLowerCase().trim();
          results = results.filter(
            (c) =>
              c.CampaignTitle.toLowerCase().includes(query) ||
              c.CampaignDescription.toLowerCase().includes(query) ||
              c.CampaignTags.some((tag) => tag.toLowerCase().includes(query)),
          );
        }
      }

      return {
        CodeNumber: 200,
        CodeName: 'OK',
        Message: `Found ${results.length} campaign(s).`,
        ErrorNumber: null,
        ServerName: 'local-portal',
        Result: results,
      };
    } catch {
      return {
        CodeNumber: 500,
        CodeName: 'InternalServerError',
        Message: 'Error listing campaigns.',
        ErrorNumber: 500,
        ServerName: 'local-portal',
        Result: null,
      };
    }
  }

  /**
   * Finds a single campaign by ID or Slug.
   */
  public static Find(find: CampaignFind): ResponseObject<CampaignBase> {
    try {
      const target = CAMPAIGNS_SEED.find(
        (c) => c.CampaignID === find.CampaignID || c.CampaignSlug === find.CampaignID,
      );

      if (!target) {
        return {
          CodeNumber: 404,
          CodeName: 'NotFound',
          Message: `Campaign with ID '${find.CampaignID}' was not found.`,
          ErrorNumber: 404,
          ServerName: 'local-portal',
          Result: null,
        };
      }

      return {
        CodeNumber: 302,
        CodeName: 'Found',
        Message: 'Campaign found successfully.',
        ErrorNumber: null,
        ServerName: 'local-portal',
        Result: target,
      };
    } catch {
      return {
        CodeNumber: 500,
        CodeName: 'InternalServerError',
        Message: 'Error finding campaign.',
        ErrorNumber: 500,
        ServerName: 'local-portal',
        Result: null,
      };
    }
  }
}
