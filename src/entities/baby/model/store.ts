import { create } from 'zustand';
import type { BabyProfile } from '@shared/types/record';

interface BabyState {
  babies: BabyProfile[];
  updateBaby: (id: string, updates: Partial<BabyProfile>) => void;
}

export const useBabyStore = create<BabyState>((set) => ({
  babies: [
    {
      id: 'baby-a',
      name: '아기 A',
      birthDate: new Date().toISOString(),
      gender: 'M',
      colorTheme: 'mint',
    },
    {
      id: 'baby-b',
      name: '아기 B',
      birthDate: new Date().toISOString(),
      gender: 'F',
      colorTheme: 'coral',
    }
  ],
  
  updateBaby: (id, updates) => set((state) => ({
    babies: state.babies.map((b) => b.id === id ? { ...b, ...updates } : b)
  })),
}));
