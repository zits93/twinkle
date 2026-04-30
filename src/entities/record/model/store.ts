import { create } from 'zustand';
import { RecordEntry } from '@shared/types/record';
import { recordService } from '../api/recordService';

interface RecordState {
  records: RecordEntry[];
  isLoading: boolean;
  addRecord: (record: RecordEntry) => Promise<void>;
  addDualRecord: (recordA: RecordEntry, recordB: RecordEntry) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  updateRecord: (id: string, updates: Partial<RecordEntry>) => Promise<void>;
  initializeRecords: (babyIds: string[]) => Promise<void>;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  isLoading: false,
  
  initializeRecords: async (babyIds: string[]) => {
    set({ isLoading: true });
    try {
      const data = await recordService.fetchRecords(babyIds);
      set({ records: data as RecordEntry[], isLoading: false });

      // Subscribe to real-time changes
      recordService.subscribeToRecords((payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        const currentRecords = get().records;

        if (eventType === 'INSERT') {
          set({ records: [newRecord as RecordEntry, ...currentRecords] });
        } else if (eventType === 'UPDATE') {
          set({
            records: currentRecords.map((r) => r.id === newRecord.id ? (newRecord as RecordEntry) : r)
          });
        } else if (eventType === 'DELETE') {
          set({
            records: currentRecords.filter((r) => r.id !== oldRecord.id)
          });
        }
      });
    } catch (error) {
      console.error('Failed to initialize records:', error);
      set({ isLoading: false });
    }
  },

  addRecord: async (record) => {
    try {
      // Optimistic UI update
      set((state) => ({ records: [record, ...state.records] }));
      await recordService.createRecord(record);
    } catch (error) {
      console.error('Failed to add record:', error);
      // Revert or handle error
    }
  },

  addDualRecord: async (recordA, recordB) => {
    try {
      set((state) => ({ records: [recordA, recordB, ...state.records] }));
      await recordService.createRecord(recordA);
      await recordService.createRecord(recordB);
    } catch (error) {
      console.error('Failed to add dual records:', error);
    }
  },

  deleteRecord: async (id) => {
    try {
      set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
      await recordService.deleteRecord(id);
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  },

  updateRecord: async (id, updates) => {
    set((state) => ({
      records: state.records.map((r) => r.id === id ? { ...r, ...updates } : r)
    }));
    // TODO: Implement update in recordService
  },
}));
