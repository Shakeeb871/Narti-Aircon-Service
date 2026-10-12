/* NARTI motion layer (GSAP + ScrollTrigger)
   - Only transform and opacity are animated.
   - Hero text never fades, so it still counts as the first paint (LCP).
   - Everything is skipped when the visitor prefers reduced motion. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-motion');

  var EASE = 'expo.out';
  var $ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* ---------- Hero intro ---------- */
    var hero = document.querySelector('.hero, .page-hero, .about-hero, .contact-hero');
    if (hero) {
      var tl = gsap.timeline({ defaults: { ease: EASE, duration: 1.1 } });
      var heroTitle = hero.querySelector('h1');
      if (heroTitle) tl.from(heroTitle, { y: 26 }, 0);
      tl.from($('.eyebrow, .divider', hero).slice(0, 2), { y: 14, opacity: 0, stagger: .08 }, 0)
        .from($('.hero-hook, .ratings, .hero__actions, .breadcrumb', hero), { y: 22, opacity: 0, stagger: .09 }, .15);
      var visual = hero.querySelector('.hero__img, .page-hero__media img, .about-hero__bg img');
      if (visual) tl.from(visual, { scale: 1.08, duration: 1.6 }, 0);
      var stripe = hero.querySelector('.hero__stripe');
      if (stripe) tl.from(stripe, { xPercent: 18, opacity: 0, duration: 1.4 }, .05);
      var facts = $('.about-facts li', hero);
      if (facts.length) tl.from(facts, { x: 24, opacity: 0, stagger: .1 }, .25);
    }

    /* ---------- Section headings ---------- */
    $('.section-head, .services__intro, .why__content, .faq__content > .eyebrow, .faq__content > .section-title, .request__content, .svc-about__content > .eyebrow, .svc-about__content > .section-title, .svc-about__intro, .about__content, .cta__content').forEach(function (el) {
      var kids = el.children.length > 1 ? Array.prototype.slice.call(el.children) : [el];
      gsap.from(kids, {
        y: 30, opacity: 0, duration: 1, ease: EASE, stagger: .08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    /* ---------- Card groups: staggered entry ---------- */
    var groups = [
      '.trust__grid > *', '.services__cards > *', '.why__cards > *', '.signs__grid > *', '.svc-why__grid > *',
      '.steps__grid > *', '.work__grid > *', '.blog__grid > *', '.pricing__grid > *', '.svc-about__point',
      '.accordion__item', '.price-row', '.contact-cards > *', '.habits__grid > *', '.promise-list > *',
      '.projects__grid > *', '.work-tiles > *', '.svc-rows > *', '.about-stats__grid > *', '.packages > *',
      '.area-list > *', '.footer__grid > *'
    ];
    groups.forEach(function (sel) {
      var items = $(sel);
      if (!items.length) return;
      gsap.set(items, { y: 36, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: 'top 88%', once: true,
        onEnter: function (batch) {
          gsap.to(batch, { y: 0, opacity: 1, duration: .95, ease: EASE, stagger: .09, overwrite: true });
        }
      });
    });

    /* ---------- How It Works: progress line fills with scroll ---------- */
    $('.steps__grid').forEach(function (grid) {
      if (window.innerWidth < 992) return;
      var bar = document.createElement('span');
      bar.className = 'steps__progress';
      grid.appendChild(bar);
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: grid, start: 'top 75%', end: 'bottom 60%', scrub: .5 }
      });
    });

    /* ---------- Heading underline draws in ---------- */
    $('main .divider').forEach(function (d) {
      if (d.closest('.hero, .page-hero, .about-hero')) return;
      gsap.fromTo(d, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 1.1, ease: EASE,
        scrollTrigger: { trigger: d, start: 'top 90%', once: true }
      });
    });

    /* ---------- Images drift slightly as you scroll ---------- */
    $('.svc-about__media, .why__img, .about__collage, .faq__img, .story__img').forEach(function (el) {
      gsap.fromTo(el, { y: 30 }, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .6 }
      });
    });

    /* ---------- Stats count up ---------- */
    $('.stat__num, .about-stat__num').forEach(function (el) {
      var m = el.textContent.match(/^(\D*)(\d+)(\D*)$/);
      if (!m) return;
      var obj = { v: 0 }, end = +m[2];
      el.textContent = m[1] + '0' + m[3];
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function () { el.textContent = m[1] + Math.round(obj.v) + m[3]; }
      });
    });

    /* ---------- Pointer effects (mouse only) ---------- */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $('.service-card').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
      $('.btn--primary, .btn--white').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' });
        var yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * .18);
          yTo((e.clientY - r.top - r.height / 2) * .28);
        });
        btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
      });
    }

    return function () { ScrollTrigger.getAll().forEach(function (t) { t.kill(); }); };
  });

  /* Fonts and lazy images change heights; recalculate trigger positions once they settle */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
