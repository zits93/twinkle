/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userSettingsService } from '../api/userSettingsService';

interface UserSettingsState {
  feedingInterval: number;
  autoFeedingInterval: boolean;
  muteDuringNight: boolean;
  autoNightMode: boolean;
  nightStartTime: string;
  nightEndTime: string;
  customCategories: Record<string, string[]>;
  isLoading: boolean;
  updateSettings: (babyId: string, updates: Partial<UserSettingsState>) => Promise<void>;
  addCustomType: (category: string, type: string, babyId?: string) => Promise<void>;
  removeCustomType: (category: string, type: string, babyId?: string) => Promise<void>;
  initializeSettings: (babyId: string) => Promise<void>;
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      feedingInterval: 180,
      autoFeedingInterval: false,
      muteDuringNight: true,
      autoNightMode: false,
      nightStartTime: '19:00',
      nightEndTime: '07:00',
      customCategories: {},
      isLoading: false,
      
      initializeSettings: async (babyId) => {
        set({ isLoading: true });
        try {
          const settings = await userSettingsService.fetchSettings(babyId);
          if (settings) {
            set({
              feedingInterval: settings.feeding_interval,
              autoFeedingInterval: settings.auto_feeding_interval,
              muteDuringNight: settings.mute_during_night,
              autoNightMode: settings.auto_night_mode,
              nightStartTime: settings.night_start_time,
              nightEndTime: settings.night_end_time,
              customCategories: (settings.custom_categories as Record<string, string[]>) || {},
            });
          }
        } catch (error) {
          console.error('Failed to fetch settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateSettings: async (babyId, updates) => {
        // Map camelCase to snake_case for DB
        const dbUpdates: Record<string, unknown> = {};
        if (updates.feedingInterval !== undefined) dbUpdates.feeding_interval = updates.feedingInterval;
        if (updates.autoFeedingInterval !== undefined) dbUpdates.auto_feeding_interval = updates.autoFeedingInterval;
        if (updates.muteDuringNight !== undefined) dbUpdates.mute_during_night = updates.muteDuringNight;
        if (updates.autoNightMode !== undefined) dbUpdates.auto_night_mode = updates.autoNightMode;
        if (updates.nightStartTime !== undefined) dbUpdates.night_start_time = updates.nightStartTime;
        if (updates.nightEndTime !== undefined) dbUpdates.night_end_time = updates.nightEndTime;
        
        set(updates as Partial<UserSettingsState>);
        if (babyId) {
          await userSettingsService.updateSettings(babyId, dbUpdates as any);
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
