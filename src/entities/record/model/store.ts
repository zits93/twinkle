import { create } from 'zustand';
import type { RecordEntry } from '@shared/types/record';

interface RecordState {
  records: RecordEntry[];
  addRecord: (record: RecordEntry) => void;
  addDualRecord: (recordA: RecordEntry, recordB: RecordEntry) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, updates: Partial<RecordEntry>) => void;
}

export const useRecordStore = create<RecordState>((set) => ({
  records: [],
  
  addRecord: (record) => set((state) => ({
    records: [record, ...state.records]
  })),

  addDualRecord: (recordA, recordB) => set((state) => ({
    records: [recordA, recordB, ...state.records]
  })),

  deleteRecord: (id) => set((state) => ({
    records: state.records.filter((r) => r.id !== id)
  })),

  updateRecord: (id, updates) => set((state) => ({
    records: state.records.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),
}));
