export type BabyId = 'baby-a' | 'baby-b';

export type RecordCategory = 
  | 'FEEDING' 
  | 'SLEEP' 
  | 'DIAPER' 
  | 'ACTIVITY' 
  | 'HEALTH' 
  | 'GROWTH'
  | 'CUSTOM';

export type FeedingSubCategory = 
  | 'FORMULA' 
  | 'BREAST' 
  | 'PUMPED' 
  | 'BOTTLE_BM' 
  | 'SOLID' 
  | 'SNACK' 
  | 'MILK' 
  | 'WATER';

export type SleepSubCategory = 'NAP' | 'NIGHT';

export type DiaperSubCategory = 'PEE' | 'POO' | 'BOTH';

export type ActivitySubCategory = 'BATH' | 'TUMMY_TIME' | 'PLAY';

export type HealthSubCategory = 'HOSPITAL' | 'TEMPERATURE' | 'MEDICINE';

export interface RecordEntry {
  id: string;
  babyId: BabyId;
  userId: string;
  category: RecordCategory;
  subCategory: string;
  value?: number; // amount in ml, weight in kg, etc.
  startTime: string; // ISO string
  endTime?: string; // ISO string for sleep
  note?: string;
  metadata?: Record<string, any>;
  isDual?: boolean;
  syncGroupId?: string;
  createdAt: string;
}

export interface BabyProfile {
  id: BabyId;
  name: string;
  birthDate: string;
  gender: 'M' | 'F';
  colorTheme: string; // 'mint' | 'coral'
  photoUrl?: string;
}

export interface UserSettings {
  feedingInterval: number; // minutes
  nightSleepStart: string; // "20:00"
  nightSleepEnd: string; // "07:00"
  muteNightNotif: boolean;
  customCategories: string[];
}
