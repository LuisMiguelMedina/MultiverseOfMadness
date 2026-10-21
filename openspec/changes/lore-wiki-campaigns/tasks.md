# Tasks

## 1. Data Models & Lore Seed Migration

- [x] 1.1 Create pure TypeScript models for Campaigns (`CampaignBase`, `CampaignFilter`, etc.) and Wiki Articles (`WikiArticleBase`, `WikiInfoboxBase`, `WikiFilter`) in `src/portal/models/` complying with `Constitution_Brendup.md` (no functions inside models, `ID` in uppercase, nullable types) and verify with typecheck.
- [x] 1.2 Generate canonical seed datasets `campaigns.seed.ts` (with active campaign "Back To The Future: Past & Future" and future placeholders) and `bttf-wiki.seed.ts` containing the full 29 migrated lore pages, categories, and tokens from `wiki_data.json`, verifying all 29 articles are correctly indexed.

## 2. DataAccess & ViewModels (MVVM)

- [x] 2.1 Implement `CampaignDataAccess` and `WikiDataAccess` static handlers in `src/portal/dataAccess/` returning transactional response structures (`ResponseObject<T>`) for finding, listing, searching, and resolving article aliases; verify via unit verification tests.
- [x] 2.2 Implement React ViewModels (`useCampaignHubViewModel`, `useWikiViewModel`) managing UI state, search queries, active category filters, and selection actions; verify state transitions without view errors.

## 3. Foundry VTT-Style Campaign Hub View

- [x] 3.1 Implement `CampaignCard.tsx` component with Foundry VTT world card styling (cover banner, system badge, status tag, player/session count, launch button); verify visual rendering against Foundry reference aesthetic.
- [x] 3.2 Implement `CampaignHub.tsx` home page featuring "Back To The Future: Past & Future" as the active world, an extensible grid for future campaigns, quick-links to Foundry tunnel, and lore wiki entry; verify navigation triggers.

## 4. Modern Sci-Fi Lore Wiki Engine

- [x] 4.1 Implement `WikiInfobox.tsx` supporting sci-fi themed dossiers for characters (tokens, stats, affiliations), factions (executive authority, alignment), and dimensions; verify rendering with "Kelberos Bloodfallen" and "Trifarix".
- [x] 4.2 Implement `WikiSidebar.tsx` and `WikiSearch.tsx` providing category trees, recent articles, quick search filter, and instant result previews; verify dynamic keyword filtering.
- [x] 4.3 Implement `WikiArticleView.tsx` with high-tech typography, dark theme styling, breadcrumb navigation, section tables, and auto-linking for internal wiki pages and aliases; verify rendering for major articles ("Back To The Future", "Eones", "Volkxus").

## 5. Routing, Polish & Build Verification

- [x] 5.1 Integrate routes in `src/main.tsx` (`/` or `/campaigns` for Campaign Hub, `/wiki/:campaignID` and `/wiki/:campaignID/:articleSlug` for Wiki views) and update navigation in `Layout.tsx`; verify route navigation and backwards-compatibility.
- [x] 5.2 Execute `npm run build` and TypeScript type-check to verify zero compilation or lint warnings and ensure complete Spanish UI text consistency.
