# Vercel 빠른 배포 가이드

## 현재 Vercel 대시보드에서 할 일

### 방법 1: GitHub 저장소 연결 (권장)

1. **GitHub에 코드 푸시** (아직 안 했다면):
   ```bash
   # GitHub에 새 저장소 생성 후
   git remote add origin https://github.com/hongik423/[저장소명].git
   git push -u origin main
   ```

2. **Vercel 대시보드에서**:
   - "Import Git Repository" 섹션에서 GitHub 저장소 찾기
   - 또는 상단의 "Enter a Git repository URL"에 GitHub URL 입력
   - "Continue" 클릭

### 방법 2: 직접 업로드

1. **프로젝트 폴더 압축**:
   - 현재 폴더 전체를 ZIP으로 압축
   - (node_modules 제외)

2. **Vercel에서**:
   - "Upload" 버튼 찾기 (화면 어딘가에 있을 것)
   - ZIP 파일 업로드

### 방법 3: Git URL 직접 입력

화면 상단의 "Enter a Git repository URL" 필드에:
- GitHub 저장소 URL 입력 (예: `https://github.com/hongik423/kobix-kpi-dashboard.git`)
- "Continue" 클릭

## 다음 단계 (저장소 연결 후)

1. **프로젝트 설정**:
   - Project Name: `COVIX 2026년 200억 매출달성 성과관리 대시보드`
   - Framework: Next.js (자동 감지)
   - Build Command: `npm run build` (자동)

2. **환경 변수** (선택사항):
   - `NEXT_PUBLIC_GEMINI_API_KEY` 추가

3. **Deploy** 클릭!

## 빠른 GitHub 푸시 (저장소가 없다면)

```bash
# 1. GitHub에서 새 저장소 생성 (웹사이트에서)
# 2. 로컬에서 실행:
git remote add origin https://github.com/hongik423/[저장소명].git
git branch -M main
git push -u origin main
```

그 다음 Vercel에서 해당 저장소를 Import하세요!


