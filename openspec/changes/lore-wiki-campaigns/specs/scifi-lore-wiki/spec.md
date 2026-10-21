# Spec Delta

## Purpose

Delivers a high-fidelity, modern Sci-Fi Lore Wiki hosting the complete canonical universe content, faction dossiers, character sheets, and rule mechanics migrated from the Fandom wiki.

## ADDED Requirements

### Requirement: Canonical Lore Content Migration
The system SHALL store and render the complete set of 29 lore pages and associated assets migrated from the Multiverse of Madness Fandom wiki.

#### Scenario: User navigates to a specific lore article
- **WHEN** the user selects an article such as "Trifarix", "Dimension21: Volkxus", or "Eones"
- **THEN** the system displays the complete formatted text, sections, categories, and related links for that subject

### Requirement: Sci-Fi Visual Styling and Infoboxes
The lore wiki SHALL present character, faction, and world articles with customized futuristic infoboxes and styling instead of default Fandom layout.

#### Scenario: Viewing a character or faction dossier
- **WHEN** the user opens a character article (such as "Kelberos Bloodfallen" or "Kasumi Ryoko") or faction article (such as "Casa Bloodfallen" or "Oligarquía de Valrius")
- **THEN** the system renders a cybernetic infobox card with token image, status, executive authority/leader, alignment, origin, and quick metadata

### Requirement: Instant Search and Category Browsing
The system SHALL provide an instant client-side search engine and category index for rapid lore discovery.

#### Scenario: Searching for lore topics
- **WHEN** the user types keywords into the wiki search bar (e.g., "Demiergus" or "Hardcore")
- **THEN** the system filters and displays matching articles instantly with snippet highlights and category tags

### Requirement: Inter-Wiki Link Resolution and Redirections
The system SHALL resolve wiki-style internal links and canonical alias redirections across all migrated pages.

#### Scenario: Following an internal wiki link or alias
- **WHEN** the user clicks an internal link or visits a known alias (such as "Facciones" redirecting to "Trifarix", or "Grupos" redirecting to "Agrupaciones Extra-Estatales")
- **THEN** the system seamlessly routes the user to the target canonical lore article
