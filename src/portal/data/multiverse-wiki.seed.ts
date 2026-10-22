import { WikiArticleBase, WikiCategoryBase } from '../models/Wiki/WikiModels';

export const GOLDEN_21_CATEGORIES_SEED: WikiCategoryBase[] = [
  {
    CategoryID: 'categoria-g21-operaciones',
    CategoryName: 'Categoría:Operaciones',
    ArticleCount: 1,
  },
  {
    CategoryID: 'categoria-g21-tecnologia',
    CategoryName: 'Categoría:Tecnología',
    ArticleCount: 1,
  },
  {
    CategoryID: 'categoria-g21-expedientes',
    CategoryName: 'Categoría:Expedientes',
    ArticleCount: 1,
  },
];

export const GOLDEN_21_WIKI_SEED: WikiArticleBase[] = [
  {
    ArticleID: 'art_g21_overview',
    CampaignID: 'golden-21',
    ArticleSlug: 'golden-21',
    ArticleTitle: 'Proyecto Golden-21: Echo Phase',
    ArticleSubtitle: 'Protocolo de estabilización e infiltración dimensional',
    ArticleCategories: ['Categoría:Operaciones', 'Categoría:Expedientes'],
    ArticleContent: `## Directiva del Proyecto Golden-21

El **Proyecto Golden-21** representa la iniciativa militar y científica desplegada por el mando central de Volkxus para contener las repercusiones de la fractura dimensional tras los sucesos de la convergencia temporal.

### Objetivos Operativos

1. **Reconocimiento de Grietas Cuánticas**: Mapeo topográfico de las micro-fracturas generadas por el uso desmedido de artefactos de *Petra Magus*.
2. **Despliegue de Agentes de la Fase Echo**: Infiltración encubierta en los cuadrantes fronterizos de Necrora y Aiolis.
3. **Neutralización de Residuos Crono-Inestables**: Recuperación y sellado de tecnología anómala antes de su propagación al plano civil.

### Estado de Clasificación

> [!NOTE]
> Los archivos operacionales de esta campaña se encuentran actualmente en proceso de desclasificación táctica. Nuevos expedientes de armamento adaptativo y perfiles de agentes serán incorporados por el Game Master en las próximas transmisiones.`,
    ArticleInfobox: {
      InfoboxType: 'ORGANIZATION',
      Title: 'Proyecto Golden-21',
      ImageUrl: null,
      ImageCaption: 'Insignia de la División Echo',
      Properties: [
        { Key: 'Líder Operativo', Value: 'Katherine M.2 / Protocolo ZRK' },
        { Key: 'Jurisdicción', Value: 'Dimensión 21 / Cuadrante Volkxus' },
        { Key: 'Sistema', Value: 'Cyber-Ops / Infiltración Táctica' },
        { Key: 'Nivel de Acceso', Value: 'Nivel 4 — Confidencial' },
      ],
    },
    ArticleAliases: ['golden21', 'echo-phase', 'proyecto-golden-21'],
    ArticleRelatedSlugs: [],
    ArticleIsRedirect: false,
    ArticleRedirectTarget: null,
    LastModified: 'Ciclo 22 — Reciente',
  },
];

export const EONES_CATEGORIES_SEED: WikiCategoryBase[] = [
  {
    CategoryID: 'categoria-eones-cosmologia',
    CategoryName: 'Categoría:Cosmología',
    ArticleCount: 1,
  },
  {
    CategoryID: 'categoria-eones-deidades',
    CategoryName: 'Categoría:Deidades',
    ArticleCount: 1,
  },
];

export const EONES_WIKI_SEED: WikiArticleBase[] = [
  {
    ArticleID: 'art_eones_overview',
    CampaignID: 'cronicas-eones',
    ArticleSlug: 'eones',
    ArticleTitle: 'Crónicas de los Eones Primordiales',
    ArticleSubtitle: 'Tratado cosmogónico de las deidades ancestrales',
    ArticleCategories: ['Categoría:Cosmología'],
    ArticleContent: `## La Génesis del Vacío Ancestral

Antes de que las dimensiones se dividieran y la ciencia formulara sus leyes, existían los **Eones**: entidades conscientes compuestas de voluntad pura y éter primordial.

### El Choque Arcaico: Magia Vs Ciencia Primordial

Las leyendas de los escribas cósmicos narran cómo la magia no era una anomalía, sino el lenguaje con el que los primeros dioses estructuraron el cosmos. Con el advenimiento del pensamiento racional y las máquinas de vapor de Volkxus, las esferas de influencia entraron en conflicto perpetuo.

### Panteón Primordial

- **El Gran Tejedor de Hebras**: Gobernante del destino y las líneas temporales entrelazadas.
- **La Reina de la Sangre Eterna**: Matriarca mística cuyo linaje daría origen posterior a los nobles de la Casa Bloodfallen.
- **El Guardián del Silencio**: El observador silente de los vacíos interdimensionales.

> [!IMPORTANT]
> Campaña en fase de desarrollo activo. Los tomos arcanos y las reglas de horror cósmico están siendo transcritos por El Escriba Cósmico.`,
    ArticleInfobox: {
      InfoboxType: 'GENERAL',
      Title: 'Crónicas de los Eones',
      ImageUrl: null,
      ImageCaption: 'El Escriba Cósmico',
      Properties: [
        { Key: 'Game Master', Value: 'El Escriba Cósmico' },
        { Key: 'Género', Value: 'Horror Cósmico & Fantasía Épica' },
        { Key: 'Estado', Value: 'En Preparación' },
      ],
    },
    ArticleAliases: ['cronicas-eones', 'los-eones', 'eones-primordiales'],
    ArticleRelatedSlugs: [],
    ArticleIsRedirect: false,
    ArticleRedirectTarget: null,
    LastModified: 'Era Primordial — En Archivo',
  },
];
