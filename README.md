# 작물유전체육종학 연구실 홈페이지

충남대학교 연구실 소개자료를 바탕으로 만든 GitHub Pages용 정적 홈페이지입니다.
별도 빌드·서버·프로그램 설치가 필요 없습니다.

## 처음 시작하기

1. ZIP 압축을 풉니다.
2. `index.html`을 열어 홈페이지를 볼 수 있습니다. 글꼴을 불러오려면 인터넷 연결이 필요하며, 연결이 없어도 기본 글꼴로 표시됩니다.
3. 자세한 한국어 설명은 `guide.html`을 열어 확인합니다.
4. 로컬 파일을 직접 열 때 브라우저별 저장공간 정책으로 편집기와 미리보기 연결이 제한될 수 있습니다. 온라인 편집 화면을 권장합니다.

## GitHub Pages로 공개하기

1. github.com 가입 → New repository → 이름 `lab-website` → Public → Create repository.
2. Upload files에서 **ZIP을 푼 내용물 전체**를 올립니다. ZIP 파일 자체나 바깥 폴더를 올리지 않습니다.
3. 저장소 첫 화면에서 `index.html`, `data.js`, `assets/`가 직접 보여야 합니다.
4. Commit changes로 저장합니다.
5. Settings → Pages → Source: Deploy from a branch.
6. Branch: main, 폴더: /(root) → Save.
7. 배포 후 Pages 설정의 Visit site로 확인합니다.

주소 예시: `https://내아이디.github.io/lab-website/`
교수님 페이지: `https://내아이디.github.io/lab-website/professor.html`

## 글·사진·약력 수정하기

1. 홈페이지 하단의 ‘콘텐츠 편집’ 또는 `editor.html`을 엽니다.
2. 입력칸에서 수정하고 미리보기로 확인합니다.
3. ‘배포용 data.js’를 내려받습니다.
4. GitHub 저장소의 `data.js`와 같은 위치·같은 이름으로 업로드하고 Commit changes를 누릅니다.
5. 배포가 끝나면 새로고침합니다.

사진을 편집기에서 선택하면 사진 데이터가 data.js 안에 포함됩니다.
사진은 1 MB 이하를 권장합니다. 너무 큰 사진은 브라우저 임시 저장 한도를 넘길 수 있습니다.
전체 사이트 ZIP은 온라인 편집 화면에서 받을 수 있습니다.
‘백업 저장’은 수정 데이터를 JSON으로 보관하며 ‘백업 불러오기’로 복원할 수 있습니다.

편집 내용은 현재 브라우저에만 임시 저장됩니다. 편집 화면은 서버를 바꾸지 않으며 GitHub 쓰기 권한을 대신하지 않습니다.
방문자의 편집이 공개 홈페이지를 바꾸지 않습니다. GitHub 저장소에 파일을 올릴 권한이 있어야 실제 배포됩니다.

## 파일 구성

- index.html: 첫 화면
- research.html: 연구분야·소개자료
- professor.html: 교수님 소개·약력·인쇄
- contact.html: 연락처·위치 검색
- data.js: 모든 페이지의 콘텐츠 데이터
- editor.html / editor.js / editor.css: 콘텐츠 편집 도구
- styles.css: 홈페이지 디자인과 모바일 레이아웃
- app.js: 페이지 구성과 이미지 보기·연구분야 필터
- package-files.js: 편집기의 ZIP 내보내기에 포함되는 파일 목록
- assets/: 첨부 자료에서 추출한 연구 이미지와 교수님 사진
- guide.html: 처음 사용자를 위한 상세 설명
- .nojekyll: Jekyll 처리를 생략하는 GitHub Pages 설정

## 디자인 수정

글과 사진, 연구 항목과 약력, 연락처, 포인트 색상은 편집기에서 바꿀 수 있습니다.
큰 구조·배치·글꼴은 styles.css / app.js / HTML을 수정하거나 제작 대화에서 변경을 요청하세요.
모든 링크와 파일 경로는 GitHub 프로젝트 저장소의 하위 경로에서도 작동하도록 상대 경로로 구성했습니다.

## 자료 기준

첨부된 ‘연구실 소개 탬플릿_v6.pptx’와 연구실 포스터 사진을 바탕으로 작성했습니다.
교수님 직급과 주요활동은 제공 자료의 시점과 현재가 다를 수 있으므로 공개 전에 확인해 주세요.
자료에 없는 구성원·논문 목록·수상 실적·주소는 추가하지 않았습니다.

## GitHub 공식 문서

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

