/* ═══════════════════════════════════════════════════════════════
   KAGO ATELIER — Shared Navigation + Page Transitions
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Page entrance animation ── */
  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.page-wrap');
    if (wrap) {
      requestAnimationFrame(function () {
        wrap.classList.add('visible');
      });
    }

    initNav();
    initMobileMenu();
    markActiveLink();
  });

  /* ── Navigation scroll behaviour ── */
  function initNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var isHero = nav.classList.contains('starts-transparent');

    function update() {
      if (!isHero) return;
      if (window.scrollY > 60) {
        var theme = nav.dataset.scrollTheme || 'dark';
        nav.className = 'site-nav ' + theme;
      } else {
        nav.className = 'site-nav transparent';
      }
    }

    if (isHero) {
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  /* ── Mobile hamburger ── */
  function initMobileMenu() {
    var burger = document.querySelector('.nav-burger');
    var menu   = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Highlight active nav link ── */
  function markActiveLink() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === page || (page === '' && href === 'index.html') ||
          (page === 'index.html' && href === './') ||
          (href !== 'index.html' && href !== './' && page.startsWith(href.replace('.html', '')))) {
        a.classList.add('active');
      }
    });
  }

  /* ── Smooth page-exit transition ── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || a.target === '_blank') return;

    e.preventDefault();
    var wrap = document.querySelector('.page-wrap');
    if (wrap) {
      wrap.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      wrap.style.opacity = '0';
      wrap.style.transform = 'translateY(-8px)';
    }
    setTimeout(function () { window.location.href = href; }, 300);
  });

})();
