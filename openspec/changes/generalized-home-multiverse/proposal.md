# Proposal: Generalización del Home Multiversal y Encapsulación de la Wiki tras las Cards

## Why

El portal *Multiverse of Madness* fue concebido como una plataforma multiversal para albergar diversos universos, campañas de rol y servidores de Foundry VTT. No obstante, la página de inicio (`CampaignHub`) quedó sesgada y acoplada exclusivamente a una sola campaña (*Back to the Future: Past & Future*), renderizando secciones fijas de sus pilares geopolíticos y expedientes de personajes directamente en el Home.

Esto rompe la experiencia de usuario generalizada: la wiki de una campaña específica no debe desplegarse en el Home global, sino que debe residir de forma encapsulada y autónoma detrás de la selección interactiva de cada card de campaña en el carrusel. Es necesario generalizar el Home para que funcione como el verdadero centro de mando de múltiples campañas y aislar la wiki como una vista dedicada accesible al interactuar con una card específica.

## What Changes

- **Generalización del Home (`CampaignHub`)**:
  - Eliminación de las secciones de lore y expedientes fijos de BTTF (`active-lore-pillars-section` y `featured-lore-section`) en el Home.
  - Consolidación del Home como Centro de Mando Multiversal con el carrusel interactivo centralizado como eje principal de exploración de mundos.
  - Inclusión de secciones universales en el Home:
    - *Ecosistema de Sistemas*: Sistemas y géneros compatibles con el portal (D&D 5E adaptado, Cyber-Ops táctico, Horror Cósmico, Fantasía Oscura).
    - *Cómo Funciona el Multiverso*: Flujo de acceso (1. Elige tu universo, 2. Consulta lore y mecánicas en su wiki dedicada, 3. Conéctate a la sesión VTT).
    - *Métricas Globales*: Indicadores agregados de mundos registrados, sesiones y protocolos activos.
- **Encapsulación de la Wiki tras la Selección de la Card**:
  - La Wiki de cualquier campaña solo se muestra tras la acción explícita del usuario desde su card en el carrusel (botón "Explorar Wiki" o selección directa), redirigiendo a la ruta dedicada `/wiki/:campaignID`.
  - El Home ya no presenta fragmentos de wiki o infoboxes filtrados.
  - Provisión de expedientes iniciales en `WikiDataAccess` para todas las campañas registradas (`bttf`, `golden-21`, `cronicas-eones`, etc.) para garantizar una experiencia completa y sin errores 404 al explorar cualquiera de ellas.
- **Desacoplamiento del Navbar Superior (`SciFiLayout`)**:
  - Limpieza de los enlaces fijos a facciones, personajes y reglas de BTTF en la barra de navegación global.
  - Menú global centrado en navegación multiversal: *Campañas*, *Foundry VTT* e *Intranet / Acceso Agente*.

## Capabilities

### New Capabilities
- `portal-campaign-hub`: Sistema de Centro de Mando Multiversal, selector centralizado de campañas y enrutamiento contextual hacia wikis de lore y servidores VTT aislados por universo.

### Modified Capabilities
<!-- No modified capabilities since no prior specs existed in the repository. -->

## Impact

- `src/portal/pages/CampaignHub.tsx`: Eliminación de bloques de lore estáticos de BTTF y adición de secciones generales del portal multiversal.
- `src/portal/pages/CampaignHub.scss`: Estilos para las nuevas secciones generales del centro de mando multiversal.
- `src/portal/layouts/SciFiLayout.tsx`: Limpieza del menú de navegación superior para desacoplarlo de las rutas fijas de BTTF.
- `src/portal/dataAccess/WikiDataAccess.ts`: Soporte para articulado base / desclasificación de expedientes en campañas secundarias.
- Enrutamiento: `/` y `/campaigns` se mantienen como el portal multiversal general, mientras que `/wiki/:campaignID(/slug)` aloja la experiencia de wiki de cada mundo.
