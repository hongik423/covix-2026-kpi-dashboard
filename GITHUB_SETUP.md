# GitHub 저장소 설정 및 Vercel 배포 가이드

## 문제 해결: Vercel 배포 오류

오류 원인: GitHub 저장소가 비어있거나 브랜치가 없음

## 해결 방법

### 1단계: GitHub에 새 저장소 생성

1. [https://github.com/new](https://github.com/new) 접속
2. Repository name 입력: `covix-2026-kpi-dashboard` (또는 원하는 이름)
3. Public 또는 Private 선택
4. **중요**: "Initialize this repository with a README" 체크박스는 **체크하지 마세요** (이미 코드가 있으므로)
5. "Create repository" 클릭

### 2단계: 로컬에서 GitHub에 푸시

아래 명령어를 실행하세요 (저장소 URL을 실제 URL로 변경):

```bash
# GitHub 저장소 URL 추가
git remote add origin https://github.com/hongik423/[저장소명].git

# main 브랜치로 변경 (이미 완료됨)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 3단계: Vercel에서 다시 Import

1. Vercel 대시보드로 돌아가기
2. "Import Git Repository" 섹션에서 방금 만든 저장소 찾기
3. "Import" 클릭
4. 프로젝트 설정 확인:
   - Project Name: `COVIX 2026년 200억 매출달성 성과관리 대시보드`
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. "Deploy" 클릭

## 빠른 명령어 (저장소 URL만 변경하면 됨)

```bash
git remote add origin https://github.com/hongik423/[저장소명].git
git push -u origin main
```

## 확인 사항

푸시 후 GitHub 저장소에 다음이 보여야 합니다:
- ✅ 모든 파일이 보임
- ✅ README.md 파일
- ✅ package.json 파일
- ✅ app/ 폴더
- ✅ 커밋 히스토리

이제 Vercel에서 Import하면 정상적으로 작동합니다!

