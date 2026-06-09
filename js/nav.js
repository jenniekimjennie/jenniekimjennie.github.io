const heroCta = document.getElementById('hero-cta');
if (heroCta) {
  heroCta.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.remove('hero-only');
    setTimeout(() => {
      document.getElementById('gallery-clo').scrollIntoView({ behavior: 'smooth' });
    }, 50);
  });
}

const nav = document.querySelector('nav');
let _navRaf = null;

window.addEventListener('scroll', () => {
  if (_navRaf) return;
  _navRaf = requestAnimationFrame(() => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    _navRaf = null;
  });
}, { passive: true });

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();
