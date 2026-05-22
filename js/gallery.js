const lightbox = document.querySelector('.lightbox');
const lightboxScroll = document.querySelector('.lightbox-scroll');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxClose = document.querySelector('.lightbox-close');

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

  const hasGrid = images.some(src => /_c\d+\./i.test(src));
  lightboxScroll.className = 'lightbox-scroll' + (hasGrid ? ' layout-grid' : '');

  if (hasGrid) {
    const colWidths = { 1: '100%', 2: 'calc(50% - 4px)', 3: 'calc(33.333% - 5.334px)', 4: 'calc(25% - 6px)' };
    const groups = {};
    images.forEach(src => {
      const filename = src.split('/').pop();
      const match = filename.match(/^(\d+)/);
      const group = match ? match[1] : '0';
      if (!groups[group]) groups[group] = [];
      groups[group].push(src);
    });

    const imageSet = new Set(images);

    Object.keys(groups).sort().forEach(group => {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      const skipSet = new Set();

      groups[group].forEach(src => {
        if (skipSet.has(src)) return;

        const filename = src.split('/').pop();
        const colMatch = src.match(/_c(\d+)\./i);
        const cols = colMatch ? parseInt(colMatch[1]) : 1;
        const width = colWidths[cols] || '100%';

        if (filename.includes('_fullshot_')) {
          const closeupSrc = src.replace('_fullshot_', '_closeup_');
          if (imageSet.has(closeupSrc)) {
            skipSet.add(closeupSrc);
            const wrapper = document.createElement('div');
            wrapper.className = 'hover-pair';
            wrapper.style.flex = `0 0 ${width}`;
            const fsImg = Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
            fsImg.className = 'hover-fullshot';
            const cuImg = Object.assign(document.createElement('img'), { src: closeupSrc, alt: title, loading: 'eager' });
            cuImg.className = 'hover-closeup';
            wrapper.appendChild(fsImg);
            wrapper.appendChild(cuImg);
            rowEl.appendChild(wrapper);
            return;
          }
        }

        const el = src.match(/\.(mp4|webm|mov)$/i)
          ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, muted: true, playsInline: true })
          : Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
        const wrap = document.createElement('div');
        wrap.className = 'media-item';
        wrap.style.flex = `0 0 ${width}`;
        wrap.appendChild(el);
        if (hasSoundHint && el.tagName === 'VIDEO') {
          const hint = document.createElement('div');
          hint.className = 'sound-hint';
          hint.textContent = 'CLICK FOR SOUND';
          wrap.appendChild(hint);
        }
        const caption = captions[filename];
        if (caption) {
          const label = document.createElement('div');
          label.className = 'media-caption';
          label.textContent = caption;
          wrap.appendChild(label);
        }
        rowEl.appendChild(wrap);
      });

      lightboxScroll.appendChild(rowEl);
    });
  } else {
    images.forEach(src => {
      const el = src.match(/\.(mp4|webm|mov)$/i)
        ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, muted: true, playsInline: true })
        : Object.assign(document.createElement('img'), { src, alt: title, loading: 'eager' });
      const wrap = document.createElement('div');
      wrap.className = 'media-item';
      wrap.appendChild(el);
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
  const viewportWidth = viewport.offsetWidth;
  const isMobile = window.innerWidth <= 768;
  const visibleCount = isMobile ? 1 : Math.min(count, 3);
  const hasOverflow = count > visibleCount;
  const itemWidth = Math.floor((viewportWidth - gap * (visibleCount - 1)) / visibleCount);
  const step = itemWidth + gap;
  const maxIndex = count - visibleCount;

  items.forEach(item => { item.style.width = itemWidth + 'px'; });

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

  setPosition(0, false);
  updateArrows();
  updateDots();

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

document.querySelectorAll('.gallery-carousel').forEach(carousel => initCarousel(carousel));

// ─── ZOOM ───
const zoomOverlay = document.createElement('div');
zoomOverlay.className = 'lightbox-zoom';
const zoomContent = document.createElement('div');
zoomContent.className = 'lightbox-zoom-content';
zoomOverlay.appendChild(zoomContent);
document.body.appendChild(zoomOverlay);

function showZoom(srcs) {
  zoomContent.innerHTML = '';
  zoomContent.className = 'lightbox-zoom-content' + (srcs.length > 1 ? ' zoom-pair' : '');
  srcs.forEach(src => {
    const el = src.match(/\.(mp4|webm|mov)$/i)
      ? Object.assign(document.createElement('video'), { src, autoplay: true, loop: true, playsInline: true, controls: true })
      : Object.assign(document.createElement('img'), { src });
    zoomContent.appendChild(el);
  });
  zoomOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

lightboxScroll.addEventListener('click', e => {
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

zoomOverlay.addEventListener('click', () => {
  zoomOverlay.classList.remove('active');
  zoomContent.querySelectorAll('video').forEach(v => v.pause());
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') zoomOverlay.classList.remove('active');
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxScroll.querySelectorAll('video').forEach(v => v.pause());
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
