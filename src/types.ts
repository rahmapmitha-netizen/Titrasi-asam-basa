export type SolutionType = 'acid' | 'base' | 'neutral';

export interface Solution {
  id: string;
  name: string;
  formula: string;
  ph: number;
  concentration: number; // Molarity
  type: SolutionType;
  color: string;
  description: string;
}

export interface LabState {
  selectedAcid: Solution | null;
  selectedBase: Solution | null;
  activeIndicator: 'pp' | 'methyl-red' | 'universal';
  volumeTitrant: number; // In mL
  isTitrating: boolean;
  dropRate: number; // drops per second
}
