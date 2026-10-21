# Design

## Context

See `proposal.md` for project motivation. The current codebase is a React 19 + TypeScript + Vite portal with Bootstrap and custom SCSS styles. We need to introduce:
1. A Foundry VTT-style campaign hub as the primary campaign home.
2. A sleek, high-tech Sci-Fi Lore Wiki hosting the full 29 canonical articles from the Multiverse of Madness Fandom wiki.
3. Strict alignment with `Constitution_Brendup.md` (MVVM architecture, pure models, static data access, English naming, Spanish UI) and MITICA-ODOO standards.

## Goals / Non-Goals

**Goals:**
- Implement the Foundry VTT campaign selector aesthetic (top HUD bar, world grid, active world badge, world detail modal/drawer, launch action).
- Provide "Back To The Future: Past & Future" as the pre-configured active campaign.
- Build an extensible campaign registration architecture allowing new campaign cards with their own wikis to be registered via data/config.
- Render complete, rich lore articles with sci-fi infoboxes (tokens, executive authority, factions, alignment, attributes).
- Provide client-side full-text search, category browsing, and alias resolution (e.g. `Facciones` -> `Trifarix`).
- Follow MVVM pattern: Models in `src/portal/models/`, Data Access in `src/portal/dataAccess/`, ViewModels as React hooks in `src/portal/viewModels/`, and Views in `src/portal/pages/` and `src/portal/components/`.

**Non-Goals:**
- Real-time online multi-user collaborative wiki editing (wiki content is curated canonical lore).
- Modifying the underlying Foundry VTT server or tunnel protocol.
- Replacing existing authentication or profile pages unrelated to the wiki/campaign experience.

## Decisions

### Decision 1: MVVM Architectural Separation (Constitution Brendup)
- **Choice**: Separate frontend into:
  - **Models**: Pure TypeScript types/interfaces (`CampaignBase`, `CampaignFilter`, `WikiArticleBase`, `WikiInfoboxBase`, `WikiFilter`) with no internal methods.
  - **DataAccess / Services**: Static handler classes (`CampaignDataAccess`, `WikiDataAccess`) providing filtered queries, search, and transactional response objects (`ResponseObject<T>`).
  - **ViewModels**: Dedicated hooks (`useCampaignHubViewModel`, `useWikiViewModel`) holding UI state, active selections, search queries, and dispatchable commands.
  - **Views**: Declarative UI components (`CampaignHub.tsx`, `WikiLayout.tsx`, `WikiArticleView.tsx`, `WikiInfobox.tsx`).
- **Rationale**: Complies directly with Articles 1, 2, 4, 17, and 18 of `Constitution_Brendup.md`.

### Decision 2: Seed Lore Data Storage Strategy
- **Choice**: Store the migrated 29 articles and campaign metadata in static, strongly-typed JSON/TS datasets (`src/portal/data/campaigns.seed.ts` and `src/portal/data/bttf-wiki.seed.ts`), preloaded and queryable in-memory.
- **Alternatives considered**:
  - Live API scraping from Fandom at runtime: Rejected due to Cloudflare anti-bot barriers and latency.
  - Firebase Firestore collection: Rejected for initial launch to keep the wiki instantly available offline/static without database credentials, while maintaining the DataAccess layer ready to switch sources if needed.

### Decision 3: Sci-Fi Visual Design System
- **Choice**: Modern dark sci-fi aesthetic with neon cyberpunk accents (cyan `#00f2ff`, magenta/crimson `#ff0055`, amber `#ffaa00`), frosted glass cards (`backdrop-filter: blur`), glowing badges, custom monospace data fonts, and tactical infobox tables instead of Fandom's cluttered ad-heavy tables.
- **Alternatives considered**:
  - Default MediaWiki / Fandom skin (Oasis/FandomDesktop): Rejected by user requirement ("buen diseño y composicion, estilo moderno").

### Decision 4: Routing Integration
- **Choice**:
  - `/campaigns` or Home: Foundry VTT-style Campaign Hub.
  - `/wiki/:campaignID`: Campaign wiki home page (landing on overview or featured lore).
  - `/wiki/:campaignID/:articleSlug`: Specific wiki article view with sidebar navigation and category breadcrumbs.
  - Aliases handled via automatic client-side redirection.

## Risks / Trade-offs

- [Risk] Large lore articles (e.g. Eones ~31KB, Back To The Future ~24KB) could impact initial bundle size.
  → *Mitigation*: Lore seed data is structured with clean text sections and loaded asynchronously via dynamic import or static service lookup.
- [Risk] Custom wikitext markup variations from Fandom.
  → *Mitigation*: Pre-parse templates (e.g. `{{Infobox_personaje}}`, `[[Category:...]]`, `[[Link|Text]]`) into structured fields during ingestion so the React view renders native interactive components.

## Migration Plan

1. Verify and compile the extracted `wiki_data.json` into typed seed structures.
2. Implement Models and DataAccess services.
3. Build ViewModels and UI Views (CampaignHub and LoreWiki).
4. Update router configuration in `src/main.tsx` and navbar in `Layout.tsx`.
5. Verify build via `npm run build`.
