# Spec Delta

## Purpose

Proporciona un Centro de Mando Multiversal generalizado para explorar múltiples campañas y desacopla la experiencia de la wiki de lore detrás de la selección interactiva de cada card.

## ADDED Requirements

### Requirement: Centralized campaign hub home
The portal Home SHALL render a generalized multiverse command center featuring a centralized world carousel, platform overview, supported game systems, and aggregate metrics without embedding individual campaign lore dossiers or faction articles.

#### Scenario: User visits home page
- **WHEN** user visits `/` or `/campaigns`
- **THEN** system displays the Multiverse of Madness command center with the centralized campaign selector, system capabilities, and general platform overview
- **THEN** system does not render BTTF-specific lore pillars, faction listings, or character dossiers on the Home page

#### Scenario: User switches campaign in carousel
- **WHEN** user navigates through campaigns using arrow buttons, keyboard navigation, or clicking adjacent cards
- **THEN** system updates the focused card in the center with its respective title, system, game master, and dedicated action triggers

### Requirement: Decoupled wiki access through campaign cards
The system SHALL isolate all wiki articles, lore files, and category hierarchies behind dedicated campaign routes (`/wiki/:campaignID`), triggered explicitly from each campaign card's action button.

#### Scenario: User explores campaign lore
- **WHEN** user clicks "Explorar Wiki" on an active campaign card in the carousel
- **THEN** system navigates to `/wiki/:campaignID` displaying that specific campaign's dedicated lore view, sidebar, and categorized articles

#### Scenario: Direct access to campaign with pending dossiers
- **WHEN** user navigates to `/wiki/:campaignID` for a campaign whose lore is still in development
- **THEN** system displays an initial dossier entry describing the universe and its classification status rather than throwing a 404 error

### Requirement: Generalized multiverse topbar navigation
The portal top navigation bar SHALL expose global multiverse routes without hardcoding links to individual campaign factions, characters, or specific rulebooks.

#### Scenario: Topbar displays universal actions
- **WHEN** user views any page under the public Sci-Fi layout
- **THEN** system displays universal navigation links for "Campañas", "Foundry VTT", and "Acceso Agente" / "Intranet"
- **THEN** system does not display links targeting `/wiki/bttf/trifarix`, `/wiki/bttf/kelberos-bloodfallen`, or `/wiki/bttf/back-to-the-future-past-and-future` in the main topbar
