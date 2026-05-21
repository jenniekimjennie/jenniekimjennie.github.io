# 갤러리 프로젝트 구조 변경 계획

## 목적
카테고리 > 프로젝트 > 컨텐츠 구조 구현
- 3열 그리드에 프로젝트 대표 썸네일 표시
- 클릭 → 라이트박스에서 전체 이미지 세로 스크롤로 열람

## 변경 파일
- `index.html` — gallery-item 구조
- `js/gallery.js` — 다중 이미지 라이트박스 로직
- `css/gallery.css` — 라이트박스 스크롤 스타일

## HTML 구조
```html
<div class="gallery-item"
     data-title="프로젝트 이름"
     data-images='["assets/images/p1-1.jpg","assets/images/p1-2.jpg"]'>
  <img src="assets/images/p1-cover.jpg" alt="프로젝트 이름">
  <div class="overlay"><span>프로젝트 이름</span></div>
</div>
```
- 이미지 미준비: `data-images='[]'`, 썸네일 없이 빈 슬롯

## 반영 사항
- JSON 파싱 try-catch 예외처리
- 동적 img에 `loading="lazy"` 추가
- 닫기 버튼은 스크롤 컨테이너 바깥 fixed 고정
