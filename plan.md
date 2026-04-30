Twinkle is a specialized parenting record application designed specifically for parents of twins. It focuses on reducing the cognitive load and repetitive tasks associated with tracking two babies simultaneously.

## 💡 개발 가이드라인 (Dev Guidelines)
- **커밋 전 빌드 확인**: 코드 수정 완료 후 커밋하기 전에 반드시 `npm run build`를 실행하여 빌드 오류가 없는지 확인합니다.
- **FSD 아키텍처 준수**: 모든 컴포넌트와 로직은 Feature-Sliced Design 구조에 맞게 배치합니다.
- **Lightweight & Pure**: MUI 등 무거운 외부 라이브러리 사용을 지양하고, Tailwind CSS와 순수 HTML/CSS로 iOS 스타일을 지향합니다.

## Phase 1: 핵심 기능 정의 (쌍둥이 특화 포인트)

### 1. 원클릭 듀얼 기록 (Dual Recording)
- **해결책**: 모든 기록 폼에 'A아기', 'B아기', '둘 다' 버튼을 배치하여 동시 기록 지원.

### 2. 통합/분할 먹놀잠 대시보드 (Dashboard)
- **해결책**: 오버레이 뷰와 좌우 분할 뷰를 통해 두 아이의 패턴을 직관적으로 비교.

### 3. 공동 양육자 실시간 동기화
- **해결책**: Supabase Realtime을 활용한 즉각적인 데이터 업데이트.

---

## Phase 2: 기술 스택 선정 (Web App)

### Frontend
- **Architecture**: **FSD (Feature-Sliced Design)**
- **Framework**: **React (Vite)**
- **Styling**: **Pure Tailwind CSS v4** (MUI 의존성 제거 완료)
- **Visualization**: **Recharts**
- **State Management**: **Zustand**
- **PWA**: 오프라인 지원 및 홈 화면 추가 지원.

### Backend & Database
- **Platform**: **Supabase** (Auth, Database, Realtime)

---

## Phase 3: UI/UX 디자인 전략 (Refined)

### 1. iOS 17/18 스타일 (Native Look & Feel)
- **Squircle Corners**: 부드러운 곡률의 모서리 적용.
- **System Colors**: iOS 표준 블루, 핑크, 그린, 오렌지 컬러 시스템 사용.
- **SF Symbols Style**: 정갈하고 일관된 두께의 아이콘 시스템.

### 2. Bright Liquid Glass
- **Frosted Glass**: 화이트 반투명 배경과 고해상도 블러 효과.
- **Pastel Liquid Background**: 배경에서 유영하는 화사한 파스텔톤 광원 효과.
- **Vibrancy**: 높은 채도와 대비를 통한 프리미엄 시각 경험.

---

## 현재 진행 상황 (Progress) - 2026.04

### ✅ 완료된 작업 (Completed)
- **MUI 의존성 100% 제거**: 프로젝트 내 모든 MUI 컴포넌트를 Tailwind/HTML로 교체하여 경량화 성공.
- **Bright Liquid Glass 디자인 구현**: 화사하고 깨끗한 화이트 테마 기반의 액체 유리 UI 완성.
- **iOS 스타일 UI 시스템**: 세그먼트 컨트롤, 탭 바, 그룹 리스트 등 iOS 순정 UI 패턴 이식 완료.
- **Supabase 백엔드 고도화**: Auth, Family 자동 생성, 실시간 CRUD 연동 완료.
- **빌드 안정성 확보**: 프로덕션 빌드 테스트 통과 및 최종 커밋 완료.

### 🚧 진행 중 / 대기 중인 작업 (Pending)
- **PWA 및 모바일 최적화**: 실제 모바일 기기에서의 터치 제스처 및 홈 화면 추가 최적화.
- **푸시 알림**: Service Worker를 활용한 실시간 알람 기능.
- **공동 양육자 초대**: Family ID 공유를 통한 실시간 초대 로직.

---

## 향후 로드맵 (Refined)

1.  **Phase 6: UI/UX 고도화 (완료 단계)**
    - [x] MUI 제거 및 순수 Tailwind 전환.
    - [x] iOS 스타일 라이트 모드 (Bright Liquid Glass) 적용.
    - [ ] Framer Motion을 이용한 유기적 전환 애니메이션 추가.
2.  **Phase 7: PWA 및 모바일 최적화 (Next Step!)**
    - [ ] PWA Manifest 고도화 및 아이콘 설정.
    - [ ] Service Worker 푸시 알림 연동.
3.  **Phase 8: 베타 테스트 및 폴리싱**
    - [ ] 모바일 브라우저(Safari, Chrome) 제스처 최적화.
    - [ ] 통계 그래프 인터랙션 강화.
