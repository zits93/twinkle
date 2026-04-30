-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Babies (아기 정보)
create table babies (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null,
  name text not null,
  birth_date timestamp with time zone not null,
  gender text check (gender in ('boy', 'girl')),
  color_theme text check (color_theme in ('mint', 'coral')),
  profile_image_url text,
  created_at timestamp with time zone default now()
);

-- 2. Records (상세 기록)
create table records (
  id uuid primary key default uuid_generate_v4(),
  baby_id uuid not null references babies(id) on delete cascade,
  user_id uuid not null,
  category text not null check (category in ('feeding', 'sleep', 'diaper', 'activity', 'health', 'custom', 'solid', 'snack', 'water', 'milk')),
  sub_category text,
  value float,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  note text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. User Settings (사용자/아기별 설정)
create table user_settings (
  id uuid primary key default uuid_generate_v4(),
  baby_id uuid not null references babies(id) on delete cascade,
  feeding_interval integer default 180, -- 수유 주기(분 단위, 기본 3시간)
  mute_during_night boolean default true, -- 밤잠 중 알림 끄기 여부
  custom_categories jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);

-- 4. Families (가족 그룹)
create table families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- 5. Family Members (가족 멤버)
create table family_members (
  family_id uuid references families(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'member')),
  primary key (family_id, user_id)
);

-- RLS (Row Level Security) - Basic setup (To be refined with Auth)
alter table babies enable row level security;
alter table records enable row level security;
alter table user_settings enable row level security;
alter table families enable row level security;
alter table family_members enable row level security;

-- Basic Policies (Placeholder: Allow all for development)
-- In production, these should be restricted to authenticated users in the same family.
create policy "Public access" on babies for all using (true);
create policy "Public access" on records for all using (true);
create policy "Public access" on user_settings for all using (true);
create policy "Public access" on families for all using (true);
create policy "Public access" on family_members for all using (true);

-- Indexes for performance
create index idx_records_baby_id on records(baby_id);
create index idx_records_start_time on records(start_time desc);
create index idx_user_settings_baby_id on user_settings(baby_id);
