// ============================================================
// IMPORTS — GSAP + Lenis desde CDN (cargados en el HTML)
// ============================================================

// ---- Registrar plugins de GSAP ----
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// LENIS — scroll suave
// Configuración extraída del bundle original:
//   duration: 1.2, easing: expo-like
// ============================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

// Conectar Lenis con el RAF de GSAP para que ScrollTrigger
// reciba los valores de scroll correctamente
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// NAVBAR — collapse al pasar 100px de scroll (igual que original)
// ============================================================
const nav = document.querySelector('.nav');

lenis.on('scroll', ({ scroll }) => {
  if (scroll > 100) {
    nav.classList.add('is-collapsed', 'is-light');
  } else {
    nav.classList.remove('is-collapsed', 'is-light');
  }
});

// ============================================================
// HERO — intro animation
// Original: gsap.fromTo(".hero__media", {scale:1.4}, {scale:1,
//           duration:3, ease:"expo.out"})
// ============================================================
const heroMedia = document.querySelector('.hero__media');

if (heroMedia) {
  gsap.fromTo(heroMedia,
    { scale: 1.4 },
    { scale: 1, duration: 3, delay: 0.3, ease: 'expo.out', force3D: true }
  );
}

// ============================================================
// SCROLL HERO — parallax en la imagen de fondo
// La imagen se mueve más lento que el scroll (scrub)
// ============================================================
const scrollHeroMedia = document.querySelector('.scroll-hero__media img');

if (scrollHeroMedia) {
  gsap.fromTo(scrollHeroMedia,
    { yPercent: 0 },
    {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scroll-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
}

// Texto del scroll-hero: sube desde abajo al entrar
const scrollHeroText = document.querySelector('.scroll-hero__text');
if (scrollHeroText) {
  gsap.from(scrollHeroText,
    {
      yPercent: 15,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scroll-hero',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      }
    }
  );
}

// ============================================================
// PRODUCT SECTION NAMES — aparecen con clip-path al hacer scroll
// ============================================================
document.querySelectorAll('.product-section__name').forEach((el) => {
  gsap.from(el, {
    clipPath: 'inset(0% 100% 0% 0%)',
    duration: 1.2,
    ease: 'expo.inOut',
    scrollTrigger: {
      trigger: el,
      start: 'top 75%',
      toggleActions: 'play none none none',
    }
  });
});

// ============================================================
// CARDS — aparecen escalonadas al entrar en viewport
// ============================================================
document.querySelectorAll('.cards-grid').forEach((grid) => {
  const cards = grid.querySelectorAll('.card');

  gsap.from(cards, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });
});

// ============================================================
// SOCIAL TAGS — slide in desde izquierda y derecha
// ============================================================
const socialTags = document.querySelectorAll('.social-section__tag');
socialTags.forEach((tag, i) => {
  gsap.from(tag, {
    x: i % 2 === 0 ? -80 : 80,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: tag,
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });
});

// ============================================================
// INVIEW — IntersectionObserver para elementos [data-inview]
// Replicado del módulo 195 del bundle original
// ============================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const once = entry.target.dataset.observe === 'once';
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        if (once) observer.unobserve(entry.target);
      } else if (!once) {
        entry.target.classList.remove('is-inview');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('[data-inview]').forEach((el) => {
  el.dataset.observe = 'once';
  observer.observe(el);
});

// ============================================================
// PRODUCT IMAGE — parallax sutil en cada imagen de sección
// ============================================================
document.querySelectorAll('.product-section__image img').forEach((img) => {
  gsap.fromTo(img,
    { yPercent: 5 },
    {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.product-section__image'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
});
