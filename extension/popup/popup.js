const KEY = 'enabled';

function setEnabled(enabled) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [KEY]: Boolean(enabled) }, () => resolve());
  });
}

function getEnabled() {
  return new Promise((resolve) => {
    chrome.storage.sync.get([KEY], (data) => {
      const value = data && Object.prototype.hasOwnProperty.call(data, KEY)
        ? Boolean(data[KEY])
        : true; // 默认开启
      resolve(value);
    });
  });
}

function render(btn, statusEl, enabled) {
  btn.classList.toggle('enabled', enabled);
  btn.classList.toggle('disabled', !enabled);
  btn.textContent = enabled ? 'Disable Noto Emoji' : 'Enable Noto Emoji';
  if (statusEl) statusEl.textContent = enabled ? 'Enabled' : 'Disabled';
}

document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('toggleBtn');
  const statusEl = document.getElementById('status');
  let enabled = await getEnabled();
  render(btn, statusEl, enabled);

  btn.addEventListener('click', async () => {
    enabled = !enabled;
    render(btn, statusEl, enabled);
    await setEnabled(enabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[KEY]) return;
    enabled = Boolean(changes[KEY].newValue);
    render(btn, statusEl, enabled);
  });
});
