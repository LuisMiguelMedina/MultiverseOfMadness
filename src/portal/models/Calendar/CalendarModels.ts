export type RecurrenceType = 'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface CalendarEventTag {
  id: string;
  label: string;
  color: string;
  textColor: string;
  category: 'TYPE' | 'AUTHOR';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  time: string; // Obligatorio! Ejemplo "18:00" o "19:30 - 22:30"
  authorTag: string; // Fred, Paco, Leo Alv, Luismi, Aldana, Bruno, Pac, Maruco
  categoryTag: string; // EVENTOS, WEAS CORTAS, CAMPAÑA
  colorVariant: string; // Color hexadecimal o CSS gradient para el pill
  textColor: string; // #000000 o #ffffff
  recurrence: RecurrenceType;
  description?: string;
  foundryUrl?: string;
  updatedAt?: number;
}

export interface CalendarEventOccurrence {
  event: CalendarEvent;
  instanceDate: string; // YYYY-MM-DD de esta ocurrencia en particular
  isRecurringInstance: boolean;
}

/**
 * Etiquetas oficiales del sistema (según imagen del calendario manual).
 */
export const DEFAULT_TAGS: CalendarEventTag[] = [
  // Categorías de eventos
  { id: 'eventos', label: 'EVENTOS', color: '#5814e5', textColor: '#ffffff', category: 'TYPE' },
  { id: 'weas_cortas', label: 'WEAS CORTAS', color: '#f5a623', textColor: '#000000', category: 'TYPE' },
  // Autores / Participantes
  { id: 'fred', label: 'FRED', color: '#8a58f5', textColor: '#ffffff', category: 'AUTHOR' },
  { id: 'paco', label: 'PACO', color: '#8b1e0f', textColor: '#ffffff', category: 'AUTHOR' },
  { id: 'leo_alv', label: 'LEO ALV', color: '#111111', textColor: '#ffffff', category: 'AUTHOR' },
  { id: 'luismi', label: 'LUISMI', color: '#005bb5', textColor: '#ffffff', category: 'AUTHOR' },
  { id: 'aldana', label: 'ALDANA', color: '#38b6ff', textColor: '#000000', category: 'AUTHOR' },
  { id: 'bruno', label: 'BRUNO', color: '#ec4899', textColor: '#ffffff', category: 'AUTHOR' },
  { id: 'pac', label: 'PAC', color: '#7ed957', textColor: '#000000', category: 'AUTHOR' },
  { id: 'maruco', label: 'MARUCO', color: '#66a15e', textColor: '#ffffff', category: 'AUTHOR' },
];

/**
 * Paleta de estilos visuales para los pills de los eventos.
 */
export const PRESET_EVENT_STYLES = [
  {
    id: 'cyan',
    label: 'Cyan (Pokémon / Zenith)',
    background: '#38b6ff',
    textColor: '#000000',
  },
  {
    id: 'elixir_gradient',
    label: 'Elixir (Degradado Oro a Lima)',
    background: 'linear-gradient(135deg, #f5a623 0%, #7ed957 100%)',
    textColor: '#000000',
  },
  {
    id: 'purple_reveil',
    label: 'Púrpura (RE:VEIL)',
    background: '#7c3aed',
    textColor: '#ffffff',
  },
  {
    id: 'deep_halloween',
    label: 'Púrpura Oscuro (Halloween)',
    background: '#5814e5',
    textColor: '#ffffff',
  },
  {
    id: 'black_ops',
    label: 'Negro Ops (Leo Alv)',
    background: '#111111',
    textColor: '#ffffff',
  },
  {
    id: 'crimson',
    label: 'Carmesí (Paco)',
    background: '#8b1e0f',
    textColor: '#ffffff',
  },
  {
    id: 'pink_bruno',
    label: 'Magenta (Bruno)',
    background: '#ec4899',
    textColor: '#ffffff',
  },
  {
    id: 'blue_luismi',
    label: 'Azul Real (Luismi)',
    background: '#005bb5',
    textColor: '#ffffff',
  },
  {
    id: 'lime_pac',
    label: 'Lima Neón (Pac)',
    background: '#7ed957',
    textColor: '#000000',
  },
  {
    id: 'olive_maruco',
    label: 'Verde Oliva (Maruco)',
    background: '#66a15e',
    textColor: '#ffffff',
  },
];
