# Spec Delta

## Purpose

Provides a Foundry VTT-inspired campaign hub to display active and future tabletop campaigns, launch their associated lore wikis, and organize game world metadata.

## ADDED Requirements

### Requirement: Active Campaign Display
The system SHALL present an active campaign card for "Back To The Future: Past & Future" prominently on the main hub.

#### Scenario: User visits the main campaign hub
- **WHEN** the user navigates to the home/campaigns view
- **THEN** the system displays the "Back To The Future: Past & Future" card with its system badge (D&D 5E / Chaos Mode), DM Luismi, active status indicator, and direct button to enter its Lore Wiki

### Requirement: Future Campaign Cards Support
The system SHALL support extensible campaign cards for future storylines and universes alongside the active campaign.

#### Scenario: Displaying future or archived campaigns
- **WHEN** additional campaign entries exist in the campaign registry
- **THEN** the system renders them as modular cards with title, cover preview, status badge (e.g., In Development, Coming Soon, Archived), and disabled or enabled wiki entry links

### Requirement: Foundry VTT Style Composition
The campaign hub interface SHALL emulate the visual structure of Foundry VTT world selection with an upgraded sci-fi aesthetic.

#### Scenario: Viewing world layout and actions
- **WHEN** the user inspects the campaign hub interface
- **THEN** the interface displays a top status bar, a responsive grid of world cards with rich artwork, action buttons to launch the world wiki or external Foundry server link, and campaign quick-stats
