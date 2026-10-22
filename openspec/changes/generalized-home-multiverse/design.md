# Design: Generalización del Home Multiversal y Encapsulación de la Wiki tras las Cards

## Context

Ver `proposal.md` para la motivación y antecedentes del cambio.  
Actualmente, el componente `CampaignHub` mezcla la funcionalidad de selector de mundos con una muestra rígida de la wiki de *Back To The Future* (pilares y expedientes destacados). Asimismo, la barra de navegación en `SciFiLayout` incluye accesos directos específicos de esa misma campaña. El objetivo es estructurar una separación limpia de responsabilidades: el Home actúa como centro de mando multiversal y catálogo de campañas, mientras que la wiki reside exclusivamente en vistas dedicadas tras la selección de cada card.

## Goals / Non-Goals

**Goals:**
- Desacoplar completamente el Home (`CampaignHub`) de cualquier contenido o expediente estático exclusivo de BTTF.
- Presentar el carrusel interactivo centralizado como el elemento protagonista del Home para la selección de universos.
- Establecer las acciones de la card activa (`Explorar Wiki` y `Foundry VTT`) como el punto de acceso explícito al lore de cada campaña.
- Incorporar secciones generales del multiverso en el Home:
  - Resumen de la plataforma y propósito del multiverso.
  - Ecosistema de sistemas y géneros de rol compatibles.
  - Guía rápida de incorporación a las campañas ("Cómo Funciona").
  - Estadísticas agregadas del multiverso.
- Actualizar `SciFiLayout` con navegación global universal (Campañas, Foundry VTT, Acceso Agente / Intranet).
- Habilitar en `WikiDataAccess` artículos introductorios para las campañas del catálogo (`golden-21`, `cronicas-eones`) para que ninguna card conduzca a un estado 404.

**Non-Goals:**
- No se elimina ni altera el rico contenido de lore de BTTF existente en `bttf-wiki.seed.ts`: todos los artículos, facciones y personajes continúan existiendo en `/wiki/bttf`.
- No se modifica la arquitectura de autenticación ni los módulos administrativos de la intranet de ZRK (`/dashboard`, etc.).

## Decisions

### Decisión 1: Separación estricta entre Hub de Campañas y Entorno de Wiki
- **Enfoque adoptado**: El Home (`CampaignHub`) tiene la única responsabilidad de catalogar mundos, mostrar el estado de las campañas y permitir al usuario elegir su destino. Toda la experiencia de wiki (sidebar de categorías, infoboxes, artículos y buscador de lore) queda confinada a [`WikiArticleView`](file:///C:/Users/lmedi/OneDrive/Documentos/GitHub/MultiverseOfMadness/src/portal/pages/WikiArticleView.tsx).
- **Alternativa descartada**: Dejar un panel colapsable o preview de wiki en el Home. Descartado porque confunde el contexto del usuario y sesga la página hacia el primer mundo cargado.

### Decisión 2: Acciones contextuales desde la Card Central del Carrusel
- **Enfoque adoptado**: En `CampaignCarousel`, la card en posición central (`card-pos-center`) destaca visualmente y expone los botones de acción directos:
  - `[ Explorar Wiki ]` con destino `/wiki/${camp.CampaignID}${camp.CampaignWikiHomeSlug ? '/' + camp.CampaignWikiHomeSlug : ''}`.
  - `[ Foundry VTT ]` con enlace externo si la campaña define `CampaignFoundryUrl`.
  - Las cards laterales (`prev` y `next`) sirven para rotar el carrusel al hacer clic en ellas.
- **Alternativa descartada**: Forzar la apertura automática de la wiki al cambiar el índice del carrusel. Descartado porque el usuario debe poder inspeccionar las fichas de los mundos sin abandonar la vista del Home.

### Decisión 3: Provisión de expedientes base para campañas secundarias en DataAccess
- **Enfoque adoptado**: En `WikiDataAccess.ts`, además del seed de BTTF, se configuran artículos de bienvenida / ficha de mundo para `golden-21` y `cronicas-eones`, garantizando que cualquier universo seleccionado en el carrusel tenga un expediente legible.
- **Alternativa descartada**: Mostrar un error 404 si la campaña no es `bttf`. Descartado para ofrecer una experiencia cohesiva de catálogo multiversal.

### Decisión 4: Reorganización del Topbar en SciFiLayout
- **Enfoque adoptado**: Reemplazar los 3 enlaces específicos de BTTF en la barra superior por accesos globales:
  - `Campañas` (`/campaigns`)
  - `Foundry VTT` (enlace con indicador activo)
  - `Acceso Agente` / `Intranet` (enlace según estado de sesión)
- **Alternativa descartada**: Mantener un submenú desplegable con los artículos de BTTF en el navbar. Descartado porque introduce asimetría contra el resto de las campañas del multiverso.

## Risks / Trade-offs

- **[Riesgo: El usuario busca los enlaces rápidos de Facciones y Personajes que estaban en el navbar]**  
  → *Mitigación*: Dentro de `/wiki/bttf`, el componente `WikiSidebar` ya incluye el árbol jerárquico de categorías (Facciones, Personajes, Lugares, Reglas) y buscador en tiempo real, permitiendo una navegación más contextual y organizada.
- **[Riesgo: Rendimiento o estilos al agregar secciones generales en CampaignHub]**  
  → *Mitigación*: Se utilizan estilos CSS modulares en `CampaignHub.scss` con variables de diseño Sci-Fi existentes, animaciones sutiles y sin dependencias externas pesadas.

## Migration Plan

1. Actualizar `src/portal/dataAccess/WikiDataAccess.ts` con soporte para expedientes iniciales de campañas registradas.
2. Actualizar `src/portal/pages/CampaignHub.tsx` eliminando bloques de BTTF y agregando secciones multiversales generales.
3. Actualizar `src/portal/pages/CampaignHub.scss` con los estilos de las nuevas secciones.
4. Actualizar `src/portal/layouts/SciFiLayout.tsx` con el navbar universal.
5. Ejecutar compilación de producción con Vite (`npm run build`).
6. Sincronizar artefactos para GitHub Pages y desplegar.
