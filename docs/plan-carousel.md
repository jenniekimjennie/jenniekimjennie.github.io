# 갤러리 캐러셀 레이아웃 계획 (Gemini 피드백 반영)

## 목적
현재 갤러리 그리드를 Vitra 뮤지엄 스타일의 centered carousel로 변경.
선택한 카드가 가운데로 이동하며 확대되는 방식.

---

## 동작 정의

1. 기본 상태: 첫 번째 카드가 가운데 + 크게 표시, 나머지는 흑백 + 축소
2. 비활성 카드 클릭 → 가운데로 슬라이드 + 확대 + 컬러, 기존 카드는 축소 + 흑백
3. 활성(가운데) 카드 클릭 → 라이트박스로 해당 프로젝트 전체 이미지 열람

---

## 변경 파일

- `css/gallery.css` — 캐러셀 레이아웃
- `js/gallery.js` — 클릭 로직 (활성화 + 스크롤 + 라이트박스)
- `index.html` — 첫 번째 gallery-item에 `class="gallery-item active"` 추가

---

## CSS

```css
.gallery-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  align-items: center;
  padding: 24px calc(50% - 300px) 40px;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.gallery-grid::-webkit-scrollbar { display: none; }

.gallery-item {
  flex: 0 0 200px;
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--color-bg-alt);
  opacity: 0.7;
  filter: grayscale(80%);
  transition: flex-basis 0.4s cubic-bezier(0.25, 1, 0.5, 1),
              opacity 0.3s ease,
              filter 0.3s ease;
}

.gallery-item.active {
  flex: 0 0 600px;
  opacity: 1;
  filter: grayscale(0%);
}

/* 모바일 */
@media (max-width: 768px) {
  .gallery-item { flex: 0 0 30vw; }
  .gallery-item.active { flex: 0 0 85vw; }
  .gallery-grid { padding: 24px calc(50% - 42.5vw) 40px; }
}
```

---

## JS

```javascript
// 캐러셀 활성화 + 중앙 스크롤
function activateItem(item) {
  const container = item.parentElement;
  container.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');
  const scrollTarget = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
  container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
}

// 초기 로드 시 첫 카드 중앙 정렬
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-grid').forEach(grid => {
    const active = grid.querySelector('.gallery-item.active');
    if (active) {
      const scrollTarget = active.offsetLeft - (grid.offsetWidth / 2) + (active.offsetWidth / 2);
      grid.scrollTo({ left: scrollTarget, behavior: 'instant' });
    }
  });
});

// 클릭 핸들러
item.addEventListener('click', () => {
  if (item.classList.contains('active')) {
    // 라이트박스 열기
  } else {
    activateItem(item);
  }
});
```
