/* ═══════════════════════════════════════════════════════════════
   KAGO ATELIER — Supabase Configuration

   SETUP INSTRUCTIONS:
   1. Go to supabase.com and create a project.
   2. Copy your Project URL and anon public key below.
   3. Run supabase/schema.sql in your Supabase SQL Editor.
   4. Create a storage bucket named "kago-gallery" (public).
   5. Deploy to Netlify and set SUPABASE_URL / SUPABASE_KEY
      as environment variables (optional — or hardcode below).

   NOTE: The anon key is safe to expose in client-side code.
   It is protected by Row Level Security (RLS) policies.
═══════════════════════════════════════════════════════════════ */

var KAGO_CONFIG = {
  /* ── Paste your values here ─────────────────── */
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
  /* ─────────────────────────────────────────── */

  storageBucket: 'kago-gallery',
  bookingEmail:  'styling@kagosatelier.com',
  siteUrl:       'https://kagoatelier.com'
};

/* Initialise client if credentials are present */
var sb = null;
var USE_SUPABASE = (
  KAGO_CONFIG.supabaseUrl  !== 'YOUR_SUPABASE_URL' &&
  KAGO_CONFIG.supabaseKey  !== 'YOUR_SUPABASE_ANON_KEY'
);

if (USE_SUPABASE && window.supabase) {
  try {
    sb = window.supabase.createClient(KAGO_CONFIG.supabaseUrl, KAGO_CONFIG.supabaseKey);
  } catch (e) {
    console.warn('Supabase init failed:', e);
    USE_SUPABASE = false;
  }
}

/* ── Utility helpers ── */
function showToast(msg, type) {
  var area = document.getElementById('toastArea');
  if (!area) return;
  var t = document.createElement('div');
  t.className = 'toast toast-' + (type || 'info');
  t.textContent = msg;
  area.appendChild(t);
  setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4000);
}

function openBookingModal() {
  var m = document.getElementById('bookingModal');
  if (m) m.classList.add('open');
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

/* Close modal on overlay click */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.modal-overlay').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m) m.classList.remove('open');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
        m.classList.remove('open');
      });
    }
  });
});
