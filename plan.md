# Twinkle: Twin Parenting Record App Development Plan

Twinkle is a specialized parenting record application designed specifically for parents of twins. It focuses on reducing the cognitive load and repetitive tasks associated with tracking two babies simultaneously.

## Phase 1: 핵심 기능 정의 (쌍둥이 특화 포인트)

### 1. 원클릭 듀얼 기록 (Dual Recording)
- **문제점**: 쌍둥이 부모는 종종 두 아이를 동시에 수유하거나 기저귀를 갑니다. 같은 내용을 두 번 입력하는 것은 번거롭습니다.
- **해결책**: 모든 기록 폼에 'A아기', 'B아기', '둘 다' 버튼을 배치합니다.
- **구현**: '둘 다' 선택 시, 백엔드에서 동일한 데이터를 각 아기의 ID로 두 번 생성하여 저장합니다.

### 2. 통합/분할 먹놀잠 대시보드 (Dashboard)
- **문제점**: 두 아이의 패턴을 비교하기 위해 화면을 왔다 갔다 하는 것은 직관적이지 않습니다.
- **해결책**: 
    - **오버레이 뷰**: 하나의 타임라인에 A와 B의 이벤트를 색상별로 겹쳐서 표시하여 수면 싱크 등을 한눈에 파악합니다.
    - **좌우 분할 뷰**: 모바일 가로 모드나 대화면에서 두 아이의 현재 상태(마지막 수유 시간, 기저귀 상태 등)를 동시에 확인합니다.

### 3. 공동 양육자 실시간 동기화
- **문제점**: 엄마, 아빠, 조부모님이 각자 기록할 때 데이터가 꼬이거나 늦게 반영됩니다.
- **해결책**: Supabase Realtime을 활용하여 한 명이 기록하는 즉시 모든 연결된 기기의 대시보드가 업데이트됩니다.

### 4. 스마트 수유 알림 (Smart Notifications)
- **기능**: 마지막 수유 시간으로부터 설정된 주기(예: 3~4시간)가 지나면 배고픔 알림을 발송합니다.
- **밤잠 모드**: 밤잠(Night Sleep)으로 기록된 시간 동안은 자동으로 수유 알림을 무음 처리하거나 끄는 기능을 제공합니다.

### 5. 성장 통계 및 시각화 (Growth & Stats)
- **성장 곡선**: 질병관리청/WHO 성장 도표 데이터를 기반으로 아이의 키, 몸무게가 상위 몇 %인지 백분위수를 계산하여 그래프로 보여줍니다.
- **패턴 분석**: 일주일 단위의 수유량 변화, 수면 시간 변화, 수유 간격 등을 시각화하여 아이의 성장 패턴을 직관적으로 파악하게 합니다.

---

## Phase 2: 기술 스택 선정 (Web App)

### Frontend
- **Architecture**: **FSD (Feature-Sliced Design)** - 모듈화된 폴더 구조로 유지보수성 및 확장성 확보.
- **Framework**: **React (Vite)** - 빠른 개발 속도와 최적화된 성능.
- **Styling**: **MUI (Material UI)** + **Tailwind** - 친숙한 모바일 조작감과 커스텀 디자인의 조화.
- **Visualization**: **Recharts** - 성장 곡선 및 패턴 시각화.
- **State Management**: **Zustand** - 경량화된 글로벌 상태 관리.
- **PWA**: 모바일 앱처럼 홈 화면에 추가하여 접근성 향상.

### Backend & Database
- **Platform**: **Supabase** (BaaS)
    - **Auth**: 카카오, 구글 소셜 로그인 및 이메일 링크 로그인.
    - **Database**: PostgreSQL (아기 프로필, 기록 데이터).
    - **Realtime**: 실시간 데이터 동기화.
    - **Storage**: 아기 프로필 사진 및 성장 기록 사진 저장.

---

## Phase 3: UI/UX 디자인 전략

### 1. 색상 분리 (Color Coding)
- **첫째(A)**: 민트/블루 계열 (Cool)
- **둘째(B)**: 코랄/핑크 계열 (Warm)
- 배경색이나 테두리, 아이콘 색상을 통해 현재 어떤 아이의 데이터를 입력/확인 중인지 무의식적으로 인지하게 합니다.

### 2. 제스처 기반 전환
- 하단 탭 바 외에도 화면 좌우 스와이프를 통해 아기 간 화면 전환을 즉시 수행합니다.

### 3. 프리미엄 디자인
- **Glassmorphism**: 카드 UI에 투명도와 블러 효과를 주어 세련된 느낌 전달.
- **Micro-animations**: 기록 완료 시 부드러운 체크 애니메이션이나 아기 캐릭터의 반응 등을 추가.

---

## Phase 4: 데이터베이스 구조 설계 (초안)

### 1. `babies` (아기 정보)
- `id` (UUID, PK)
- `family_id` (UUID, FK)
- `name` (Text)
- `birth_date` (Timestamp)
- `gender` (Enum)
- `color_theme` (Text) - 'mint' | 'coral'
- `profile_image_url` (Text)

### 2. `records` (상세 기록)
- `id` (UUID, PK)
- `baby_id` (UUID, FK)
- `user_id` (UUID, FK)
- `category` (Enum: `feeding`, `sleep`, `diaper`, `activity`, `health`, `custom`)
- `sub_category` (Text: `formula`, `breast`, `solid`, `nap`, `night_sleep`, `bath`, `medicine`, 등)
- `value` (Float) - 양, 온도 등 수치 데이터
- `start_time` (Timestamp)
- `end_time` (Timestamp)
- `note` (Text)
- `metadata` (JSONB) - 커스텀 기록이나 추가 정보(예: 이유식 재료, 약 종류) 저장용
- `created_at` (Timestamp)

### 3. `user_settings` (사용자/아기별 설정)
- `baby_id` (UUID, FK)
- `feeding_interval` (Integer) - 수유 주기(분 단위)
- `mute_during_night` (Boolean) - 밤잠 중 알림 끄기 여부
- `custom_categories` (JSONB) - 사용자가 추가한 커스텀 기록 항목 정의

### 3. `families` (가족 그룹)
- `id` (UUID, PK)
- `name` (Text)

### 4. `family_members` (가족 멤버)
- `family_id` (UUID, FK)
- `user_id` (UUID, FK)
- `role` (Enum: `owner`, `member`)

---

## 현재 진행 상황 (Progress) - 2026.04

### ✅ 완료된 작업 (Completed)
- **프로젝트 초기 설정**: Vite, React, TypeScript 기반 FSD(Feature-Sliced Design) 아키텍처 구축.
- **UI/UX 시스템**: Tailwind CSS v4 + MUI 조합으로 다크 모드 및 Glassmorphism 기반 프리미엄 UI 뼈대 완성.
- **상태 관리**: Zustand를 이용한 로컬 상태(메모리 기반) 관리 로직 및 아기 프로필 스토어 구현.
- **기록 기능 (`AddRecordForm`)**: '원클릭 듀얼 기록' 지원, 수유(분유/모유/유축 등), 수면, 기저귀, 활동(목욕/터미타임), 건강(체온/약), 커스텀 카테고리 지원.
- **자동 수면 인식**: 밤 8시 ~ 아침 6시 기록 시 자동으로 '밤잠' 분류.
- **대시보드 (`Dashboard`)**: 아기별 요약 상태(마지막 수유/수면/기저귀), 쌍둥이 싱크 상태 시각화.
- **타임라인 (`RecordTimeline`)**: A, B 아기별 필터링이 가능한 히스토리 뷰.
- **통계 및 성장 시각화 (`StatsPage`, `GrowthChart`)**: Recharts를 이용한 일간 수유량 바 차트 및 WHO/KCDC 기준 백분위수 체중 성장 곡선 차트 구현.
- **스마트 배고픔 알림 (`useFeedingStatus`)**: 마지막 수유 시간 기준 주기 경과 여부 UI 표시 (밤잠 중 무음 처리 로직 포함).
- **프로젝트 인프라**: GitHub Actions 기반 CI (Lint & Build) 및 GitHub Pages 자동 배포 파이프라인 구축. Issue/PR 템플릿 적용 완료.

### 🚧 진행 중 / 대기 중인 작업 (Pending)
- **Supabase 백엔드 연동**: 실제 DB 생성 및 Zustand 로컬 상태를 Supabase Realtime으로 교체.
- **사용자 설정 페이지**: 수유 간격(예: 3시간, 4시간) 및 커스텀 카테고리 직접 추가/수정 기능.
- **PWA 및 모바일 최적화**: Web App Manifest 설정 및 Service Worker를 통한 백그라운드 푸시 알림 (실제 앱처럼 동작하도록).
- **UI 폴리싱**: 스와이프 제스처를 이용한 탭 전환, 각 동작에 따른 마이크로 애니메이션 강화.

---

## 향후 로드맵 (Refined)

1.  **Phase 5: 데이터 영속성 및 동기화 (Supabase 연동)**
    - Supabase 프로젝트 생성 및 SQL 스키마 적용 (Auth, Database).
    - Zustand 스토어를 Supabase 클라이언트와 연동하여 읽기/쓰기 구현.
    - 공동 양육자 초대(Family ID 공유) 및 Realtime 기반 대시보드 자동 갱신.
2.  **Phase 6: 맞춤 설정 고도화 (Settings)**
    - 환경 설정 탭 구현: 밤잠 기준 시간 설정, 수유 간격 주기 변경.
    - 테마 색상(A아기, B아기) 커스터마이징 기능.
3.  **Phase 7: PWA 및 실제 알림 (Push Notifications)**
    - PWA Manifest 작성 (모바일 홈 화면 추가 최적화).
    - Service Worker를 활용하여 웹 브라우저가 닫혀 있어도 주기가 지나면 푸시 알림 발송.
4.  **Phase 8: 베타 테스트 및 폴리싱**
    - 모바일 환경(iOS Safari, Android Chrome)에서의 터치 및 스크롤 최적화.
    - App Store / Play Store 등록을 위한 TWA(Trusted Web Activity) 패키징 고려.
