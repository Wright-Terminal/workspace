// Wright Treo Limited — marketing site
(function () {
  'use strict';

  /* ---------- mobile nav ---------- */
  var navMenuBtn = document.getElementById('navMenuBtn');
  var navLinks = document.getElementById('navLinks');
  if (navMenuBtn && navLinks) {
    navMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('nav-links-open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('nav-links-open');
      });
    });
  }

  /* ---------- illustrative market ticker ---------- */
  var TICKER_ITEMS = [
    { label: 'A320neo', val: 'LRI 1.42', dir: 'up', chg: '+1.2%' },
    { label: '737 MAX-8', val: 'LRI 1.18', dir: 'dn', chg: '-0.4%' },
    { label: 'A350-900', val: 'UTIL 82%', dir: 'up', chg: '+0.6%' },
    { label: '787-9', val: 'LRI 1.63', dir: 'up', chg: '+0.8%' },
    { label: 'A220-300', val: 'LRI 0.71', dir: 'dn', chg: '-0.2%' },
    { label: 'E195-E2', val: 'UTIL 76%', dir: 'up', chg: '+0.3%' }
  ];
  var tickerEl = document.getElementById('mockTicker');
  if (tickerEl) {
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      TICKER_ITEMS.forEach(function (t) {
        html += '<div class="mock-t-item ' + t.dir + '"><span>' + t.label + '</span><b>' + t.val + '</b><span>' + t.chg + '</span></div>';
      });
    }
    tickerEl.innerHTML = html;
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- demo request form ---------- */
  var form = document.getElementById('demoForm');
  var success = document.getElementById('demoSuccess');
  var errorEl = document.getElementById('demoError');
  var successName = document.getElementById('demoSuccessName');
  var submitBtn = document.getElementById('demoSubmit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.textContent = '';

      var name = form.fullName.value.trim();
      var email = form.email.value.trim();
      var company = form.company.value.trim();
      var role = form.role.value;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !company || !role) {
        errorEl.textContent = 'Please fill in your name, work email, company and account type.';
        return;
      }
      if (!emailOk) {
        errorEl.textContent = 'That email address doesn\'t look right — please check it.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email: email,
          company: company,
          role: role,
          notes: form.notes.value.trim()
        })
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error((result.data && result.data.error) || 'Something went wrong. Please try again.');
          }
          form.classList.add('hide');
          successName.textContent = ' ' + name.split(' ')[0];
          success.classList.add('show');
        })
        .catch(function (err) {
          errorEl.textContent = err.message || 'Something went wrong. Please try again.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request a Demo';
        });
    });
  }
})();
