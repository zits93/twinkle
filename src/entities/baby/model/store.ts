import { create } from 'zustand';
import { type BabyProfile } from '@shared/types/record';
import { babyService } from '../api/babyService';

interface BabyState {
  babies: BabyProfile[];
  isLoading: boolean;
  initializeBabies: () => Promise<void>;
  updateBaby: (id: string, updates: Partial<BabyProfile>) => void;
}

export const useBabyStore = create<BabyState>((set) => ({
  babies: [],
  isLoading: false,
  
  initializeBabies: async () => {
    set({ isLoading: true });
    try {
      const babies = await babyService.fetchBabies();
      set({ babies, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch babies:', error);
      set({ isLoading: false });
    }
  },

  updateBaby: (id, updates) => set((state) => ({
    babies: state.babies.map((b) => b.id === id ? { ...b, ...updates } : b)
  })),
}));
