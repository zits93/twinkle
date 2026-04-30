import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userSettingsService } from '../api/userSettingsService';

interface UserSettingsState {
  feedingInterval: number; // minutes
  muteDuringNight: boolean;
  customCategories: string[];
  isLoading: boolean;
  setFeedingInterval: (interval: number, babyId?: string) => Promise<void>;
  setMuteDuringNight: (mute: boolean, babyId?: string) => Promise<void>;
  addCustomCategory: (category: string, babyId?: string) => Promise<void>;
  removeCustomCategory: (category: string, babyId?: string) => Promise<void>;
  initializeSettings: (babyId: string) => Promise<void>;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      feedingInterval: 180,
      muteDuringNight: true,
      customCategories: ['간식', '약', '터미타임'],
      isLoading: false,
      
      initializeSettings: async (babyId) => {
        set({ isLoading: true });
        try {
          const settings = await userSettingsService.fetchSettings(babyId);
          if (settings) {
            set({
              feedingInterval: settings.feeding_interval,
              muteDuringNight: settings.mute_during_night,
              customCategories: settings.custom_categories,
            });
          }
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setFeedingInterval: async (interval, babyId) => {
        set({ feedingInterval: interval });
        if (babyId) {
          await userSettingsService.updateSettings(babyId, { feeding_interval: interval });
        }
      },

      setMuteDuringNight: async (mute, babyId) => {
        set({ muteDuringNight: mute });
        if (babyId) {
          await userSettingsService.updateSettings(babyId, { mute_during_night: mute });
        }
      },

      addCustomCategory: async (category, babyId) => {
        const newCategories = [...get().customCategories, category];
        set({ customCategories: newCategories });
        if (babyId) {
          await userSettingsService.updateSettings(babyId, { custom_categories: newCategories });
        }
      },

      removeCustomCategory: async (category, babyId) => {
        const newCategories = get().customCategories.filter((c) => c !== category);
        set({ customCategories: newCategories });
        if (babyId) {
          await userSettingsService.updateSettings(babyId, { custom_categories: newCategories });
        }
      },
    }),
    {
      name: 'twinkle-user-settings',
    }
  )
);
