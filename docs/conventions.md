# 파일 명명 규칙 및 에셋 관리

이 문서는 포트폴리오 에셋 파일을 추가하거나 수정할 때 따라야 할 규칙을 정의합니다.

---

## 폴더 구조

```
assets/
├── clothing/               ← SAMPLING 섹션 에셋
│   ├── 01_newbalance_sample_work/
│   ├── 02_garment_sample_work/
│   └── 03_fabric_sample_work/
└── 3d work/                ← 3D WORK 섹션 에셋
    ├── 01_robotics/
    ├── 02_procedural animation/
    ├── 03_portfolio_garment/
    ├── 04_hello world/
    ├── 05_alessi/
    └── 06_AI to 3D/
```

카테고리: `clothing(sampling)` / `3d work`
프로젝트 폴더명은 번호 prefix + 소문자 + 언더스코어로 작성.
번호 순서가 갤러리 표시 순서가 됨 (index.html에서 수동 반영 필요).

---

## 파일 명명 규칙

### 1. 순서 prefix — 라이트박스 표시 순서 지정

파일명 앞에 두 자리 숫자를 붙여 순서를 지정합니다.

```
00_front.png     ← 첫 번째 표시
01_back.png      ← 두 번째 표시
02_detail.png    ← 세 번째 표시
```

숫자 없는 파일은 유지하되, 순서가 중요한 경우 반드시 prefix 사용.

---

### 2. 라이트박스 그리드 레이아웃 — 행 그룹 + 열 너비 지정

파일명에 두 가지 규칙을 조합해 라이트박스 레이아웃을 제어합니다.

---

#### 2-1. 행 그룹 — 파일명 맨 앞 숫자 prefix

같은 숫자로 시작하는 파일들은 하나의 행 그룹으로 묶입니다.
숫자 오름차순으로 정렬되어 표시됩니다.

```
01_*  →  첫 번째 행 그룹
02_*  →  두 번째 행 그룹
03_*  →  세 번째 행 그룹
```

---

#### 2-2. 열 너비 suffix — `_c숫자`

파일명 끝(확장자 앞)에 `_c숫자`를 붙여 이미지 너비를 지정합니다.

| Suffix | 너비 | 한 줄에 들어가는 수 |
|--------|------|-------------------|
| `_c1`  | 100% | 1개 |
| `_c2`  | 50%  | 2개 |
| `_c3`  | 33%  | 3개 |
| `_c4`  | 25%  | 4개 |

suffix 없음 → 기본값 `_c1` (전체 너비)

---

#### 2-3. 자동 줄바꿈

한 행 그룹 안에 이미지가 한 줄 분량을 초과하면 자동으로 다음 줄로 넘어갑니다.

예) 그룹 `01`에 `_c3` 이미지 6장 → 3개 × 2줄 자동 배치

---

#### 2-4. 동작 예시

```
01_sewing_c2.png              → 행 그룹 1, 절반 너비 (가운데 정렬)

02_A_black_01_c4.png          → 행 그룹 2, 4개씩 한 줄
02_A_black_02_c4.png
02_A_black_03_c4.png
02_A_black_04_c4.png

03_1_fullshot_c3.png          → 행 그룹 3, 3개씩 한 줄 (6장이면 2줄)
03_1_closeup_c3.png
03_2_fullshot_c3.png
03_2_closeup_c3.png
03_3_fullshot_c3.png
03_3_closeup_c3.png
```

---

**주의:** `_c숫자` suffix가 하나라도 있으면 해당 프로젝트는 그리드 레이아웃으로 전환됩니다.
suffix가 전혀 없으면 기존 방식(이미지 세로 스크롤)으로 표시됩니다.

---

### 3. Hover 페어 — fullshot / closeup 자동 연결

파일명에 `_fullshot_` 또는 `_closeup_` 키워드가 포함되면 자동으로 hover 페어로 동작합니다.

**동작 방식:**
- 라이트박스에는 `_fullshot_` 이미지만 표시됨
- 마우스 hover 시 fullshot 이미지 살짝 확대 강조
- 클릭 시 줌 오버레이에 fullshot + closeup 두 장을 나란히 표시

**페어링 조건:**
- 같은 행 그룹(동일 prefix 숫자) 안에 있어야 함
- 파일명에서 `_fullshot_` ↔ `_closeup_` 만 다르고 나머지는 동일해야 함

```
01_1_fullshot_c3.png  ←→  01_1_closeup_c3.png   (자동 페어)
01_2_fullshot_c3.png  ←→  01_2_closeup_c3.png   (자동 페어)
```

페어가 없는 `_fullshot_` 또는 `_closeup_` 파일은 단독 이미지로 일반 표시됩니다.

---

### 4. 레이블 — data-captions

라이트박스 이미지 하단에 텍스트 레이블을 표시하려면 gallery-item에 `data-captions` 속성을 추가합니다.

```html
data-captions='{"파일명.png":"LABEL", "파일명2.mp4":"LABEL2"}'
```

파일명(확장자 포함)을 키로, 표시할 텍스트를 값으로 지정합니다.

---

### 5. 썸네일 — 갤러리 카드 대표 이미지

각 프로젝트 폴더에 `thumbnail.png` 파일을 넣으면 갤러리 카드의 대표 이미지로 사용됩니다.

---

### 6. 영상 파일

이미지와 동일한 순서 prefix 규칙 적용. 확장자: `.mp4` 권장.
라이트박스에서 자동재생 + 반복재생 (음소거).
클릭(줌 오버레이)에서는 사운드 재생 가능.

---

## projects.md 관리

각 프로젝트의 사용 툴은 `docs/projects.md`에서 관리합니다.
수정 후 Claude에게 "projects.md 반영해줘"라고 하면 `index.html`에 자동 업데이트됩니다.

---

## 새 프로젝트 추가 체크리스트

1. `assets/카테고리/프로젝트명/` 폴더 생성
2. `thumbnail.png` 추가
3. 이미지/영상 파일 추가 (순서 prefix + 열 suffix 적용)
4. `docs/projects.md`에 툴 정보 추가
5. Claude에게 "projects.md 반영해줘" 요청
