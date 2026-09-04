const modalBackdrop = document.querySelector('.modal-backdrop');
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function closeModal() {
  modalBackdrop.hidden = true;
}

document.querySelector('[data-action="add-account"]')?.addEventListener('click', () => {
  modalBackdrop.hidden = false;
});

document.querySelector('[data-action="new-post"]')?.addEventListener('click', () => {
  showToast('Post composer is ready for your next idea.');
});

document.querySelector('[data-action="view-calendar"]')?.addEventListener('click', () => {
  showToast('Calendar view is coming next.');
});

document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.querySelectorAll('[data-platform]').forEach((button) => {
  button.addEventListener('click', () => {
    const route = button.dataset.platform === 'TikTok' ? '/auth/tiktok' : '/auth/meta';
    window.location.href = route;
  });
});

async function loadConnectionStatus() {
  try {
    const response = await fetch('/api/status');
    const status = await response.json();
    if (!status.meta || !status.tiktok) {
      showToast('Add API credentials to enable live account connections.');
    }
  } catch (error) {
    showToast('Start Pulseboard with the Node server for live connections.');
  }
}

const connection = new URLSearchParams(window.location.search).get('connection');
if (connection === 'received') showToast('Authorization received. Token exchange is ready for your backend.');
if (connection === 'missing-config') showToast('Add the platform credentials in your environment file first.');
if (connection === 'cancelled') showToast('Account connection was cancelled.');
loadConnectionStatus();

document.querySelector('.mobile-menu')?.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    document.querySelector('.sidebar').classList.remove('open');
  });
});

document.querySelector('.service-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const link = form.elements.profileLink.value.trim();
  const platform = form.elements.platform.value;
  const allowedHosts = {
    Instagram: ['instagram.com', 'www.instagram.com'],
    Facebook: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
    TikTok: ['tiktok.com', 'www.tiktok.com']
  };

  try {
    const url = new URL(link);
    const hostMatches = allowedHosts[platform]?.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    if (!['http:', 'https:'].includes(url.protocol) || !hostMatches) {
      showToast(`Paste a valid ${platform} profile link.`);
      return;
    }
  } catch (error) {
    showToast('Paste a complete profile link, including https://.');
    return;
  }

  showToast('Request received. We will review the profile and reply soon.');
  form.reset();
});