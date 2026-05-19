# 프로젝트 컨텍스트

이 문서는 새 세션에서 Claude가 빠르게 컨텍스트를 파악하기 위한 문서입니다.

---

## 프로젝트 목적

**SEOK HUH**의 3D Technical Designer 채용 지원용 포트폴리오 웹사이트.
대상: 의류/아웃도어 분야 채용 담당자 (Columbia, Timberland 등 브랜드 협업 회사).

---

## 현재 진행 상태

- [x] CLAUDE.md 작업 규칙 문서 생성
- [x] docs/modules.md 모듈 구조 문서 생성
- [x] wireframe.html 와이어프레임 생성
- [ ] 사용자 와이어프레임 검토 및 피드백
- [ ] 실제 구현 (index.html, css/, js/)

---

## 확정된 디자인 결정사항

| 항목 | 결정 |
|------|------|
| 이름 | SEOK HUH |
| 직함 | 3D Technical Designer |
| 스타일 | 라이트 & 클린 (흰색 기반) |
| 레이아웃 | 일반 스크롤 |
| 네비게이션 | 상단 고정 |
| 갤러리 탭 | CLOTHING / 3D ART / AI |
| 갤러리 레이아웃 | 3열 균등 그리드 |
| 기술 스택 | HTML5 + CSS3 + Vanilla JS |

---

## 섹션 순서

1. **Hero** — 이름 + 직함 + "VIEW MY WORK" 버튼
2. **Gallery** — CLOTHING / 3D ART / AI 탭 필터 + 3열 그리드 + 라이트박스
3. **About** — 프로필 사진 + 소개 + 툴 뱃지
4. **Contact** — 이메일 버튼 + SNS 아이콘

---

## 사용 툴 (About 섹션 뱃지)

- **3D**: Blender, CLO3D, Marvelous Designer, DAZ3D
- **IMAGE**: Photoshop, Illustrator, Substance Painter
- **VIDEO**: Premiere Pro, After Effects
- **AI**: Claude Code, Antigravity, ChatGPT, Gemini, Flux

---

## 작업 규칙 요약

1. 파일 무단 생성/수정 금지 — 항상 승인 후 진행
2. 계획 수립 → 사용자+Gemini 검토 → 승인 → 구현
3. 모듈식 구성, docs/modules.md 항상 최신 유지
4. 의문점은 임의 판단 말고 사용자에게 질문

---

## 새 세션 시작 방법

```bash
cd ~/Desktop/portfolio
claude
```
