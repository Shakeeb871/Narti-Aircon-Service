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
    '.habit, .tl-item, .work-tile, .promise-card, .promise-item, .story__media, .story__content, ' +
    '.svc-row, .project-card, .contact-card, .send-card'
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

  /* ---------- Project filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    var cards = document.querySelectorAll('.project-card');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        cards.forEach(function (card) {
          var show = cat === 'all' || card.getAttribute('data-cat') === cat;
          card.hidden = !show;
          if (show) card.classList.add('is-visible');
        });
      });
    });
  }

  /* ---------- Testimonials slider (Google reviews) ---------- */
  var reviewsSection = document.getElementById('reviews');
  var reviewsTrack = document.getElementById('reviewsTrack');
  var reviewList = (window.NARTI_REVIEWS || []).filter(function (r) { return r && r.text; });

  // "Leave a review" button uses the Google review link once it is set in reviews.js
  if (window.NARTI_REVIEW_LINK) {
    document.querySelectorAll('[data-review-link="write"]').forEach(function (a) { a.href = window.NARTI_REVIEW_LINK; });
  }

  if (reviewsSection && reviewsTrack && reviewList.length) {
    var esc = function (t) {
      return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    var gLogo = '<svg class="review-card__g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
    var card = function (r, hidden) {
      var stars = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      var initial = esc((r.name || '?').trim().charAt(0).toUpperCase());
      var meta = [r.service, r.area].filter(Boolean).map(esc).join(' &middot; ');
      return '<article class="review-card"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
        '<header class="review-card__head">' +
          '<span class="review-card__avatar">' + initial + '</span>' +
          '<span class="review-card__who"><strong>' + esc(r.name) + '</strong><span>' + esc(r.date) + '</span></span>' +
          gLogo +
        '</header>' +
        '<div class="review-card__rating">' +
          '<span class="review-card__stars" aria-label="' + stars + ' out of 5 stars">' + '&#9733;'.repeat(stars) + '<span class="review-card__stars-off">' + '&#9733;'.repeat(5 - stars) + '</span></span>' +
          (r.verified ? '<span class="review-card__verified"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z"/><path d="m8.5 12.2 2.3 2.3 4.7-4.7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Verified</span>' : '') +
        '</div>' +
        '<p class="review-card__text">' + esc(r.text) + '</p>' +
        (meta ? '<p class="review-card__meta">' + meta + '</p>' : '') +
      '</article>';
    };
    var html = reviewList.map(function (r) { return card(r, false); }).join('');
    // second copy makes the right-to-left loop seamless; hidden from screen readers
    reviewsTrack.innerHTML = '<div class="reviews__group">' + html + '</div>' +
      '<div class="reviews__group" aria-hidden="true">' + reviewList.map(function (r) { return card(r, true); }).join('') + '</div>';
    reviewsTrack.style.setProperty('--reviews-duration', Math.max(30, reviewList.length * 7) + 's');
    reviewsTrack.parentNode.hidden = false;
    var emptyState = document.getElementById('reviewsEmpty');
    if (emptyState) emptyState.hidden = true;
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
