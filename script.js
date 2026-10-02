(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuBtn');
  var nav = $('#nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  $$('.nav-link').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeModal(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  var links = $$('.nav-link');
  var sections = links.map(function (l) {
    return document.getElementById(l.dataset.section);
  });

  function updateActive() {
    var y = window.scrollY + 120;
    var current = 0;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= y) current = i;
    });
    if (window.scrollY > 200 && window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = links.length - 1;
    }
    links.forEach(function (l, i) { l.classList.toggle('is-active', i === current); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ---------- Floating hearts ---------- */
  var layer = $('#heartsLayer');

  function burst(originEl, count) {
    if (reduceMotion) return;
    var r = originEl.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    for (var i = 0; i < count; i++) {
      (function (i) {
        setTimeout(function () {
          var h = document.createElement('span');
          h.className = 'float-heart';
          var size = 14 + Math.random() * 22;
          h.style.width = size + 'px';
          h.style.height = size + 'px';
          h.style.left = (cx + (Math.random() - 0.5) * 80) + 'px';
          h.style.bottom = (window.innerHeight - r.top - 10) + 'px';
          h.style.setProperty('--dx', ((Math.random() - 0.5) * 220) + 'px');
          h.style.setProperty('--rot', ((Math.random() - 0.5) * 60) + 'deg');
          h.style.setProperty('--dur', (2.4 + Math.random() * 1.6) + 's');
          h.style.opacity = '0';
          h.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-heart-fill"/></svg>';
          layer.appendChild(h);
          h.addEventListener('animationend', function () { h.remove(); });
        }, i * 70);
      })(i);
    }
  }

  /* ---------- Header heart ---------- */
  var heartToggle = $('#heartToggle');
  heartToggle.addEventListener('click', function () {
    var on = heartToggle.getAttribute('aria-pressed') !== 'true';
    heartToggle.setAttribute('aria-pressed', String(on));
    heartToggle.classList.remove('pop');
    void heartToggle.offsetWidth;
    heartToggle.classList.add('pop');
    if (on) burst(heartToggle, 6);
  });

  /* ---------- Modal ---------- */
  var modal = $('#modal');
  var modalTitle = $('#modalTitle');
  var modalText = $('#modalText');
  var modalClose = $('#modalClose');
  var lastFocus = null;

  function openModal(title, text, trigger) {
    lastFocus = trigger;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.hidden = false;
    modalClose.focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  /* ---------- CTAs ---------- */
  var forgiveBtn = $('#forgiveBtn');
  var yesBtn = $('#yesBtn');

  forgiveBtn.addEventListener('click', function () {
    burst(forgiveBtn, 10);
    var next = document.getElementById('apology');
    setTimeout(function () {
      next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }, 350);
  });

  yesBtn.addEventListener('click', function () {
    burst(yesBtn, 22);
    setTimeout(function () {
      openModal('Thank you', 'Thank you for giving us a fresh start. I promise to make it count.', yesBtn);
    }, 500);
  });
})();
