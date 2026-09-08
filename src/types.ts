export interface WheelEntry {
  id: string;
  text: string;
  color?: string;
}

export type WheelThemeId = 'vibrant' | 'pastel' | 'neon' | 'ocean' | 'minimal';

export interface ThemeDefinition {
  id: WheelThemeId;
  name: string;
  description: string;
  colors: string[];
  textColor: string;
  accentColor: string;
  bgIndicator: string;
}

export interface SpinResult {
  winner: WheelEntry;
  timestamp: number;
}

export type PageRoute = '/' | '/wheel-spinner' | '/privacy-policy' | '/terms' | '/contact';
