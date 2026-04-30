import { create } from 'zustand';
import { type BabyProfile } from '@shared/types/record';
import { babyService } from '../api/babyService';

interface BabyState {
  babies: BabyProfile[];
  isLoading: boolean;
  initializeBabies: () => Promise<void>;
  updateBaby: (id: string, updates: Partial<BabyProfile>) => Promise<void>;
  deleteBaby: (id: string) => Promise<void>;
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

  updateBaby: async (id, updates) => {
    try {
      await babyService.updateBaby(id, updates);
      set((state) => ({
        babies: state.babies.map((b) => b.id === id ? { ...b, ...updates } : b)
      }));
    } catch (error) {
      console.error('Failed to update baby:', error);
    }
  },

  deleteBaby: async (id) => {
    try {
      await babyService.deleteBaby(id);
      set((state) => ({
        babies: state.babies.filter((b) => b.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete baby:', error);
    }
  },
}));
