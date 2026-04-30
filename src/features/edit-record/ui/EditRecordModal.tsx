import { useState } from 'react';
import { 
  X,
  Trash2,
  Clock,
  Save
} from 'lucide-react';
import { useRecordStore } from '@entities/record';
import type { RecordEntry } from '@shared/types/record';

interface EditRecordModalProps {
  record: RecordEntry;
  onClose: () => void;
}

const POO_COLORS = [
  { name: '노랑', color: '#F8D66D' },
  { name: '옅은갈색', color: '#D2B48C' },
  { name: '짙은갈색', color: '#8B4513' },
  { name: '녹색', color: '#556B2F' },
  { name: '붉은색', color: '#B22222' },
  { name: '흰색', color: '#FFFFFF' },
];

export const EditRecordModal = ({ record, onClose }: EditRecordModalProps) => {
  const { updateRecord, deleteRecord } = useRecordStore();
  
  const [subCategory] = useState(record.subCategory);
  const [amount, setAmount] = useState(record.value?.toString() || '');
  const [note, setNote] = useState(record.note || '');
  const [startTime, setStartTime] = useState(() => {
    const d = new Date(record.startTime);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState(() => {
    if (!record.endTime) return '';
    const d = new Date(record.endTime);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [pooColor, setPooColor] = useState(record.metadata?.pooColor || '노랑');

  const handleSave = async () => {
    try {
      await updateRecord(record.id, {
        subCategory,
        value: amount ? parseFloat(amount) : undefined,
        startTime: new Date(startTime).toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        note,
        metadata: record.category === 'DIAPER' && subCategory === '대변' ? { pooColor } : record.metadata,
      });
      onClose();
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteRecord(record.id);
        onClose();
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    }
  };

  const handleAdjustAmount = (delta: number) => {
    const current = parseInt(amount) || 0;
    const next = Math.max(0, current + delta);
    setAmount(next.toString());
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md p-6 relative animate-ios-in rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-[#1C1C1E]">기록 수정</h3>
          <button onClick={onClose} className="p-2 text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Time Fields */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">시작 시간</label>
              <div className="flex items-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <Clock size={18} className="text-gray-300 mr-3" />
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent flex-1 text-sm font-bold text-[#1C1C1E] outline-none"
                />
              </div>
            </div>

            {record.category === 'SLEEP' && (
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">종료 시간</label>
                <div className="flex items-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <Clock size={18} className="text-gray-300 mr-3" />
                  <input 
                    type="datetime-local" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-transparent flex-1 text-sm font-bold text-[#1C1C1E] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Amount Adjustments */}
          {['FEEDING', 'SOLID'].includes(record.category) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">양 (ml)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-right font-black text-3xl w-24 outline-none text-[#1C1C1E]"
                  />
                  <span className="ml-2 font-bold text-blue-500">ml</span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[-20, -10, -5, 5, 10, 20].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAdjustAmount(val)}
                    className={`py-2 rounded-xl text-[10px] font-black ${
                      val > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>

              {/* 30ml Interval Quick Select */}
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 120, 150, 180, 210, 240].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 active:bg-gray-100"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Diaper Color */}
          {record.category === 'DIAPER' && record.subCategory === '대변' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">변 색상</label>
              <div className="flex justify-between px-1">
                {POO_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setPooColor(c.name)}
                    className={`group flex flex-col items-center space-y-2`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        pooColor === c.name ? 'border-blue-500 scale-125' : 'border-white'
                      } shadow-sm`}
                      style={{ backgroundColor: c.color }}
                    />
                    <span className={`text-[8px] font-bold ${
                      pooColor === c.name ? 'text-blue-500' : 'text-gray-300'
                    }`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Memo */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">메모</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이사항 입력"
              rows={3}
              className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-medium text-[#1C1C1E] outline-none border border-gray-100 resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button 
              onClick={handleDelete}
              className="w-16 h-14 flex items-center justify-center text-red-500 bg-red-50 rounded-2xl active:bg-red-100 transition-colors"
            >
              <Trash2 size={24} />
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 h-14 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
            >
              <Save size={20} />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
