# Proposal

## Why

The current portal lacks a centralized, immersive Sci-Fi lore presentation and a Foundry VTT-style campaign selection hub. Players and GMs need a modern, visually striking Wiki experience that replaces cluttered fandom layouts with a high-end sci-fi aesthetic, housing the complete lore and rules from the "Multiverse of Madness" Fandom wiki while providing a modular home screen where "Back To The Future" is featured as the active campaign alongside support for future campaigns.

## What Changes

- **Foundry-Style Campaign Hub (Home)**: Transform the home landing experience to present a campaign selector inspired by Foundry VTT world cards, featuring "Back To The Future: Past & Future" as the active, launchable campaign with metadata (status, system, date, GM, player count), with the ability to add cards for future campaigns.
- **Modern Sci-Fi Lore Wiki Engine**: Implement a full-featured Sci-Fi Lore Wiki replacing standard Fandom aesthetics with a responsive, dark cyberpunk/futuristic UI (sleek typography, glow accents, infoboxes, category trees, fast instant search, and cross-wiki navigation).
- **Comprehensive Lore Migration**: Migrate all 29 lore articles and assets from `https://multiverse-of-madness.fandom.com/es/wiki/Wiki_Multiverse_Of_Madness`, including Factions (Trifarix, Bloodfallen, Demiergus, Kri'grash, Valrius), Lore & Dimensions (Volkxus, Dimensión 21, Mundo Espiritual, Eones), Characters/PCs (Kelberos, Kasumi, Telemachus, Dorian, Mr. Marrow, etc.), and the complete BTTF Campaign Ruleset (Hardcore mode, chaotic narrative, terms & conditions).
- **MVVM & Constituciones Compliance**: Architect the wiki and campaign modules following strict MVVM separation (pure data Models, Service/DataAccess abstractions, ViewModel hooks/state, clean Views) adhering to `Constitution_Brendup.md` and MITICA-ODOO standards.

## Capabilities

### New Capabilities
- `campaign-hub`: Foundry VTT-style home campaign management and selection dashboard, displaying active campaigns ("Back To The Future: Past & Future") and extensible campaign cards for future storylines.
- `scifi-lore-wiki`: Modern sci-fi lore wiki platform hosting the complete Fandom content with category navigation, infoboxes, markdown/wikitext rendering, search, and cross-linking.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend Navigation & Routing**: Introduces public/portal routes for `/campaigns` (or home landing) and `/wiki/:campaignId/:articleSlug` (with backward-compatible aliases for legacy articles).
- **Data Models & Storage**: Introduces structured JSON/TypeScript models for campaigns (`CampaignBase`, `CampaignFilter`, etc.) and wiki articles (`WikiArticleBase`, `WikiArticleFilter`, etc.), along with static seed data containing the complete migrated Fandom lore.
- **Dependencies**: Utilizes existing React 19, TypeScript, React Router v7, and SCSS modules with no invasive third-party overhead.
