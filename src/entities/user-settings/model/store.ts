import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userSettingsService } from '../api/userSettingsService';

interface UserSettingsState {
  feedingInterval: number;
  muteDuringNight: boolean;
  customCategories: Record<string, string[]>;
  isLoading: boolean;
  setFeedingInterval: (interval: number, babyId?: string) => Promise<void>;
  setMuteDuringNight: (mute: boolean, babyId?: string) => Promise<void>;
  addCustomType: (category: string, type: string, babyId?: string) => Promise<void>;
  removeCustomType: (category: string, type: string, babyId?: string) => Promise<void>;
  initializeSettings: (babyId: string) => Promise<void>;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      feedingInterval: 180,
      muteDuringNight: true,
      customCategories: {},
      isLoading: false,
      
      initializeSettings: async (babyId) => {
        set({ isLoading: true });
        try {
          const settings = await userSettingsService.fetchSettings(babyId);
          if (settings) {
            set({
              feedingInterval: settings.feeding_interval,
              muteDuringNight: settings.mute_during_night,
              customCategories: (settings.custom_categories as Record<string, string[]>) || {},
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

      addCustomType: async (category, type, babyId) => {
        const current = get().customCategories;
        const categoryTypes = current[category] || [];
        if (categoryTypes.includes(type)) return;

        const newCategories = {
          ...current,
          [category]: [...categoryTypes, type]
        };
        
        set({ customCategories: newCategories });
        if (babyId) {
          await userSettingsService.updateSettings(babyId, { custom_categories: newCategories });
        }
      },

      removeCustomType: async (category, type, babyId) => {
        const current = get().customCategories;
        const categoryTypes = current[category] || [];
        
        const newCategories = {
          ...current,
          [category]: categoryTypes.filter((t) => t !== type)
        };
        
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
