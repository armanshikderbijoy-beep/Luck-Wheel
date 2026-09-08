import { ThemeDefinition, WheelThemeId } from '../types';

export const WHEEL_THEMES: Record<WheelThemeId, ThemeDefinition> = {
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energetic, bold, high-contrast palette',
    colors: [
      '#EF4444', // Red
      '#F97316', // Orange
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#06B6D4', // Cyan
      '#3B82F6', // Blue
      '#8B5CF6', // Violet
      '#EC4899', // Pink
    ],
    textColor: '#FFFFFF',
    accentColor: '#EF4444',
    bgIndicator: '#1E293B',
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft, calming, muted tones',
    colors: [
      '#FCA5A5', // Soft Red
      '#FDBA74', // Soft Orange
      '#FDE047', // Soft Yellow
      '#86EFAC', // Soft Green
      '#93C5FD', // Soft Blue
      '#C4B5FD', // Soft Purple
      '#F9A8D4', // Soft Pink
      '#A7F3D0', // Soft Mint
    ],
    textColor: '#1E293B',
    accentColor: '#A78BFA',
    bgIndicator: '#334155',
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Electrifying, radiant fluorescent hues',
    colors: [
      '#22C55E', // Neon Green
      '#06B6D4', // Electric Cyan
      '#EC4899', // Neon Magenta
      '#EAB308', // Cyber Yellow
      '#8B5CF6', // Neon Violet
      '#F97316', // Electric Orange
      '#14B8A6', // Bright Teal
      '#F43F5E', // Electric Rose
    ],
    textColor: '#09090B',
    accentColor: '#22C55E',
    bgIndicator: '#0F172A',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea, azure blues, and aqua gradients',
    colors: [
      '#0284C7', // Sky Blue
      '#0EA5E9', // Light Blue
      '#06B6D4', // Cyan
      '#14B8A6', // Teal
      '#0D9488', // Deep Teal
      '#0369A1', // Ocean Blue
      '#1D4ED8', // Royal Blue
      '#38BDF8', // Cyan Mist
    ],
    textColor: '#FFFFFF',
    accentColor: '#0284C7',
    bgIndicator: '#0F172A',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sleek monochrome with refined slate gradients',
    colors: [
      '#1E293B', // Slate 800
      '#334155', // Slate 700
      '#475569', // Slate 600
      '#64748B', // Slate 500
      '#94A3B8', // Slate 400
      '#CBD5E1', // Slate 300
    ],
    textColor: '#FFFFFF',
    accentColor: '#475569',
    bgIndicator: '#020617',
  },
};

export const DEFAULT_ENTRIES = [
  'Yes',
  'No',
  'Maybe',
  'Ask Again',
  'Definitely',
  'Never',
];

export const PRESET_OPTIONS: { name: string; items: string[] }[] = [
  {
    name: 'Yes / No',
    items: ['Yes', 'No', 'Ask Again', 'Definitely'],
  },
  {
    name: 'Dice 1-6',
    items: ['1', '2', '3', '4', '5', '6'],
  },
  {
    name: 'Meal Choice',
    items: ['Pizza', 'Sushi', 'Burgers', 'Tacos', 'Pasta', 'Salad'],
  },
  {
    name: 'Days of Week',
    items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    name: 'Fun Activity',
    items: ['Watch a Movie', 'Read a Book', 'Go for a Walk', 'Play Games', 'Cook Something New', 'Call a Friend'],
  },
];
