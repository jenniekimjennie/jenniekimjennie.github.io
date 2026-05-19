# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 작업 규칙 (CLAUDE.md)

이 문서는 포트폴리오 프로젝트에서 Claude와 협업할 때 반드시 지켜야 할 규칙을 정의합니다.

---

## 1. 파일 생성 및 수정 금지 (무단)
- 사용자의 명시적 동의 없이 파일을 생성하거나 수정하지 않는다.
- 모든 파일 변경은 사전에 내용을 설명하고 승인을 받은 후 진행한다.

## 2. 계획 수립 및 확인
- 간단한 작업(오타 수정 등)을 제외한 모든 작업은 사전에 계획을 수립한다.
- 계획은 사용자에게 공유하고 승인받은 후 구현을 시작한다.
- 계획 변경이 필요한 경우에도 동일하게 확인을 받는다.

## 3. 모듈식 구성 및 문서화
- 각 기능은 독립적인 모듈로 구성한다 (CSS/JS 파일 분리).
- 새로운 모듈을 추가하거나 변경할 경우 `docs/modules.md`를 함께 업데이트한다.
- 모듈의 역할과 구조는 항상 문서로 설명되어야 한다.

## 4. 의문점은 반드시 질문
- 요구사항이 불명확하거나 판단이 필요한 경우, 임의로 결정하지 않고 사용자에게 질문한다.
- 작은 결정이라도 사용자의 의도와 다를 수 있으므로 확인 후 진행한다.

---

## 협업 방식

1. Claude가 계획 수립
2. 사용자 + Gemini가 계획 검토 및 피드백
3. 피드백 반영 후 Claude가 계획 수정
4. 사용자 최종 승인 → 구현 시작

---

## 프로젝트 개요

- **목적**: 3D Technical Designer 채용 지원용 포트폴리오
- **대상**: 의류/아웃도어 분야 채용 담당자
- **기술**: HTML5 + CSS3 + Vanilla JS (빌드 도구 없음)
- **언어**: 영문 (SEOK HUH 브랜딩)
- **배포**: GitHub Pages — `seokhuh.github.io`
- **브라우저에서 직접 열거나 GitHub Pages로 확인** (로컬 서버 불필요)

---

## 아키텍처

빌드 도구 없는 순수 정적 사이트. `index.html` 하나가 진입점이며 CSS/JS는 각각 분리된 파일로 연결.

```
portfolio/
├── index.html          # 진입점 — 모든 섹션 포함
├── css/
│   ├── base.css        # CSS 변수(:root), 리셋. 색상/폰트 변경은 여기서
│   ├── layout.css      # 네비게이션, 섹션 공통 레이아웃
│   ├── hero.css
│   ├── gallery.css     # 탭 없음, 카테고리별 독립 섹션 + 라이트박스
│   ├── about.css
│   └── contact.css
├── js/
│   ├── nav.js          # 스크롤 시 nav 배경 전환
│   ├── gallery.js      # 라이트박스 (클릭 → 풀스크린 오버레이)
│   └── animations.js   # IntersectionObserver 기반 fade-in
└── assets/
    ├── images/         # 작품 이미지 (사용자가 직접 추가)
    └── videos/         # 작품 영상 (사용자가 직접 추가)
```

## 페이지 구조 (확정)

| 섹션 | ID | 주요 특징 |
|------|----|-----------|
| Hero | `#hero` | 80vh, 중앙 배치, VIEW MY WORK 버튼 |
| Gallery | `#gallery-clothing` / `#gallery-3dart` / `#gallery-ai` | 탭 없음, 각 카테고리 독립 섹션, 3열 그리드, 라이트박스 |
| About | `#about` | 사진 없음, bio + 툴뱃지(가로) + EXPERIENCE/EDUCATION/AWARDS(3컬럼), max-width 1100px |
| Contact | `#contact` | 이메일 + 전화번호 (고정 너비 320px), SNS 아이콘 없음 |

## 갤러리 작품 추가

`assets/images/` 또는 `assets/videos/`에 파일 추가 후 `index.html` 갤러리 섹션에 아래 형식으로 추가:

```html
<div class="gallery-item" data-category="clothing">
  <img src="assets/images/파일명.jpg" alt="작품 설명">
  <div class="overlay"><span>작품 제목</span></div>
</div>
```

카테고리 값: `clothing` / `3dart` / `ai`
