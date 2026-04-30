import { useRecordStore, RecordItem } from '@entities/record';
import { useState, useMemo } from 'react';
import { useBabyStore } from '@entities/baby';
import type { RecordEntry } from '@shared/types/record';
import { EditRecordModal } from '@features/edit-record/ui/EditRecordModal';
import { getShortUniqueNames } from '@shared/lib/utils/name';

export const RecordTimeline = () => {
  const records = useRecordStore((state) => state.records);
  const { babies } = useBabyStore();
  const [viewMode, setViewMode] = useState<string>('ALL');
  const [editingRecord, setEditingRecord] = useState<RecordEntry | null>(null);

  // 모든 아기 이름들의 단축 매핑 계산
  const babyNameMap = useMemo(() => {
    const names = babies.map(b => b.name);
    return getShortUniqueNames(names);
  }, [babies]);

  const filteredRecords = records.filter((r: RecordEntry) => {
    if (viewMode === 'ALL') return true;
    return r.babyId === viewMode;
  });

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-xl font-black tracking-tight text-[#1C1C1E]">활동 내역</h3>
        
        {/* iOS style Segmented Control - Light */}
        <div className="bg-black/5 p-1 rounded-2xl flex space-x-0.5 backdrop-blur-md">
          <button
            onClick={() => setViewMode('ALL')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all ${
              viewMode === 'ALL' ? 'bg-white text-black shadow-sm' : 'text-gray-400'
            }`}
          >전체</button>
          {babies.map(baby => (
            <button
              key={baby.id}
              onClick={() => setViewMode(baby.id)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                viewMode === baby.id ? 'bg-white text-black shadow-sm' : 'text-gray-400'
              }`}
            >
              {babyNameMap[baby.name] || baby.name}
            </button>
          ))}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="ios-glass p-12 text-center border border-white border-dashed border-gray-200">
          <p className="text-sm font-medium text-gray-300">
            기록된 활동이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredRecords.map((record) => {
            const baby = babies.find(b => b.id === record.babyId);
            const shortName = baby ? (babyNameMap[baby.name] || baby.name) : 'Unknown';
            return (
              <div key={record.id} onClick={() => setEditingRecord(record)} className="cursor-pointer">
                <RecordItem record={record} shortName={shortName} />
              </div>
            );
          })}
        </div>
      )}

      {editingRecord && (
        <EditRecordModal 
          record={editingRecord} 
          onClose={() => setEditingRecord(null)} 
        />
      )}
    </div>
  );
};
