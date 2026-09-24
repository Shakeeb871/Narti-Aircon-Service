/* NARTI Aircon Service — site scripts */
(function () {
  'use strict';

  /* ---------- Review ratings ----------
     Put the real numbers from the Google Business Profile and Trustpilot here.
     Leave rating as null and the badge shows "Read our reviews" instead of stars.
     Set url to the direct review page once the profiles are live. */
  var REVIEWS = {
    google:     { rating: null, count: null, url: '' },
    trustpilot: { rating: null, count: null, url: '' }
  };

  document.querySelectorAll('[data-review]').forEach(function (badge) {
    var cfg = REVIEWS[badge.getAttribute('data-review')];
    if (!cfg) return;
    if (cfg.url) badge.href = cfg.url;
    if (typeof cfg.rating === 'number') {
      badge.classList.add('has-rating');
      badge.style.setProperty('--rating', cfg.rating);
      badge.querySelector('.rating__meta').innerHTML =
        '<strong>' + cfg.rating.toFixed(1) + '</strong> / 5' +
        (cfg.count ? ' &middot; ' + cfg.count + ' reviews' : '');
      badge.setAttribute('aria-label', badge.querySelector('.rating__name').textContent +
        ': rated ' + cfg.rating.toFixed(1) + ' out of 5');
    }
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  var here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  var spyTargets = [];
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var parts = (link.getAttribute('href') || '').split('#');
    if (parts[0].replace(/\/$/, '') !== here) return;
    var el = document.getElementById(parts[1] || 'home');
    if (el) spyTargets.push({ link: link, el: el });
  });

  if ('IntersectionObserver' in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyTargets.forEach(function (t) {
          t.link.classList.toggle('is-active', t.el === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach(function (t) { spy.observe(t.el); });
  }

  /* ---------- FAQ accordion ---------- */
  var items = document.querySelectorAll('.accordion__item');
  items.forEach(function (item) {
    var btn = item.querySelector('.accordion__btn');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      items.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.accordion__btn').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Request form ---------- */
  var form = document.getElementById('requestForm');
  if (form) {
    var msg = document.getElementById('formMsg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.value.trim() !== '';
        field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        msg.textContent = 'Please fill in your name, phone number and the service you need.';
        return;
      }

      var get = function (id) { return document.getElementById(id).value.trim(); };
      var optional = function (id) { var el = document.getElementById(id); return el && el.value ? el.value.trim() : ''; };
      var text = 'Hi NARTI, I would like to request a service.\n' +
        'Name: ' + get('rf-name') + '\n' +
        'Phone: ' + get('rf-phone') + '\n' +
        'Service: ' + get('rf-service') +
        (get('rf-date') ? '\nPreferred date: ' + get('rf-date') : '') +
        (optional('rf-area') ? '\nArea: ' + optional('rf-area') : '') +
        (optional('rf-msg') ? '\nDetails: ' + optional('rf-msg') : '');
      window.open('https://wa.me/60168210460?text=' + encodeURIComponent(text), '_blank', 'noopener');

      msg.textContent = 'WhatsApp is opening with your details. Press send and we will reply to confirm the visit.';
      form.reset();
      var date = document.getElementById('rf-date');
      date.type = 'text';
    });

    form.querySelectorAll('.field').forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('is-invalid'); });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .about__content, .about__collage, .service-card, .services__intro, ' +
    '.request-form, .request__content, .step, .work-card, .why__content, .why-card, ' +
    '.faq__img, .faq__content, .post-card, .cta__content, .symptom, .package, .service-link, .included__media, ' +
    '.habit, .tl-item, .work-tile, .promise-card, .promise-item, .story__media, .story__content'
  );

  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      revealer.observe(el);
    });
  }

  /* ---------- Service areas: show / hide the rest ---------- */
  var areaBtn = document.getElementById('areaMore');
  var areaList = document.getElementById('areaList');
  if (areaBtn && areaList) {
    var moreLabel = areaBtn.textContent;
    areaBtn.addEventListener('click', function () {
      var open = areaList.classList.toggle('is-expanded');
      areaBtn.setAttribute('aria-expanded', String(open));
      areaBtn.textContent = open ? 'Show fewer areas' : moreLabel;
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
