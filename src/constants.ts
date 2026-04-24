import { Solution } from './types';

export const ACIDS: Solution[] = [
  {
    id: 'hcl',
    name: 'Asam Klorida',
    formula: 'HCl',
    ph: 1.0,
    concentration: 0.1,
    type: 'acid',
    color: '#e2e8f0', // Slightly more visible grey-blue
    description: 'Asam kuat yang menjadi titrat standar.'
  },
  {
    id: 'ch3cooh',
    name: 'Asam Asetat',
    formula: 'CH3COOH',
    ph: 2.8,
    concentration: 0.1,
    type: 'acid',
    color: '#f1f5f9',
    description: 'Asam lemah organik yang sering diuji.'
  }
];

export const BASES: Solution[] = [
  {
    id: 'naoh',
    name: 'Natrium Hidroksida',
    formula: 'NaOH',
    ph: 13.0,
    concentration: 0.1,
    type: 'base',
    color: '#cbd5e1', // More distinct
    description: 'Basa kuat standar untuk titran.'
  },
  {
    id: 'koh',
    name: 'Kalium Hidroksida',
    formula: 'KOH',
    ph: 13.0,
    concentration: 0.1,
    type: 'base',
    color: '#cbd5e1',
    description: 'Basa kuat lainnya untuk praktikum.'
  }
];

export const getPPColor = (ph: number): string => {
  // Phenolphthalein: Colorless below 8.2, Pink/Magenta above 10
  if (ph < 8.2) return 'rgba(255, 255, 255, 0.1)';
  if (ph > 10) return 'rgba(219, 39, 119, 0.6)'; // Pink-600
  // Gradient range
  const intensity = (ph - 8.2) / (10 - 8.2);
  return `rgba(219, 39, 119, ${intensity * 0.6})`;
};

export const getUniversalIndicatorColor = (ph: number): string => {
  if (ph <= 2) return '#ef4444'; // Red
  if (ph <= 4) return '#f97316'; // Orange
  if (ph <= 6) return '#eab308'; // Yellow
  if (ph <= 8) return '#22c55e'; // Green
  if (ph <= 10) return '#06b6d4'; // Cyan
  if (ph <= 12) return '#3b82f6'; // Blue
  return '#6366f1'; // Violet/Indigo
};
