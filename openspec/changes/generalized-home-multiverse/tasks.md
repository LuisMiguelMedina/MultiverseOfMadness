# Tasks

## 1. DataAccess y Soporte Multiversal

- [x] 1.1 Configurar expedientes iniciales en `WikiDataAccess.ts` para campañas secundarias (`golden-21`, `cronicas-eones`) y verificar que `WikiDataAccess.Find` y `List` devuelvan resultados estructurados sin arrojar errores 404.

## 2. Generalización del Home y Desacoplamiento de la Wiki

- [x] 2.1 Eliminar las secciones de lore específicas de BTTF (`active-lore-pillars-section` y `featured-lore-section`) de `CampaignHub.tsx` y verificar que el Home no contenga enlaces fijos a una sola campaña.
- [x] 2.2 Implementar en `CampaignHub.tsx` las nuevas secciones generales del Centro de Mando Multiversal (Ecosistema de Sistemas de Rol, Guía de Acceso "Cómo Funciona" y Métricas Globales del Multiverso) y verificar su renderizado.
- [x] 2.3 Añadir en `CampaignHub.scss` los estilos Sci-Fi modulares correspondientes a las nuevas secciones del centro de mando y verificar coherencia visual responsive.
- [x] 2.4 Asegurar que `CampaignCarousel.tsx` y `CampaignHub.tsx` sirvan como la única puerta de entrada al lore, activando `/wiki/:campaignID` de forma dedicada solo tras la acción explícita en la card seleccionada.

## 3. Limpieza y Generalización del Navbar

- [x] 3.1 Actualizar `SciFiLayout.tsx` eliminando los enlaces de facciones, personajes y reglas de BTTF, estableciendo la barra de navegación universal (Campañas, Foundry VTT, Acceso Agente / Intranet) y verificar la navegación.

## 4. Verificación, Compilación y Despliegue

- [x] 4.1 Ejecutar `npm run build` en modo GitHub Pages (`GITHUB_PAGES=true`) y verificar que la compilación de TypeScript y Vite finalice con código de salida 0.
- [x] 4.2 Sincronizar el bundle generado con la raíz del repositorio (`index.html`, `404.html`) para compatibilidad total con GitHub Pages.
- [x] 4.3 Realizar git commit y push a `main`, monitoreando y confirmando la ejecución exitosa del workflow de despliegue en GitHub Actions.
