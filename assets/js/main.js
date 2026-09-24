/* NARTI Aircon Service — site scripts */
(function () {
  'use strict';

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
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
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

    msg.textContent = 'Thank you! Our team will call you shortly to confirm your booking.';
    form.reset();
    var date = document.getElementById('rf-date');
    date.type = 'text';
  });

  form.querySelectorAll('.field').forEach(function (field) {
    field.addEventListener('input', function () { field.classList.remove('is-invalid'); });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .about__content, .about__collage, .service-card, .services__intro, ' +
    '.request-form, .request__content, .step, .work-card, .why__content, .why-card, ' +
    '.faq__img, .faq__content, .post-card, .cta__content'
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

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
