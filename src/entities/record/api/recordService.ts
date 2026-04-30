import { supabase, isSupabaseConfigured } from '@shared/api/supabase';
import { type RecordEntry, type RecordCategory } from '@shared/types/record';

const mapToEntity = (row: any): RecordEntry => ({
  id: row.id,
  babyId: row.baby_id,
  userId: row.user_id,
  category: row.category.toUpperCase() as RecordCategory,
  subCategory: row.sub_category,
  value: row.value,
  startTime: row.start_time,
  endTime: row.end_time,
  note: row.note,
  metadata: row.metadata,
  createdAt: row.created_at,
});

const mapToRow = (entity: Partial<RecordEntry>, userId: string) => ({
  baby_id: entity.babyId,
  user_id: userId,
  category: entity.category?.toLowerCase(),
  sub_category: entity.subCategory,
  value: entity.value,
  start_time: entity.startTime,
  end_time: entity.endTime,
  note: entity.note,
  metadata: entity.metadata,
});

export const recordService = {
  async fetchRecords(babyIds: string[]) {
    if (!isSupabaseConfigured || babyIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .in('baby_id', babyIds)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToEntity);
  },

  async createRecord(record: Omit<RecordEntry, 'id' | 'createdAt'>) {
    if (!isSupabaseConfigured) return record as RecordEntry;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('인증이 필요합니다.');

    const row = mapToRow(record, user.id);
    const { data, error } = await supabase
      .from('records')
      .insert([row])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('기록 생성에 실패했습니다.');
    
    return mapToEntity(data[0]);
  },

  async deleteRecord(id: string) {
    if (!isSupabaseConfigured) return;

    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateRecord(id: string, updates: Partial<RecordEntry>) {
    if (!isSupabaseConfigured) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('인증이 필요합니다.');

    const row = mapToRow(updates, user.id);
    // Remove undefined fields to avoid overwriting with null
    const cleanRow = Object.fromEntries(
      Object.entries(row).filter(([_, v]) => v !== undefined)
    );

    const { error } = await supabase
      .from('records')
      .update(cleanRow)
      .eq('id', id);

    if (error) throw error;
  },

  subscribeToRecords(callback: (payload: any) => void) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    return supabase
      .channel('records_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'records' }, (payload: any) => {
        const entityPayload = {
          ...payload,
          new: payload.new ? mapToEntity(payload.new) : null,
          old: payload.old ? mapToEntity(payload.old) : null,
        };
        callback(entityPayload);
      })
      .subscribe();
  }
};
