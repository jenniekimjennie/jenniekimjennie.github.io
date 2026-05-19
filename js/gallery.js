const lightbox = document.querySelector('.lightbox');
const lightboxInner = document.querySelector('.lightbox-inner');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const video = item.querySelector('video');

    lightboxInner.innerHTML = '';

    if (img) {
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt;
      lightboxInner.appendChild(el);
    } else if (video) {
      const el = document.createElement('video');
      el.src = video.src;
      el.controls = true;
      el.autoplay = true;
      lightboxInner.appendChild(el);
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  const video = lightboxInner.querySelector('video');
  if (video) video.pause();
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
