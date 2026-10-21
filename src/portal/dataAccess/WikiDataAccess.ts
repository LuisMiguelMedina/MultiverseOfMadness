/**
 * DataAccess layer for Sci-Fi Lore Wiki conforming to Constitution_Brendup.md.
 * All classes and methods are strictly static, adhere to transactional responses,
 * and contain zero unhandled throw statements.
 */

import { BTTF_CATEGORIES_SEED, BTTF_WIKI_SEED } from '../data/bttf-wiki.seed';
import { ResponseObject } from '../models/Common/TransactionModels';
import {
  WikiArticleBase,
  WikiArticleFilter,
  WikiArticleFind,
  WikiCategoryBase,
} from '../models/Wiki/WikiModels';

export class WikiDataAccess {
  /**
   * Resolves aliases and redirection targets to canonical slugs.
   */
  public static ResolveAlias(campaignID: string, slugOrAlias: string): string {
    const normalized = slugOrAlias.toLowerCase().trim();
    const articles = campaignID === 'bttf' ? BTTF_WIKI_SEED : [];

    // Direct slug match
    const direct = articles.find((a) => a.ArticleSlug === normalized);
    if (direct) {
      if (direct.ArticleIsRedirect && direct.ArticleRedirectTarget) {
        return direct.ArticleRedirectTarget;
      }
      return direct.ArticleSlug;
    }

    // Alias or title match
    const aliased = articles.find(
      (a) =>
        a.ArticleAliases.some((al) => al.toLowerCase() === normalized) ||
        a.ArticleTitle.toLowerCase() === normalized,
    );
    if (aliased) {
      if (aliased.ArticleIsRedirect && aliased.ArticleRedirectTarget) {
        return aliased.ArticleRedirectTarget;
      }
      return aliased.ArticleSlug;
    }

    return normalized;
  }

  /**
   * Finds a wiki article by CampaignID and ArticleSlug (resolving aliases automatically).
   */
  public static Find(find: WikiArticleFind): ResponseObject<WikiArticleBase> {
    try {
      const canonicalSlug = this.ResolveAlias(find.CampaignID, find.ArticleSlug);
      const articles = find.CampaignID === 'bttf' ? BTTF_WIKI_SEED : [];
      const article = articles.find((a) => a.ArticleSlug === canonicalSlug);

      if (!article) {
        return {
          CodeNumber: 404,
          CodeName: 'NotFound',
          Message: `Article '${find.ArticleSlug}' was not found in campaign '${find.CampaignID}'.`,
          ErrorNumber: 404,
          ServerName: 'local-portal',
          Result: null,
        };
      }

      return {
        CodeNumber: 302,
        CodeName: 'Found',
        Message: 'Article found successfully.',
        ErrorNumber: null,
        ServerName: 'local-portal',
        Result: article,
      };
    } catch {
      return {
        CodeNumber: 500,
        CodeName: 'InternalServerError',
        Message: 'Error retrieving wiki article.',
        ErrorNumber: 500,
        ServerName: 'local-portal',
        Result: null,
      };
    }
  }

  /**
   * Lists wiki articles for a campaign with optional category and search filters.
   */
  public static List(filter: WikiArticleFilter): ResponseObject<WikiArticleBase[]> {
    try {
      let articles = filter.CampaignID === 'bttf' ? [...BTTF_WIKI_SEED] : [];

      // Filter out pure redirects from general listing unless searching
      if (!filter.SearchQuery) {
        articles = articles.filter((a) => !a.ArticleIsRedirect);
      }

      if (filter.Category) {
        const catQuery = filter.Category.toLowerCase();
        articles = articles.filter((a) =>
          a.ArticleCategories.some((cat) => cat.toLowerCase().includes(catQuery)),
        );
      }

      if (filter.SearchQuery) {
        const query = filter.SearchQuery.toLowerCase().trim();
        articles = articles.filter(
          (a) =>
            a.ArticleTitle.toLowerCase().includes(query) ||
            a.ArticleContent.toLowerCase().includes(query) ||
            a.ArticleCategories.some((c) => c.toLowerCase().includes(query)) ||
            a.ArticleAliases.some((al) => al.toLowerCase().includes(query)),
        );
      }

      return {
        CodeNumber: 200,
        CodeName: 'OK',
        Message: `Found ${articles.length} article(s).`,
        ErrorNumber: null,
        ServerName: 'local-portal',
        Result: articles,
      };
    } catch {
      return {
        CodeNumber: 500,
        CodeName: 'InternalServerError',
        Message: 'Error listing wiki articles.',
        ErrorNumber: 500,
        ServerName: 'local-portal',
        Result: null,
      };
    }
  }

  /**
   * Lists available wiki categories for a campaign.
   */
  public static ListCategories(campaignID: string): ResponseObject<WikiCategoryBase[]> {
    try {
      const categories = campaignID === 'bttf' ? BTTF_CATEGORIES_SEED : [];
      return {
        CodeNumber: 200,
        CodeName: 'OK',
        Message: `Found ${categories.length} category/categories.`,
        ErrorNumber: null,
        ServerName: 'local-portal',
        Result: categories,
      };
    } catch {
      return {
        CodeNumber: 500,
        CodeName: 'InternalServerError',
        Message: 'Error listing wiki categories.',
        ErrorNumber: 500,
        ServerName: 'local-portal',
        Result: null,
      };
    }
  }
}
