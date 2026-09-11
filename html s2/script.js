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

function addDeviceRow(name, type) {
  const list = document.querySelector('.device-list');
  const row = document.createElement('article');
  const icon = document.createElement('span');
  const details = document.createElement('span');
  const title = document.createElement('strong');
  const meta = document.createElement('small');
  const health = document.createElement('span');
  const dot = document.createElement('i');
  const menu = document.createElement('button');
  row.className = 'device-row';
  icon.className = `device-icon ${type === 'Laptop' ? 'laptop' : 'phone'}`;
  icon.textContent = type === 'Laptop' ? '▤' : '▣';
  details.className = 'device-details';
  title.textContent = name;
  meta.textContent = `${type} · Added just now`;
  details.append(title, meta);
  health.className = 'device-health healthy';
  dot.textContent = '';
  health.append(dot, document.createTextNode('Healthy'));
  menu.className = 'row-more';
  menu.type = 'button';
  menu.setAttribute('aria-label', `${name} options`);
  menu.textContent = '...';
  row.append(icon, details, health, menu);
  list.append(row);
  bindRowMenus(row);
}

function bindRowMenus(scope = document) {
  scope.querySelectorAll('.row-more').forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => showToast(`${button.getAttribute('aria-label').replace(' options', '')}: options are ready.`));
  });
}

function openModal(mode) {
  const isNumber = mode === 'number';
  modalBackdrop.hidden = false;
  document.querySelector('.device-form').hidden = isNumber;
  document.querySelector('.number-form').hidden = !isNumber;
  document.querySelector('#modal-title').textContent = isNumber ? 'Monitor a number' : 'Add a device';
  document.querySelector('[data-modal-kicker]').textContent = isNumber ? 'Call activity' : 'Expand your view';
  document.querySelector('[data-modal-copy]').textContent = isNumber
    ? 'Add a phone number you own or are authorized to monitor. New activity will appear in your call log after verification.'
    : 'Add a device you own or are authorized to monitor. Traceboard will check it on the next sync.';
}

document.querySelectorAll('[data-action="add-device"]').forEach((button) => {
  button.addEventListener('click', () => openModal('device'));
});

document.querySelector('[data-action="monitor-number"]')?.addEventListener('click', () => openModal('number'));

document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.querySelector('.device-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.currentTarget.elements.deviceName.value.trim();
  const type = event.currentTarget.elements.deviceType.value;
  if (!name) return;
  closeModal();
  addDeviceRow(name, type);
  showToast(`${name} added. It will appear after the next sync.`);
  event.currentTarget.reset();
});

document.querySelector('.number-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const label = form.elements.phoneLabel.value.trim();
  const number = form.elements.phoneNumber.value.trim();
  if (!label || !number) return;
  closeModal();
  showToast(`${label} (${number}) added for monitoring.`);
  form.reset();
});

document.querySelectorAll('.filter').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    const selected = filter.dataset.filter;
    document.querySelectorAll('.call-row').forEach((row) => {
      row.hidden = selected !== 'all' && row.dataset.type !== selected;
    });
  });
});

document.querySelector('[data-action="export"]')?.addEventListener('click', () => showToast('Call log export prepared for download.'));
document.querySelector('[data-action="load-calls"]')?.addEventListener('click', () => showToast('Showing the most recent 28 calls.'));
document.querySelector('[data-action="notifications"]')?.addEventListener('click', () => document.querySelector('#alerts').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('[data-action="mark-read"]')?.addEventListener('click', () => {
  document.querySelectorAll('.alert-row').forEach((row) => row.remove());
  document.querySelector('.alert-count').textContent = '0';
  showToast('All security alerts marked as read.');
});

document.querySelectorAll('.dismiss').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.alert-row').remove();
    const count = document.querySelector('.alert-count');
    count.textContent = String(Math.max(0, Number(count.textContent) - 1));
    showToast('Alert dismissed and recorded in the audit trail.');
  });
});

document.querySelectorAll('[data-restore]').forEach((button) => {
  button.addEventListener('click', () => {
    const platform = button.dataset.restore;
    button.disabled = true;
    button.textContent = 'Queued';
    button.closest('.recovery-row').querySelector('.recovery-status').textContent = 'Restore queued';
    button.closest('.recovery-row').querySelector('.recovery-status').className = 'recovery-status pending';
    const count = document.querySelector('.recovery-count');
    count.textContent = String(Math.max(0, Number(count.textContent) - 1));
    showToast(`${platform} recovery request queued for account verification.`);
  });
});

const toolMessages = {
  case: 'Case file workspace opened. Add an authorized case ID to continue.',
  evidence: 'Evidence locker opened. Record the source and preserve the original file.',
  chain: 'Chain-of-custody log opened for authorized evidence handoffs.',
  report: 'Case report export prepared from the current audit trail.',
  sync: 'Authorized records synced. Last sync updated just now.',
  consent: 'Consent register opened. Review scope before collecting records.',
  integrity: 'Evidence fingerprints checked. Original files remain unchanged.',
  note: 'Incident note editor opened for the active case timeline.'
};

document.querySelectorAll('[data-tool]').forEach((button) => {
  button.addEventListener('click', () => showToast(toolMessages[button.dataset.tool]));
});

document.querySelector('.profile-search')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const platform = form.elements.profilePlatform.value;
  const query = form.elements.profileQuery.value.trim().toLowerCase();
  const results = [...document.querySelectorAll('.profile-result')];
  let matches = 0;
  results.forEach((result) => {
    const matchesPlatform = platform === 'all' || result.dataset.platform === platform;
    const matchesQuery = !query || result.textContent.toLowerCase().includes(query);
    result.hidden = !(matchesPlatform && matchesQuery);
    if (!result.hidden) matches += 1;
  });
  showToast(matches ? `${matches} authorized profile${matches === 1 ? '' : 's'} found.` : 'No saved authorized profiles matched.');
});

document.querySelector('.mobile-menu')?.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    document.querySelector('.sidebar').classList.remove('open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

bindRowMenus();
