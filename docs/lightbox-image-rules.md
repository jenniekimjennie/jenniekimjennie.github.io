# 라이트박스 / 줌 이미지 표시 규칙 (필독)

이 문서는 라이트박스·줌·갤러리 카드에서 **이미지를 어떻게 표시할지**에 대한 확정 규칙과,
과거에 반복해서 발생한 실수를 정리한 것입니다. 갤러리/라이트박스 관련 작업 전 반드시 읽습니다.

관련 파일: `js/gallery.js`, `css/gallery.css`
파일 명명 규칙: `docs/conventions.md`

---

## 0. 작업 태도 (가장 중요)

- **요청하지 않은 UI/요소를 임의로 추가하지 않는다.** (예: "AI OUTPUT / SOURCE" 같은 레이블을 시키지 않았는데 달기 → 금지)
- **무엇을 바꿀지 먼저 한 줄로 설명하고 진행한다.** 길게 고민하며 침묵하지 않는다.
- 한 곳을 고치면서 **다른 갤러리/줌 뷰를 건드리지 않는다.** 공유 규칙 수정 시 영향 범위를 먼저 확인한다.
- "다 똑바로 해라" 류의 피드백이 반복되면 → 추측으로 더 고치지 말고, 이 문서의 규칙을 그대로 적용한다.

---

## 1. 이미지 잘림 금지 — `object-fit: contain`

- 라이트박스·줌의 모든 이미지는 **`object-fit: contain`** 을 기본으로 한다.
- **`object-fit: cover` 금지.** cover는 비율이 다른 이미지(측면 뷰 등)에서 머리/끝이 잘린다.
  사용자가 반복적으로 가장 싫어한 문제.
- 채워 보이게 하고 싶을 때도 cover 대신 **컨테이너 비율을 맞추는 방식**으로 해결한다 (아래 2번).

---

## 2. 셀(컨테이너) 비율 — 3:4 유지

- 여러 장을 한 행에 배치하는 그룹(특히 `_c4` = 4장 행)의 줌 셀은 **`aspect-ratio: 3 / 4`** 컨테이너를 유지한다.
- 셀을 동일한 3:4 박스로 두고 이미지를 `contain` 하면 → 모든 이미지가 **같은 크기**로 보이고 잘리지도 않는다.
- 줌 그리드에 `height: 75vh` 같은 고정 높이를 주고 `height:100% + cover`로 채우면 → 비율 깨지고 잘림 발생. **금지.**

```css
/* css/gallery.css — 그룹 줌 셀 */
.group-zoom-grid .media-item { aspect-ratio: 3 / 4; }
.lightbox-zoom-content .group-zoom-grid .media-item img {
  width:100% !important; height:100% !important;
  object-fit: contain !important;       /* cover 금지 */
  object-position: center center !important;
}
```

---

## 3. 줌 뷰 가로폭

- 그룹 줌(`showGroupZoom`) 가로폭은 **90vw** (`js/gallery.js`의 `grid.style.width`).
- CSS `.group-zoom-grid { width: 80vw }` 가 있어도 JS 인라인 값이 우선이므로 **JS에서 변경**한다.

---

## 4. 클릭 힌트 — 공유 오버레이 패턴 (절대 오버라이드 금지)

- "CLICK FOR DETAIL" 힌트는 **공유 `.click-hint` 규칙**을 쓴다. 이 규칙은 `position:absolute; inset:0`
  로 **이미지 컨테이너 전체를 덮는 오버레이**이며, hover 시 어두운 배경 + 중앙 텍스트로 나타난다.
- **작은 박스(`top:50%`, 좁은 padding)로 새로 만들어 덮어쓰지 않는다.** (과거 실수: 힌트가 작게 떠서 깨짐)
- 새 컨테이너에 힌트를 넣을 때는 **새 CSS를 만들지 말고**, 기존 hover 규칙의 셀렉터 목록에 해당 컨테이너만 추가한다:

```css
.media-item:hover .click-hint,
.hover-pair:hover .click-hint,
.ftg-triple:hover .click-hint,
.group-card:hover .click-hint,
.ai-pair-item:hover .click-hint {   /* ← 이렇게 셀렉터만 추가 */
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.35);
}
```

JS에서는 `<div class="click-hint">CLICK FOR DETAIL</div>` 를 컨테이너에 append 하기만 하면 된다.

---

## 5. AI 섹션 레이아웃 — 별도 경로로 작성

- AI 섹션은 다른 갤러리와 표시 방식이 다르므로 **독립된 코드 경로/CSS**로 관리한다.
- 진입 조건: 갤러리 카드에 `data-layout="ai"`.
- 파일명으로 이미지 종류를 분류한다: `_ai_image` = AI 결과물, `_source_image` = 소스.
- 레이아웃: 좌측 컬럼에 AI 이미지, 우측 컬럼에 소스 이미지.
  - **work-1처럼 AI 이미지가 2장**이면 → 좌측에 2장을 상하로 쌓고, 우측 소스는 그 2장 높이만큼.
  - AI 이미지가 1장이면 → 좌측 단독, 우측 소스를 같은 높이로.
- 전용 클래스: `.ai-layout`, `.ai-pair-row`, `.ai-col`, `.ai-pair-item`.
- **AI 쪽이 안정화된 뒤에는 다른 작업 중 건드리지 않는다.**

---

## 6. CSS specificity / flexbox 함정

- **공유 셀렉터 수정 주의:** `.lightbox-scroll:not(.layout-grid)` 처럼 여러 레이아웃이 공유하는 규칙을
  바꿀 때, AI 등 특정 레이아웃을 제외하려면 `:not(.ai-layout)` 같이 **한정자를 추가**해 배제한다.
  (같은 specificity면 나중에 선언된 규칙이 이김 → 의도치 않게 덮어써짐.)
- **flexbox 자식 오버플로우:** `flex:1` 자식이 내용 크기보다 못 줄어 박스를 뚫고 나오면
  → 부모 방향에 맞춰 **`min-width:0` / `min-height:0`** 을 준다.

---

## 7. 체크리스트 (라이트박스/줌 손대기 전)

1. 이미지가 잘리나? → `contain` 인지 확인, `cover` 있으면 의심.
2. 4장 행/그룹 셀이 3:4 비율인가?
3. 힌트는 공유 `.click-hint` 오버레이를 쓰는가? (작은 박스 새로 만들지 않았는가?)
4. 요청하지 않은 레이블/요소를 추가하지 않았는가?
5. AI 레이아웃을 건드리는가? → 별도 경로인지, 다른 갤러리에 영향 없는지.
6. 공유 CSS 규칙을 바꿨다면 → 다른 갤러리 줌 뷰가 깨지지 않는지.
