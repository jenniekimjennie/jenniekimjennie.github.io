# 모듈 구조 및 기능 설명

이 문서는 포트폴리오 프로젝트의 파일 구조와 각 모듈의 역할을 설명합니다.

---

## 전체 파일 구조

```
portfolio/
├── CLAUDE.md               # Claude 협업 규칙
├── index.html              # 메인 HTML — 모든 섹션의 뼈대
├── docs/
│   ├── modules.md          # 이 문서 — 모듈 구조 설명
│   ├── conventions.md      # 파일 명명 규칙 및 에셋 관리
│   └── projects.md         # 프로젝트별 툴 정보 (source of truth)
├── css/
│   ├── base.css            # 전역 변수, 리셋, 공통 스타일
│   ├── layout.css          # 네비게이션, 섹션 공통 레이아웃
│   ├── hero.css            # Hero 섹션 스타일
│   ├── about.css           # About 섹션 스타일
│   ├── gallery.css         # 캐러셀, 라이트박스 스타일
│   └── contact.css         # Contact 섹션 스타일
├── js/
│   ├── nav.js              # 네비게이션 동작
│   ├── gallery.js          # 캐러셀 + 라이트박스 + 줌
│   └── animations.js       # 스크롤 페이드인 애니메이션
└── assets/
    ├── clothing/           # SAMPLING 섹션 에셋
    └── 3d work/            # 3D WORK 섹션 에셋
```

---

## 페이지 섹션 구조

| 섹션 | ID | 주요 특징 |
|------|----|-----------|
| Hero | `#hero` | 전체화면, 중앙 배치, VIEW MY WORK 버튼 |
| Sampling | `#gallery-sampling` | 캐러셀, 점 네비게이션, 라이트박스 |
| 3D Work | `#gallery-3dwork` | 캐러셀, 점 네비게이션, 라이트박스 |
| AI | `#gallery-ai` | 캐러셀 (현재 비어있음) |
| About | `#about` | bio + 툴뱃지 + EXPERIENCE/EDUCATION/AWARDS |
| Contact | `#contact` | 이메일 + 전화번호 |

---

## CSS 모듈

### `base.css`
- CSS 커스텀 프로퍼티(변수) 정의: 색상, 폰트, 간격
- 브라우저 기본 스타일 리셋
- **색상/폰트 변경은 여기서**

### `layout.css`
- 상단 고정 네비게이션 바 레이아웃
- 섹션 공통 padding/margin

### `hero.css`
- Hero 섹션 전체화면 레이아웃
- 이름, 직함 타이포그래피, CTA 버튼

### `about.css`
- 툴 뱃지 스타일
- EXPERIENCE / EDUCATION / AWARDS 3컬럼 레이아웃

### `gallery.css`
- 캐러셀 (화살표 버튼 + 유한 슬라이드, 시작/끝에서 화살표 비활성)
- 점 네비게이션 (항목 수만큼 dot, 현재 보이는 항목 활성 표시)
- 썸네일 카드 hover 효과
- 라이트박스 (풀스크린 오버레이 + 세로 스크롤)
- 그리드 레이아웃 (`_c숫자` suffix 기반 행/열 배치)
- 그룹 카드 + 그룹 줌 (`.group-card` / `.group-zoom-grid`, 셀 3:4 비율)
- hover-pair (fullshot/closeup 클릭 시 나란히 줌)
- AI 레이아웃 (`.ai-layout` — 좌 AI / 우 소스 컬럼, 다른 갤러리와 분리)
- 줌 오버레이 (라이트박스 내 이미지/영상 클릭 시 전체화면)

> **이미지 표시 규칙(잘림·비율·힌트·AI 레이아웃)은 `docs/lightbox-image-rules.md` 필독.**
> 라이트박스/줌 작업은 `/gallery` 스킬로 시작하면 규칙을 자동 로드한다.

### `contact.css`
- 이메일, 전화번호 버튼 스타일

---

## JS 모듈

### `nav.js`
- 스크롤 시 nav 배경 전환 (투명 → 배경색)

### `gallery.js`
- **캐러셀**: 화살표/점 클릭으로 슬라이드. 유한(시작/끝 비활성). 3개씩 표시
- **빈 항목 제거**: `data-images`가 빈 배열이면 자동 제거, 섹션 전체 숨김
- **라이트박스**: 카드 클릭 → 이미지/영상 풀스크린 오버레이
- **그리드 레이아웃**: `_c숫자` 파일명 감지 시 행 그룹 + 열 너비 자동 적용
  - 행 배치(`.grid-row`, 중앙 정렬): **연속된 c2 그룹들은 한 행에 카드로 나란히**(각 `calc(30% - 6px)`, 3개 ≈ 90% 폭), 3장 그룹은 단독 90%, 그 외는 단독 100%.
  - c2 카드는 **목록엔 Front 한 장만**(`group-card-inner--1`, 자연 비율·contain·잘림 없음), 클릭 시 줌에는 **Front+Back 전체**를 표시. (`makeGroupCard`의 `displaySrcs` 인자로 표시용 일부만 렌더, 줌엔 그룹 전체 전달)
  - **모바일(≤768px)**: 목록은 단일 아이템 그룹=대표 1장만(`.gc-alt` 숨김), 다중 아이템 그룹(`isMultiItemGroup`)=전부 세로 스택. 줌은 1열 세로 스택 + contain. 컬럼 수는 CSS `--N` 클래스로 두고 모바일 `1fr`로 덮음(인라인 금지). 데스크탑 현행 유지.
- **hover-pair**: `_fullshot_`/`_closeup_` 파일명 감지 시 자동 페어링
- **레이블**: `data-captions` 속성으로 이미지 하단 텍스트 표시
- **줌**: 라이트박스 내 이미지/영상 클릭 → 전체화면 확대 (영상은 사운드 재생)
- **TOOL 표시**: 라이트박스 하단에 사용 툴 뱃지 출력

### `animations.js`
- IntersectionObserver 기반 스크롤 페이드인

---

## 갤러리 카드 HTML 구조

```html
<div class="gallery-item"
     data-title="프로젝트 제목"
     data-tools="Tool A, Tool B"
     data-images='["assets/sampling/프로젝트/00_front.png", ...]'
     data-captions='{"파일명.png":"LABEL"}'>
  <img src="assets/sampling/프로젝트/thumbnail.png" alt="프로젝트 제목">
  <div class="overlay"><span>프로젝트 제목</span></div>
</div>
```

- `data-title`: 라이트박스 상단 제목
- `data-tools`: 콤마 구분 툴 목록 → 라이트박스 하단 뱃지
- `data-images`: 라이트박스 이미지/영상 경로 (JSON 배열, 순서대로 표시)
- `data-captions`: 파일명별 하단 레이블 (선택사항)
- `img src`: 갤러리 카드 썸네일 → `thumbnail.png` 사용

파일 명명 규칙은 `docs/conventions.md` 참고.

---

## 색상 변경

`css/base.css` 상단 `:root` 블록에서 변경:

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
