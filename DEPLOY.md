# Vercel 배포 가이드

## COVIX 2026년 200억 매출달성 성과관리 대시보드 배포

### 배포 전 준비사항

1. **Vercel 계정 생성**
   - [https://vercel.com](https://vercel.com)에서 계정 생성

2. **프로젝트 빌드 확인**
   ```bash
   npm run build
   ```
   빌드가 성공적으로 완료되어야 합니다.

### 배포 방법 1: Vercel CLI 사용

1. **Vercel 로그인**
   ```bash
   vercel login
   ```
   브라우저가 열리면 Vercel 계정으로 로그인하세요.

2. **프로젝트 배포**
   ```bash
   vercel --prod
   ```

3. **프로젝트 이름 설정**
   배포 시 프로젝트 이름을 입력하거나, 자동으로 생성된 이름을 사용하세요.
   권장 이름: `covix-2026-kpi-dashboard` 또는 `covix-200억-성과관리-대시보드`

4. **환경 변수 설정**
   배포 후 Vercel 대시보드에서 환경 변수를 설정하세요:
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Gemini AI API 키 (선택사항)

### 배포 방법 2: Vercel 웹사이트 사용 (권장)

1. **GitHub에 코드 푸시** (선택사항)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: COVIX 2026 KPI Dashboard"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Vercel 대시보드에서 배포**
   - [https://vercel.com/new](https://vercel.com/new) 접속
   - "Add New..." → "Project" 클릭
   - GitHub 저장소를 선택하거나 "Import Git Repository" 클릭
   - 또는 "Upload" 버튼으로 직접 업로드

3. **프로젝트 설정**
   - **Project Name**: `COVIX 2026년 200억 매출달성 성과관리 대시보드`
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정)
   - **Output Directory**: `.next` (자동 설정)
   - **Install Command**: `npm install` (자동 설정)

4. **환경 변수 추가**
   - "Environment Variables" 섹션에서 추가:
     - Key: `NEXT_PUBLIC_GEMINI_API_KEY`
     - Value: (Gemini API 키 입력)
     - Environment: Production, Preview, Development 모두 선택

5. **배포 실행**
   - "Deploy" 버튼 클릭
   - 배포가 완료되면 URL이 제공됩니다.

### 배포 후 확인사항

1. **배포 URL 확인**
   - Vercel 대시보드에서 배포된 URL 확인
   - 예: `https://covix-2026-kpi-dashboard.vercel.app`

2. **기능 테스트**
   - 메인 페이지 접속 확인
   - 네비게이션 메뉴 동작 확인
   - 파일 업로드 기능 테스트
   - KPI 등록 기능 테스트
   - 다크 모드 전환 확인

3. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - `NEXT_PUBLIC_GEMINI_API_KEY`가 설정되어 있는지 확인

### 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 도메인 설정

### 문제 해결

**빌드 오류 발생 시:**
```bash
npm run build
```
로컬에서 빌드 오류를 먼저 확인하세요.

**환경 변수 오류:**
- Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_` 접두사 필수)

**배포 실패 시:**
- Vercel 대시보드의 "Deployments" 탭에서 로그 확인
- 빌드 로그를 확인하여 오류 원인 파악

## 배포 완료 후

배포가 완료되면 다음 URL로 접속할 수 있습니다:
- 프로덕션 URL: `https://[프로젝트명].vercel.app`
- Vercel 대시보드에서 확인 가능

**참고**: 첫 배포 시 Vercel이 자동으로 프로젝트를 분석하고 최적의 설정을 적용합니다.

