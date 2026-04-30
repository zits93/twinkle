import { supabase } from '@shared/api/supabase';

export interface UserSettings {
  baby_id: string;
  feeding_interval: number;
  mute_during_night: boolean;
  custom_categories: any;
}

export const userSettingsService = {
  async fetchSettings(babyId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('baby_id', babyId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
    return data;
  },

  async updateSettings(babyId: string, settings: Partial<UserSettings>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        baby_id: babyId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data[0];
  }
};
