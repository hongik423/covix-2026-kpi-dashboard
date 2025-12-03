# Vercel 배포 오류 수정 가이드

## 오류 원인
"The provided GitHub repository does not contain the requested branch or commit reference"

이 오류는 GitHub 저장소가 비어있거나, 코드가 푸시되지 않았을 때 발생합니다.

## 해결 방법

### ✅ 완료된 작업
- ✅ 브랜치를 `main`으로 변경 완료
- ✅ 모든 코드 커밋 완료
- ✅ 빌드 성공 확인

### 🔧 다음 단계: GitHub에 푸시

**1. GitHub에서 새 저장소 생성** (아직 안 했다면):
- [https://github.com/new](https://github.com/new) 접속
- Repository name: `covix-2026-kpi-dashboard` (또는 원하는 이름)
- **중요**: "Initialize this repository with a README" 체크하지 마세요!
- "Create repository" 클릭

**2. 저장소 URL 확인 후 아래 명령어 실행**:

```bash
# GitHub 저장소 URL 추가 (실제 URL로 변경하세요)
git remote add origin https://github.com/hongik423/[저장소명].git

# GitHub에 푸시
git push -u origin main
```

**3. 푸시 확인**:
- GitHub 저장소 페이지에서 파일들이 보이는지 확인
- README.md, package.json, app/ 폴더 등이 모두 보여야 함

**4. Vercel에서 다시 Import**:
- Vercel 대시보드로 돌아가기
- "Import Git Repository"에서 방금 푸시한 저장소 찾기
- "Import" 클릭
- 프로젝트 설정 확인 후 "Deploy"

## 빠른 체크리스트

- [ ] GitHub 저장소 생성 완료
- [ ] `git remote add origin` 실행 완료
- [ ] `git push -u origin main` 실행 완료
- [ ] GitHub에서 파일 확인 완료
- [ ] Vercel에서 Import 완료

## 문제가 계속되면

1. GitHub 저장소가 비어있는지 확인
2. 브랜치 이름이 `main`인지 확인 (`git branch`로 확인)
3. 커밋이 있는지 확인 (`git log`로 확인)
4. 원격 저장소가 올바른지 확인 (`git remote -v`로 확인)


