# COVIX 2026년 200억 매출달성 성과관리 대시보드

코빅스 2026년 200억 매출 달성을 위한 GEMS(Goal, Execution, Measurement, Strategy) 기반 성과관리 시스템입니다.

## 주요 기능

### 🎯 GEMS 기반 성과 관리
- **Goal (목표)**: 전사 및 본부별 KPI 목표 설정 및 추적
- **Execution (실행)**: 실적 증빙 파일 업로드 및 관리
- **Measurement (측정)**: 실시간 KPI 달성률 모니터링 및 신호등 표시
- **Strategy (전략)**: 원인 분석 및 행동 계획 수립

### 📊 대시보드 기능
- **전사 대시보드 (CEO 뷰)**: 전사 매출 목표 (200억) 및 본부별 KPI 현황 통합 뷰
- **코빅스 통합 대시보드**: 모든 기능에 빠르게 접근할 수 있는 통합 뷰
- **개인별 대시보드**: 각 본부장의 KPI를 독립적으로 관리
- **월별 데이터 관리**: 월별 실적 및 피드백 관리
- **신호등 색상 표시**: 🟢 정상 / 🟡 주의 / 🔴 위험

### 📎 실적 증빙
- **파일 업로드**: Excel (.xlsx, .xls), PDF (.pdf), Word (.doc, .docx), Image (.png, .jpg, .jpeg), CSV (.csv), TXT (.txt) 등 다양한 형식 지원
- **드래그 앤 드롭**: 직관적인 파일 업로드 인터페이스
- **파일 관리**: 첨부된 파일 목록 및 삭제 기능
- **전용 업로드 페이지**: 네비게이션의 "성과자료 업로드 | KPI등록" 메뉴에서 월별 파일 관리

### 📋 KPI 관리
- **KPI 등록**: 부서별 담당자별 새로운 KPI 등록
- **KPI 삭제**: 커스텀 KPI 삭제 기능
- **월별 목표 설정**: 각 KPI의 월별 목표값 입력 및 수정

### 💬 피드백 및 행동 계획
- **원인 분석**: 목표와 차이가 발생한 원인 분석 입력
- **행동 계획**: 다음 달 구체적인 개선 방안 작성
- **자동 저장**: 로컬 스토리지 기반 데이터 저장

### 🤖 AI 기반 분석
- **Gemini AI 연동**: AI 기반 데이터 분석 및 인사이트 제공
- **성과자료 분석**: 업로드된 파일을 분석하여 강점, 개선점 파악
- **권장사항**: 자동 생성된 개선 권장사항
- **실행 계획**: AI가 제안하는 우선순위별 실행 계획
- **전용 분석 페이지**: 네비게이션의 "AI 분석" 메뉴에서 상세 분석 결과 확인

### 🎨 사용자 경험
- **통합 네비게이션**: 모든 페이지 상단에 일관된 네비게이션 바
- **반응형 디자인**: 모바일 및 데스크톱 지원
- **다크 모드**: 네비게이션 바에서 테마 전환 가능
- **확장 가능한 KPI 카드**: 클릭하여 피드백 작성
- **직관적인 UI**: 신호등 색상(🟢🟡🔴)으로 상태 즉시 파악

## 페이지 구조

### 네비게이션
모든 페이지 상단에 통합 네비게이션 바가 표시됩니다:
- **메인**: 대시보드 목록
- **전사 대시보드**: CEO 뷰
- **성과자료 업로드 | KPI등록**: 파일 업로드 및 KPI 관리 페이지
- **AI 분석**: 성과자료 분석 페이지
- **코빅스 통합 대시보드**: 모든 기능 통합 뷰

### 주요 페이지

- **메인 페이지**: `/`
  - 대시보드 목록 및 통계

- **코빅스 통합 대시보드**: `/dashboard`
  - 모든 기능에 빠르게 접근할 수 있는 통합 뷰
  - 빠른 링크 및 본부별 대시보드 목록

- **전사 대시보드 (CEO 뷰)**: `/ceo`
  - 전사 매출 목표 (200억) 및 달성률
  - 본부별 KPI 달성률 비교 차트
  - 본부별 상세 현황 카드
  - 신호등 색상 표시 (🟢🟡🔴)

- **성과자료 업로드 | KPI등록**: `/performance/upload`
  - 월별 성과자료 파일 업로드
  - 부서별 담당자별 KPI 등록 및 관리
  - 월별 목표 설정
  - 지원 형식: Excel, PDF, Word, Image, CSV, TXT
  - 드래그 앤 드롭 지원
  - 파일 관리 기능

- **AI 성과 분석**: `/performance/analysis`
  - 업로드된 성과자료 AI 분석
  - 강점 및 개선점 분석
  - 개선 권장사항 제시
  - 향후 개선 행동 계획 자동 생성

- **개인별 대시보드**: `/dashboard/[executive-id]`
  - 확장 가능한 KPI 카드 (클릭하여 피드백 작성)
  - 실적 증빙 파일 업로드
  - 원인 분석 및 행동 계획 입력
  - KPI 추이 차트
  - AI 분석 결과
  - 월별 데이터 선택

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Gemini API 키를 추가하세요:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Gemini API 키는 [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## Vercel 배포

### 배포 방법

1. **Vercel CLI를 사용한 배포**:
```bash
npm install -g vercel
vercel login
vercel --prod
```

2. **Vercel 웹사이트를 통한 배포**:
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 연결 또는 직접 업로드
   - 프로젝트 이름: "COVIX 2026년 200억 매출달성 성과관리 대시보드"
   - 환경 변수 설정 (NEXT_PUBLIC_GEMINI_API_KEY)
   - 배포

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Gemini AI API 키

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## 사용 시나리오

### 월별 운영 프로세스

1. **매월 초**: 각 본부장은 자신의 대시보드에 접속
2. **데이터 입력**: 전월 실적 파일을 업로드하고 달성률 확인
3. **피드백 작성**: 성과가 부진한 지표(🔴/🟡)에 대해 원인 분석 및 행동 계획 작성
4. **임원 회의**: CEO는 전사 대시보드를 통해 각 본부장의 행동 계획을 확인하며 회의 주재

### KPI 카드 사용법

1. KPI 카드를 클릭하여 확장
2. 하단에 나타나는 폼에서:
   - **원인 분석**: 목표와 차이가 발생한 원인을 분석하여 입력
   - **행동 계획**: 다음 달 구체적인 개선 방안 작성
   - **실적 증빙**: Excel, PDF, Image 등 파일 업로드
3. 저장 버튼을 클릭하여 저장

## 기술 스택

- **Next.js 16**: React 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **Recharts**: 차트 라이브러리
- **Gemini AI**: AI 분석
- **next-themes**: 다크 모드 지원
- **Lucide React**: 아이콘

## 프로젝트 구조

```
app/
├── components/          # 재사용 가능한 컴포넌트
│   ├── KPICard.tsx     # KPI 카드 컴포넌트
│   ├── KPICardExpanded.tsx # 확장 가능한 KPI 카드
│   ├── KPIManagement.tsx # KPI 관리 컴포넌트
│   ├── KPITrendChart.tsx # KPI 추이 차트
│   ├── ActionPlanCard.tsx # 실행 계획 카드
│   ├── FileUpload.tsx  # 파일 업로드 컴포넌트
│   ├── FeedbackForm.tsx # 피드백 폼
│   ├── ThemeToggle.tsx # 테마 전환 버튼
│   └── Navigation.tsx  # 네비게이션 바
├── dashboard/          # 대시보드 페이지
│   ├── page.tsx        # 통합 대시보드
│   └── [executive]/   # 동적 라우팅
│       └── page.tsx    # 개인별 대시보드 페이지
├── ceo/               # CEO 대시보드
│   └── page.tsx
├── performance/       # 성과 관리 페이지
│   ├── upload/        # 업로드 페이지
│   └── analysis/      # AI 분석 페이지
├── data/              # 데이터 파일
│   └── executives.ts  # 임원별 KPI 데이터
├── lib/               # 유틸리티 함수
│   ├── gemini.ts     # Gemini AI 연동
│   ├── ai-analysis.ts # AI 분석 라이브러리
│   └── storage.ts    # 로컬 스토리지 관리
├── types/             # TypeScript 타입 정의
│   └── kpi.ts        # KPI 관련 타입
├── layout.tsx        # 루트 레이아웃
├── page.tsx          # 메인 페이지
└── providers.tsx     # 테마 프로바이더
```

## 다음 단계

- [ ] 실제 ERP/CRM 시스템과 연동
- [ ] 사용자 인증 시스템 추가
- [ ] 알림 시스템 구현 (KPI 위험 신호 발생 시)
- [ ] 데이터베이스 연동 (현재는 로컬 스토리지 사용)
- [ ] 실시간 데이터 업데이트
- [ ] 파일 서버 연동 (현재는 파일 메타데이터만 저장)

## 라이선스

이 프로젝트는 코빅스 내부 사용을 위한 것입니다.
