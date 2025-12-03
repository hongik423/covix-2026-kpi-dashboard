# Vercel 배포 가이드 - hongik423-3087 계정

## 문제 해결
Windows 시스템 사용자 이름에 한글이 포함되어 있어 Vercel CLI 로그인에 문제가 있습니다.
대신 Vercel 웹사이트를 통해 배포하는 방법을 사용하세요.

## 배포 방법

### 1단계: Vercel 웹사이트 접속 및 로그인

1. 브라우저에서 [https://vercel.com](https://vercel.com) 접속
2. **hongik423-3087** 계정으로 로그인
3. 대시보드로 이동

### 2단계: 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** 버튼 클릭
2. **"Project"** 선택

### 3단계: 프로젝트 가져오기

**옵션 A: GitHub 저장소 연결 (권장)**
1. GitHub 저장소가 있다면:
   - "Import Git Repository" 클릭
   - GitHub 계정 연결 (필요시)
   - 저장소 선택
   - "Import" 클릭

**옵션 B: 직접 업로드**
1. "Upload" 버튼 클릭
2. 프로젝트 폴더 전체를 ZIP으로 압축
3. ZIP 파일 업로드

**옵션 C: CLI로 배포 (대안)**
```bash
# 환경 변수 설정으로 사용자 이름 문제 우회 시도
$env:USER="vercel-user"
vercel login
```

### 4단계: 프로젝트 설정

프로젝트를 가져온 후 다음 설정을 확인하세요:

- **Project Name**: `COVIX 2026년 200억 매출달성 성과관리 대시보드`
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

### 5단계: 환경 변수 설정 (선택사항)

"Environment Variables" 섹션에서:

- **Key**: `NEXT_PUBLIC_GEMINI_API_KEY`
- **Value**: (Gemini API 키 입력 - 선택사항)
- **Environment**: Production, Preview, Development 모두 선택

### 6단계: 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인
3. 배포 완료 후 URL 확인

## 배포 후 확인

배포가 완료되면:
- 프로덕션 URL: `https://[프로젝트명].vercel.app`
- Vercel 대시보드의 "Deployments" 탭에서 확인 가능

## 대안: GitHub Actions를 통한 자동 배포

GitHub 저장소가 있다면:

1. GitHub에 코드 푸시
2. Vercel 대시보드에서 GitHub 저장소 연결
3. 자동 배포 설정 활성화
4. 이후 `git push` 시 자동 배포

## 문제 해결

**CLI 로그인 오류가 계속 발생하는 경우:**
- Vercel 웹사이트를 통한 배포 사용 (권장)
- 또는 다른 Windows 사용자 계정에서 시도

**빌드 오류 발생 시:**
```bash
npm run build
```
로컬에서 먼저 빌드 테스트를 진행하세요.

**환경 변수 설정:**
- Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 사용 가능

## 현재 프로젝트 상태

✅ 모든 파일 커밋 완료
✅ 빌드 성공 확인
✅ Vercel 배포 준비 완료
✅ vercel.json 설정 파일 생성 완료

이제 Vercel 웹사이트를 통해 배포하시면 됩니다!


