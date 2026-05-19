# 모듈 구조 및 기능 설명

이 문서는 포트폴리오 프로젝트의 파일 구조와 각 모듈의 역할을 설명합니다.

---

## 전체 파일 구조

```
portfolio/
├── CLAUDE.md               # 작업 규칙 문서
├── index.html              # 메인 HTML — 모든 섹션의 뼈대
├── docs/
│   └── modules.md          # 이 문서 — 모듈 구조 설명
├── css/
│   ├── base.css            # 전역 변수, 리셋, 공통 스타일
│   ├── layout.css          # 네비게이션, 섹션 공통 레이아웃
│   ├── hero.css            # Hero 섹션 스타일
│   ├── about.css           # About 섹션 스타일
│   ├── gallery.css         # Gallery 섹션 스타일 (탭 필터, 그리드, 라이트박스)
│   └── contact.css         # Contact 섹션 스타일
├── js/
│   ├── nav.js              # 네비게이션 동작
│   ├── gallery.js          # 갤러리 필터링 + 라이트박스
│   └── animations.js       # 스크롤 애니메이션
└── assets/
    ├── images/             # 작품 이미지 파일 (사용자가 직접 추가)
    └── videos/             # 작품 영상 파일 (사용자가 직접 추가)
```

---

## CSS 모듈

### `base.css`
- CSS 커스텀 프로퍼티(변수) 정의: 색상, 폰트, 간격
- 브라우저 기본 스타일 리셋
- body, 공통 타이포그래피 설정
- **여기서 색상/폰트를 바꾸면 전체 사이트에 반영됨**

### `layout.css`
- 상단 고정 네비게이션 바 레이아웃
- 섹션 공통 padding/margin
- 반응형 그리드 컨테이너

### `hero.css`
- Hero 섹션 전체화면 레이아웃
- 이름(SEOK HUH), 직함 타이포그래피
- CTA 버튼 스타일
- fade-in 진입 애니메이션

### `about.css`
- 툴 뱃지(Blender, CLO3D 등) 스타일
- 소개 텍스트 레이아웃

### `gallery.css`
- CLOTHING / 3D ART / AI 탭 필터 버튼 스타일
- 이미지 그리드 레이아웃 (3열)
- 이미지 hover overlay 효과
- 라이트박스 팝업 스타일

### `contact.css`
- 이메일 버튼, SNS 아이콘 스타일
- Contact 섹션 레이아웃

---

## JS 모듈

### `nav.js`
- **역할**: 네비게이션 바 동작 제어
- 스크롤 시 배경 전환 (투명 → 흰색 + 그림자)
- 메뉴 클릭 시 해당 섹션으로 부드럽게 스크롤

### `gallery.js`
- **역할**: 갤러리 필터링 및 라이트박스
- 탭 클릭 시 해당 카테고리 작품만 표시 (data-category 속성 기반)
- 이미지 클릭 시 라이트박스 열기/닫기
- 영상 클릭 시 라이트박스 내 재생

### `animations.js`
- **역할**: 스크롤 기반 페이드인 애니메이션
- IntersectionObserver로 화면에 들어오는 요소에 `visible` 클래스 추가
- CSS transition과 연동

---

## 갤러리 작품 추가 방법

1. `assets/images/` 또는 `assets/videos/` 폴더에 파일 추가
2. `index.html`의 갤러리 섹션에 아래 형식으로 항목 추가:

```html
<!-- 이미지 작품 -->
<div class="gallery-item" data-category="clothing">
  <img src="assets/images/파일명.jpg" alt="작품 설명">
  <div class="overlay"><span>작품 제목</span></div>
</div>

<!-- 영상 작품 -->
<div class="gallery-item" data-category="3dart">
  <video src="assets/videos/파일명.mp4" poster="assets/images/썸네일.jpg"></video>
  <div class="overlay"><span>작품 제목</span></div>
</div>
```

카테고리 값: `clothing` / `3dart` / `ai`

---

## 색상 변경 방법

`css/base.css` 상단의 `:root` 블록에서 변경:

```css
:root {
  --color-bg: #FFFFFF;
  --color-bg-alt: #F7F7F7;
  --color-text: #111111;
  --color-text-muted: #666666;
  --color-border: #E5E5E5;
  --font-main: 'Outfit', sans-serif;
}
```
