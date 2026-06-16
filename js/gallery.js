const lightbox = document.querySelector('.lightbox');
const lightboxScroll = document.querySelector('.lightbox-scroll');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxClose = document.querySelector('.lightbox-close');

function addSpinner(wrapper, media) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  wrapper.appendChild(spinner);
  const done = () => {
    spinner.classList.add('done');
    setTimeout(() => spinner.remove(), 300);
  };
  if (media.tagName === 'IMG') {
    if (media.complete && media.naturalWidth > 0) { done(); return; }
    media.addEventListener('load', done, { once: true });
    media.addEventListener('error', done, { once: true });
  } else {
    if (media.readyState >= 2) { done(); return; }
    media.addEventListener('loadeddata', done, { once: true });
    media.addEventListener('error', done, { once: true });
  }
}

function openLightbox(item) {
  let images = [];
  try {
    images = JSON.parse(item.dataset.images || '[]');
  } catch (e) { return; }
  if (images.length === 0) return;

  const title = item.dataset.title || '';
  const hasSoundHint = item.dataset.sound === 'true';
  let captions = {};
  try { captions = JSON.parse(item.dataset.captions || '{}'); } catch (e) {}
  lightboxTitle.textContent = title;
  lightboxScroll.innerHTML = '';

  const mode = item.dataset.mode || '';

  if (mode === 'ftg') {
    lightboxScroll.className = 'lightbox-scroll layout-grid';

    function getBaseKey(src) {
      return src.split('/').pop()
        .replace('_flat', '').replace('_fabric', '')
        .replace(/_c\d+\.\w+$/, '');
    }

    const trioPairs = {};
    images.forEach(src => {
      const key = getBaseKey(src);
      if (!trioPairs[key]) trioPairs[key] = {};
      const filename = src.split('/').pop();
      if (filename.includes('_flat_')) trioPairs[key].flat = src;
      else if (filename.includes('_fabric_')) trioPairs[key].fabric = src;
      else trioPairs[key].tagless = src;
    });

    const rowGroups = {};
    Object.entries(trioPairs).forEach(([key, trio]) => {
      const row = key.match(/^(\d+)/)?.[1] || '0';
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push(trio);
    });

    Object.keys(rowGroups).sort().forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      rowGroups[row].forEach(trio => {
        const wrap = document.createElement('div');
        wrap.className = 'ftg-triple';
        wrap.style.flex = '0 0 calc(33.333% - 5.334px)';
        const flatImg = Object.assign(document.createElement('img'), { src: trio.flat, alt: title, loading: 'eager' });
        flatImg.className = 'ftg-flat';
        const taglessImg = Object.assign(document.createElement('img'), { src: trio.tagless, alt: title, loading: 'eager' });
        taglessImg.className = 'ftg-tagless';
        const ftgHint = document.createElement('div');
        ftgHint.className = 'click-hint';
        ftgHint.textContent = 'CLICK FOR DETAIL';
        wrap.appendChild(flatImg);
        wrap.appendChild(taglessImg);
        wrap.appendChild(ftgHint);
        addSpinner(wrap, flatImg);
        wrap.addEventListener('click', () => showZoom([trio.flat, trio.fabric, trio.tagless], ['FLAT INPUT', 'FABRIC INPUT', 'FINAL OUTPUT']));
        rowEl.appendChild(wrap);
      });
      lightboxScroll.appendChild(rowEl);
    });

    const tools = (item.dataset.tools || '').split(',').map(t => t.trim()).filter(Boolean);
    if (tools.length > 0) {
      const toolsSection = document.createElement('div');
      toolsSection.className = 'lightbox-tools';
      toolsSection.innerHTML = `<div class="lightbox-tools-label">TOOL</div><div class="lightbox-tools-list">${tools.map(t => `<span>${t}</span>`).join('')}</div>`;
      lightboxScroll.appendChild(toolsSection);
    }

    lightbox.classList.add('active');
    lightboxScroll.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    return;
  }

  if (mode === 'amf') {
    lightboxScroll.className = 'lightbox-scroll layout-grid';

    function getAMFBaseKey(src) {
      return src.split('/').pop()
        .replace('_fitting', '').replace('_model', '').replace('_top', '')
        .replace('_bottom', '').replace('_pants', '').replace('_shoes', '')
        .replace('_video', '')
        .replace(/_c\d+\.\w+$/, '');
    }

    function getAMFTag(src) {
      const f = src.split('/').pop();
      if (f.includes('_fitting_')) return 'fitting';
      if (f.includes('_model_')) return 'model';
      if (f.includes('_top_')) return 'top';
      if (f.includes('_bottom_') || f.includes('_pants_')) return 'bottom';
      if (f.includes('_shoes_')) return 'shoes';
      if (f.match(/\.(mp4|webm|mov)$/i) || f.includes('_video_')) return 'video';
      return 'bottom';
    }

    const models = {};
    images.forEach(src => {
      const key = getAMFBaseKey(src);
      const tag = getAMFTag(src);
      if (!models[key]) models[key] = {};
      models[key][tag] = src;
    });

    const rowGroups = {};
    Object.entries(models).forEach(([key, data]) => {
      const row = key.match(/^(\d+)/)?.[1] || '0';
      if (!rowGroups[row]) rowGroups[row] = [];
      rowGroups[row].push({ key, ...data });
    });

    Object.keys(rowGroups).sort().forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      rowGroups[row].forEach(model => {
        const wrap = document.createElement('div');
        wrap.className = 'amf-item';
        wrap.style.flex = '0 0 calc(33.333% - 5.334px)';
        const fittingImg = Object.assign(document.createElement('img'), {
          src: model.fitting, alt: title, loading: 'eager'
        });
        fittingImg.className = 'amf-fitting';
        const video = Object.assign(document.createElement('video'), {
          src: model.video, loop: true, muted: true, playsInline: true
        });
        video.className = 'amf-video';
        const hint = document.createElement('div');
        hint.className = 'amf-hint';
        hint.textContent = 'CLICK FOR DETAIL';
        wrap.appendChild(fittingImg);
        wrap.appendChild(video);
        wrap.appendChild(hint);
        addSpinner(wrap, fittingImg);
        wrap.addEventListener('mouseenter', () => video.play());
        wrap.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
        wrap.addEventListener('click', () => showAMFDetail(model, title));
        rowEl.appendChild(wrap);
      });
      lightboxScroll.appendChild(rowEl);
    });

    const tools = (item.dataset.tools || '').split(',').map(t => t.trim()).filter(Boolean);
    if (tools.length > 0) {
      const toolsSection = document.createElement('div');
      toolsSection.className = 'lightbox-tools';
      toolsSection.innerHTML = `<div class="lightbox-tools-label">TOOL</div><div class="lightbox-tools-list">${tools.map(t => `<span>${t}</span>`).join('')}</div>`;
      lightboxScroll.appendChild(toolsSection);
    }

    lightbox.classList.add('active');
    lightboxScroll.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    return;
  }

  // AI 레이아웃: 파일명으로 ai/source 분류 후 컬럼 배치
  if (item.dataset.layout === 'ai') {
    const titleSlug = 'lb-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    // layout-grid 클래스 포함 → :not(.layout-grid) 규칙 완전 차단
    lightboxScroll.className = 'lightbox-scroll ai-layout layout-grid ' + titleSlug;

    // 파일명으로 AI 이미지 vs 소스 이미지 분류
    const aiImages = images.filter(src => /ai_image/i.test(src.split('/').pop()));
    const sourceImages = images.filter(src => /source_image/i.test(src.split('/').pop()));

    // ai-pair-item 생성 헬퍼
    function makeAiItem(src, labelText) {
      const wrap = document.createElement('div');
      wrap.className = 'ai-pair-item';
      const img = Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
      wrap.appendChild(img);
      addSpinner(wrap, img);
      if (labelText) {
        const label = document.createElement('div');
        label.className = 'ai-label';
        label.textContent = labelText;
        wrap.appendChild(label);
      }
      const hint = document.createElement('div');
      hint.className = 'click-hint';
      hint.textContent = 'CLICK FOR DETAIL';
      wrap.appendChild(hint);
      wrap.addEventListener('click', e => { e.stopPropagation(); showZoom([src], []); });
      return wrap;
    }

    const row = document.createElement('div');
    row.className = 'ai-pair-row';

    // 왼쪽 컬럼: AI 이미지 (1장이면 단독, 2장이면 상하 배치)
    const leftCol = document.createElement('div');
    leftCol.className = 'ai-col ai-col--left';
    aiImages.forEach(src => {
      leftCol.appendChild(makeAiItem(src, null));
    });
    row.appendChild(leftCol);

    // 오른쪽 컬럼: 소스 이미지
    if (sourceImages.length > 0) {
      const rightCol = document.createElement('div');
      rightCol.className = 'ai-col ai-col--right';
      rightCol.appendChild(makeAiItem(sourceImages[0], null));
      row.appendChild(rightCol);
    }

    lightboxScroll.appendChild(row);
    const tools = (item.dataset.tools || '').split(',').map(t => t.trim()).filter(Boolean);
    if (tools.length > 0) {
      const toolsSection = document.createElement('div');
      toolsSection.className = 'lightbox-tools';
      toolsSection.innerHTML = `<div class="lightbox-tools-label">TOOL</div><div class="lightbox-tools-list">${tools.map(t => `<span>${t}</span>`).join('')}</div>`;
      lightboxScroll.appendChild(toolsSection);
    }
    lightbox.classList.add('active');
    lightboxScroll.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    return;
  }

  // _c1/_c2 suffix AND 01_/02_ prefix 두 조건 모두 충족해야 그룹 카드 레이아웃 사용
  const hasGrid = images.some(src => /_c\d+\./i.test(src)) &&
                  images.some(src => /\/\d{2}_/.test(src));
  const titleSlug = 'lb-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  lightboxScroll.className = 'lightbox-scroll' + (hasGrid ? ' layout-grid' : '') + ' ' + titleSlug;

  if (hasGrid) {
    const groups = {};
    images.forEach(src => {
      const filename = src.split('/').pop();
      const match = filename.match(/^(\d+)/);
      const group = match ? match[1] : '0';
      if (!groups[group]) groups[group] = [];
      groups[group].push(src);
    });

    const groupKeys = Object.keys(groups).sort();

    // 그룹 카드를 생성하는 헬퍼
    function makeGroupCard(groupSrcs, flexBasis) {
      const card = document.createElement('div');
      card.className = 'group-card';
      card.style.flex = flexBasis;

      const inner = document.createElement('div');
      inner.className = `group-card-inner group-card-inner--${groupSrcs.length}`;
      inner.style.gridTemplateColumns = `repeat(${groupSrcs.length}, 1fr)`;

      groupSrcs.forEach(src => {
        const el = src.match(/\.(mp4|webm|mov)$/i)
          ? Object.assign(document.createElement('video'), { src, loop: true, muted: true, playsInline: true })
          : Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
        inner.appendChild(el);
        addSpinner(inner, el);
      });

      const cardHint = document.createElement('div');
      cardHint.className = 'click-hint';
      cardHint.textContent = 'CLICK FOR DETAIL';
      card.appendChild(inner);
      card.appendChild(cardHint);
      card.addEventListener('click', () => showGroupZoom(groupSrcs, title));
      return card;
    }

    // _c2 파일 기반 그룹 판별
    function isCTwoGroup(srcs) {
      return srcs.some(src => /_c2\./i.test(src));
    }

    let i = 0;
    while (i < groupKeys.length) {
      const groupSrcs = groups[groupKeys[i]];
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';

      if (isCTwoGroup(groupSrcs) && i + 1 < groupKeys.length && isCTwoGroup(groups[groupKeys[i + 1]])) {
        // c2 그룹 두 개를 같은 행에 배치 (합산 폭 ≈ 90%)
        rowEl.appendChild(makeGroupCard(groupSrcs, '0 0 44%'));
        rowEl.appendChild(makeGroupCard(groups[groupKeys[i + 1]], '0 0 44%'));
        i += 2;
      } else {
        const flexBasis = groupSrcs.length === 3 ? '0 0 90%'
                        : isCTwoGroup(groupSrcs)  ? '0 0 44%'
                        : '0 0 100%';
        rowEl.appendChild(makeGroupCard(groupSrcs, flexBasis));
        i += 1;
      }

      lightboxScroll.appendChild(rowEl);
    }
  } else {
    images.forEach(src => {
      const el = src.match(/\.(mp4|webm|mov)$/i)
        ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, muted: true, playsInline: true })
        : Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
      const wrap = document.createElement('div');
      wrap.className = 'media-item';
      wrap.appendChild(el);
      addSpinner(wrap, el);
      if (hasSoundHint && el.tagName === 'VIDEO') {
        const hint = document.createElement('div');
        hint.className = 'sound-hint';
        hint.textContent = 'CLICK FOR SOUND';
        wrap.appendChild(hint);
      }
      lightboxScroll.appendChild(wrap);
    });
  }

  // 툴 표시
  const tools = (item.dataset.tools || '').split(',').map(t => t.trim()).filter(Boolean);
  if (tools.length > 0) {
    const toolsSection = document.createElement('div');
    toolsSection.className = 'lightbox-tools';
    toolsSection.innerHTML = `
      <div class="lightbox-tools-label">TOOL</div>
      <div class="lightbox-tools-list">${tools.map(t => `<span>${t}</span>`).join('')}</div>
    `;
    lightboxScroll.appendChild(toolsSection);
  }

  lightbox.classList.add('active');
  lightboxScroll.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}


function initCarousel(carousel) {
  const viewport = carousel.querySelector('.carousel-viewport');
  const grid = carousel.querySelector('.gallery-grid');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  Array.from(grid.querySelectorAll('.gallery-item')).forEach(item => {
    try {
      const images = JSON.parse(item.dataset.images || '[]');
      if (images.length === 0) item.remove();
    } catch (e) { item.remove(); }
  });

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const count = items.length;

  if (count === 0) {
    carousel.closest('.gallery-section').style.display = 'none';
    return;
  }

  const gap = 12;
  let visibleCount, itemWidth, step, maxIndex;
  let currentIndex = 0;
  let isTransitioning = false;

  function setPosition(index, animate) {
    const offset = -(index * step);
    if (!animate) {
      grid.style.transition = 'none';
      grid.style.transform = `translateX(${offset}px)`;
      grid.offsetHeight;
      grid.style.transition = 'transform 0.5s ease';
    } else {
      grid.style.transform = `translateX(${offset}px)`;
    }
  }

  function updateArrows() {
    prevBtn.style.opacity = currentIndex === 0 ? '0.15' : '0.6';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : '';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.15' : '0.6';
    nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : '';
  }

  // 도트 네비게이션 생성
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  const dots = Array.from({ length: count }, (_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      const target = Math.min(i, maxIndex);
      if (isTransitioning || currentIndex === target) return;
      isTransitioning = true;
      currentIndex = target;
      setPosition(currentIndex, true);
      updateArrows();
      updateDots();
    });
    dotsContainer.appendChild(dot);
    return dot;
  });
  carousel.insertAdjacentElement('afterend', dotsContainer);

  function updateDots() {
    dots.forEach((dot, i) => {
      const isActive = i >= currentIndex && i < currentIndex + visibleCount;
      dot.classList.toggle('active', isActive);
    });
  }

  function recalcLayout(w) {
    w = w || viewport.offsetWidth;
    if (w <= 0) return;
    visibleCount = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? Math.min(count, 2) : Math.min(count, 3);
    itemWidth = Math.floor((w - gap * (visibleCount - 1)) / visibleCount);
    step = itemWidth + gap;
    maxIndex = count - visibleCount;
    items.forEach(item => { item.style.width = itemWidth + 'px'; });
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    setPosition(currentIndex, false);
    updateArrows();
    updateDots();
  }

  new ResizeObserver(entries => {
    const w = entries[0].contentRect.width;
    if (w > 0) recalcLayout(w);
  }).observe(viewport);

  recalcLayout();

  grid.addEventListener('transitionend', e => {
    if (e.propertyName !== 'transform') return;
    isTransitioning = false;
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning || currentIndex === 0) return;
    isTransitioning = true;
    currentIndex--;
    setPosition(currentIndex, true);
    updateArrows();
    updateDots();
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning || currentIndex >= maxIndex) return;
    isTransitioning = true;
    currentIndex++;
    setPosition(currentIndex, true);
    updateArrows();
    updateDots();
  });

  let didDrag = false;

  // 터치 스와이프
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50 || isTransitioning) return;
    if (dx < 0 && currentIndex < maxIndex) {
      isTransitioning = true; currentIndex++;
    } else if (dx > 0 && currentIndex > 0) {
      isTransitioning = true; currentIndex--;
    }
    setPosition(currentIndex, true); updateArrows(); updateDots();
  }, { passive: true });

  // 마우스 드래그
  let mouseStartX = 0;
  let isMouseDown = false;
  viewport.addEventListener('mousedown', e => {
    mouseStartX = e.clientX;
    isMouseDown = true;
    didDrag = false;
  });
  window.addEventListener('mouseup', e => {
    if (!isMouseDown) return;
    isMouseDown = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) < 50 || isTransitioning) return;
    didDrag = true;
    if (dx < 0 && currentIndex < maxIndex) {
      isTransitioning = true; currentIndex++;
    } else if (dx > 0 && currentIndex > 0) {
      isTransitioning = true; currentIndex--;
    }
    setPosition(currentIndex, true); updateArrows(); updateDots();
  });

  grid.addEventListener('click', e => {
    if (isTransitioning || didDrag) { didDrag = false; return; }
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(item);
  });
}

function preloadItem(item) {
  if (item._preloaded) return;
  item._preloaded = true;
  let srcs = [];
  try { srcs = JSON.parse(item.dataset.images || '[]'); } catch(e) {}
  srcs.forEach(src => {
    if (src.match(/\.(mp4|webm|mov)$/i)) {
      fetch(src).catch(() => {});
    } else {
      new Image().src = src;
    }
  });
}

window.addEventListener('load', () => {
  document.querySelectorAll('.gallery-carousel').forEach(carousel => initCarousel(carousel));
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => preloadItem(item));
    item.addEventListener('touchstart', () => preloadItem(item), { passive: true });
  });
});

// ─── ZOOM ───
const zoomOverlay = document.createElement('div');
zoomOverlay.className = 'lightbox-zoom';
const zoomClose = document.createElement('button');
zoomClose.className = 'lightbox-close';
zoomClose.textContent = '✕';
zoomOverlay.appendChild(zoomClose);
const zoomContent = document.createElement('div');
zoomContent.className = 'lightbox-zoom-content';
zoomOverlay.appendChild(zoomContent);
document.body.appendChild(zoomOverlay);

let _amfDetailModel = null;
let _amfDetailTitle = null;
let _inAMFDetailZoom = false;

let _currentGroupSrcs = null;
let _currentGroupTitle = null;
let _inGroupZoom = false;
let _fromGroupZoom = false;

function showGroupZoom(srcs, itemTitle) {
  _currentGroupSrcs = srcs;
  _currentGroupTitle = itemTitle;
  _inGroupZoom = true;
  _fromGroupZoom = false;

  zoomContent.innerHTML = '';
  zoomContent.className = 'lightbox-zoom-content';
  zoomContent.style.cssText = '';

  const grid = document.createElement('div');
  // 장수별 클래스 → 리스트(group-card-inner--N)와 동일한 이미지 맞춤 적용
  grid.className = 'group-zoom-grid group-zoom-grid--' + srcs.length
                 + (srcs.length === 1 ? ' group-zoom-grid--single' : '');
  grid.style.gridTemplateColumns = `repeat(${srcs.length}, 1fr)`;
  grid.style.width = '90vw';

  const mediaEls = [];
  srcs.forEach(src => {
    const el = src.match(/\.(mp4|webm|mov)$/i)
      ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, muted: true, playsInline: true })
      : Object.assign(document.createElement('img'), { src, loading: 'eager' });
    const wrap = document.createElement('div');
    wrap.className = 'media-item group-zoom-item';

    // 돋보기 hover 효과
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.transformOrigin = `${x}% ${y}%`;
      el.style.transform = 'scale(2.5)';
      el.style.transition = 'none';
    });
    wrap.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.3s ease';
      el.style.transform = '';
      el.style.transformOrigin = 'center center';
    });

    // 클릭 풀스크린 비활성화
    wrap.addEventListener('click', e => e.stopPropagation());

    wrap.appendChild(el);
    mediaEls.push(el);
    grid.appendChild(wrap);
  });

  zoomContent.appendChild(grid);
  addZoomSpinner(mediaEls);
  zoomOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showAMFDetail(model, title) {
  _amfDetailModel = model;
  _amfDetailTitle = title;
  _inAMFDetailZoom = false;

  zoomContent.innerHTML = '';
  zoomContent.className = 'lightbox-zoom-content';
  zoomContent.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:0;';

  const inner = document.createElement('div');
  inner.style.cssText = 'display:flex;flex-direction:row;gap:4px;align-items:stretch;height:85vh;';

  // 좌측: 영상
  const colLeft = document.createElement('div');
  colLeft.style.cssText = 'flex:0 0 auto;overflow:hidden;cursor:zoom-in;transition:transform 0.3s ease,opacity 0.3s ease;position:relative;';
  const video = Object.assign(document.createElement('video'), {
    src: model.video, autoplay: true, loop: true, muted: true, playsInline: true
  });
  video.style.cssText = 'height:100%;width:auto;display:block;';
  colLeft.appendChild(video);
  addSpinner(colLeft, video);
  colLeft.addEventListener('mouseenter', () => { colLeft.style.transform = 'scale(1.03)'; colLeft.style.opacity = '0.85'; });
  colLeft.addEventListener('mouseleave', () => { colLeft.style.transform = ''; colLeft.style.opacity = ''; });
  colLeft.addEventListener('click', e => {
    e.stopPropagation();
    zoomContent.style.cssText = '';
    zoomContent.innerHTML = '';
    zoomContent.className = 'lightbox-zoom-content';
    const v = Object.assign(document.createElement('video'), {
      src: model.video, autoplay: true, loop: true, muted: true, playsInline: true
    });
    v.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;';
    zoomContent.appendChild(v);
    addZoomSpinner([v]);
  });

  // 우측: model / top / bottom / shoes 세로 나열
  const colRight = document.createElement('div');
  colRight.style.cssText = 'flex:0 0 auto;width:22vw;display:flex;flex-direction:column;gap:4px;';
  ['model', 'top', 'bottom', 'shoes'].forEach(tag => {
    if (!model[tag]) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'flex:1;overflow:hidden;cursor:zoom-in;transition:transform 0.3s ease,opacity 0.3s ease;position:relative;';
    const img = Object.assign(document.createElement('img'), { src: model[tag], loading: 'eager' });
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
    wrap.appendChild(img);
    addSpinner(wrap, img);
    wrap.addEventListener('mouseenter', () => { wrap.style.transform = 'scale(1.03)'; wrap.style.opacity = '0.85'; });
    wrap.addEventListener('mouseleave', () => { wrap.style.transform = ''; wrap.style.opacity = ''; });
    wrap.addEventListener('click', e => {
      e.stopPropagation();
      _inAMFDetailZoom = true;
      showZoom([img.src]);
    });
    colRight.appendChild(wrap);
  });

  inner.appendChild(colLeft);
  inner.appendChild(colRight);
  zoomContent.appendChild(inner);
  zoomOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function addZoomSpinner(mediaEls) {
  zoomOverlay.querySelectorAll('.zoom-spinner').forEach(s => s.remove());
  const spinner = document.createElement('div');
  spinner.className = 'spinner zoom-spinner';
  zoomOverlay.appendChild(spinner);
  let remaining = mediaEls.length;
  const onLoad = () => {
    remaining--;
    if (remaining <= 0) {
      spinner.classList.add('done');
      setTimeout(() => spinner.remove(), 300);
    }
  };
  mediaEls.forEach(el => {
    if (el.tagName === 'IMG') {
      if (el.complete && el.naturalWidth > 0) { onLoad(); return; }
      el.addEventListener('load', onLoad, { once: true });
      el.addEventListener('error', onLoad, { once: true });
    } else {
      if (el.readyState >= 2) { onLoad(); return; }
      el.addEventListener('loadeddata', onLoad, { once: true });
      el.addEventListener('error', onLoad, { once: true });
    }
  });
}

function showZoom(srcs, labels) {
  zoomContent.innerHTML = '';
  zoomContent.className = 'lightbox-zoom-content' + (srcs.length === 3 ? ' zoom-triple' : srcs.length > 1 ? ' zoom-pair' : '');
  const mediaEls = [];
  srcs.forEach((src, i) => {
    const el = src.match(/\.(mp4|webm|mov)$/i)
      ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, muted: true, playsInline: true, controls: true })
      : Object.assign(document.createElement('img'), { src });
    mediaEls.push(el);
    if (labels && labels[i]) {
      const wrap = document.createElement('div');
      wrap.className = 'zoom-item';
      wrap.appendChild(el);
      const label = document.createElement('div');
      label.className = 'zoom-label';
      label.textContent = labels[i];
      wrap.appendChild(label);
      zoomContent.appendChild(wrap);
    } else if (srcs.length === 1 && el.tagName === 'IMG') {
      // 단일 이미지: 그룹 줌과 동일한 돋보기(커서 줌) 효과
      const wrap = document.createElement('div');
      wrap.className = 'zoom-magnify';
      wrap.appendChild(el);
      wrap.addEventListener('mousemove', ev => {
        const rect = el.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = ((ev.clientY - rect.top) / rect.height) * 100;
        el.style.transformOrigin = `${x}% ${y}%`;
        el.style.transform = 'scale(2.5)';
        el.style.transition = 'none';
      });
      wrap.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.3s ease';
        el.style.transform = '';
        el.style.transformOrigin = 'center center';
      });
      zoomContent.appendChild(wrap);
    } else {
      zoomContent.appendChild(el);
    }
  });
  addZoomSpinner(mediaEls);
  zoomOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

lightboxScroll.addEventListener('click', e => {
  if (e.target.closest('.ftg-triple')) return;
  if (e.target.closest('.amf-item')) return;
  if (e.target.closest('.group-card')) return;
  const pair = e.target.closest('.hover-pair');
  if (pair) {
    const fs = pair.querySelector('.hover-fullshot');
    const cu = pair.querySelector('.hover-closeup');
    showZoom([fs.src, cu.src]);
    return;
  }
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
    showZoom([e.target.src]);
  }
});

function closeZoomOverlay() {
  zoomOverlay.classList.remove('active');
  zoomContent.querySelectorAll('video').forEach(v => {
    v.pause();
    v.src = '';
    v.load();
  });
  zoomContent.style.cssText = '';
  _inGroupZoom = false;
  _fromGroupZoom = false;
  _currentGroupSrcs = null;
}

zoomOverlay.addEventListener('click', e => {
  if (e.target === zoomOverlay) {
    if (_inAMFDetailZoom) {
      _inAMFDetailZoom = false;
      showAMFDetail(_amfDetailModel, _amfDetailTitle);
    } else if (_fromGroupZoom) {
      _fromGroupZoom = false;
      showGroupZoom(_currentGroupSrcs, _currentGroupTitle);
    } else {
      closeZoomOverlay();
    }
    return;
  }
  const media = e.target.closest('img');
  if (media && zoomContent.querySelectorAll('img, video').length > 1) {
    if (_inGroupZoom) {
      _fromGroupZoom = true;
      _inGroupZoom = false;
    }
    showZoom([media.src]);
  }
});

zoomClose.addEventListener('click', () => {
  if (_inAMFDetailZoom) {
    _inAMFDetailZoom = false;
    showAMFDetail(_amfDetailModel, _amfDetailTitle);
  } else if (_fromGroupZoom) {
    _fromGroupZoom = false;
    showGroupZoom(_currentGroupSrcs, _currentGroupTitle);
  } else {
    closeZoomOverlay();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (_fromGroupZoom) {
      _fromGroupZoom = false;
      showGroupZoom(_currentGroupSrcs, _currentGroupTitle);
    } else {
      closeZoomOverlay();
    }
  }
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxScroll.querySelectorAll('video').forEach(v => {
    v.pause();
    v.src = '';
    v.load();
  });
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
