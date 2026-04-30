import { supabase } from '@shared/api/supabase';
import { RecordEntry } from '@shared/types/record';

export const recordService = {
  async fetchRecords(babyIds: string[]) {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .in('baby_id', babyIds)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createRecord(record: Omit<RecordEntry, 'id'>) {
    const { data, error } = await supabase
      .from('records')
      .insert([record])
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteRecord(id: string) {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  subscribeToRecords(callback: (payload: any) => void) {
    return supabase
      .channel('records_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, callback)
      .subscribe();
  }
};
