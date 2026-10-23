import { CampaignBase } from '../models/Campaigns/CampaignModels';

export const CAMPAIGNS_SEED: CampaignBase[] = [
  {
    CampaignID: 'bttf',
    CampaignTitle: 'Back To The Future: Past & Future',
    CampaignSlug: 'back-to-the-future',
    CampaignSystem: 'D&D 5E — Narrativa Caótica',
    CampaignDescription:
      'Campaña oficial en la convergencia de ciencia ficción y fantasía dividida en Pasado y Futuro. Incorpora modo Hardcore, combate narrativo de 3 acciones, regla de pieza tocada/movida y eventos caóticos gobernados por efecto mariposa.',
    CampaignCoverUrl:
      'https://static.wikia.nocookie.net/multiverse-of-madness/images/0/08/Site-background-dark/revision/latest?cb=20260421043235&path-prefix=es',
    CampaignBannerUrl:
      'https://static.wikia.nocookie.net/multiverse-of-madness/images/e/e6/Site-logo.png/revision/latest?cb=20260421042404&path-prefix=es',
    CampaignStatus: 'ACTIVE',
    CampaignGameMaster: 'Luis Medina (Luismi)',
    CampaignStartDate: '15 de febrero de 2024',
    CampaignPlayerCount: 4,
    CampaignSessionCount: 24,
    CampaignDifficulty: 'Hardcore',
    CampaignFoundryUrl: 'http://practically-marine.tun.ply.gg:61342',
    CampaignWikiHomeSlug: 'back-to-the-future-past-and-future',
    CampaignTags: ['Ciencia Ficción', 'Fantasía', 'Hardcore', 'Multiverso', 'DND 5E'],
  },
  {
    CampaignID: 'golden-21',
    CampaignTitle: 'Proyecto Golden-21: Echo Phase',
    CampaignSlug: 'golden-21',
    CampaignSystem: 'Cyber-Ops / Infiltración Dimensional',
    CampaignDescription:
      'Iniciativa de reconstrucción y estabilización de los fragmentos dimensionales en la Dimensión 21 tras la fractura temporal y la unificación de Volkxus.',
    CampaignCoverUrl: null,
    CampaignBannerUrl: null,
    CampaignStatus: 'UPCOMING',
    CampaignGameMaster: 'Katherine M.2 / Protocolo ZRK',
    CampaignStartDate: 'Próximamente (Ciclo 22)',
    CampaignPlayerCount: null,
    CampaignSessionCount: null,
    CampaignDifficulty: 'Intermedio',
    CampaignFoundryUrl: null,
    CampaignWikiHomeSlug: 'golden-21',
    CampaignTags: ['Cyberpunk', 'Dimensión 21', 'Militar Táctico'],
  },
  {
    CampaignID: 'cronicas-eones',
    CampaignTitle: 'Crónicas de los Eones Primordiales',
    CampaignSlug: 'cronicas-eones',
    CampaignSystem: 'Horror Cósmico & Fantasía Épica',
    CampaignDescription:
      'Exploración de las entidades cósmicas ancestrales, deidades de sangre y el choque arcaico entre Magia y Ciencia en los albores del universo conocido.',
    CampaignCoverUrl: null,
    CampaignBannerUrl: null,
    CampaignStatus: 'DEVELOPMENT',
    CampaignGameMaster: 'El Escriba Cósmico',
    CampaignStartDate: 'En preparación',
    CampaignPlayerCount: null,
    CampaignSessionCount: null,
    CampaignDifficulty: 'Difícil',
    CampaignFoundryUrl: null,
    CampaignWikiHomeSlug: 'eones',
    CampaignTags: ['Eones', 'Mundo Espiritual', 'Místico'],
  },
];
