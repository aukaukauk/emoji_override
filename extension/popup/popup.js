const KEY_ENABLED = 'enabled';
const KEY_BLOCKED = 'blockedHosts';

function getStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (data) => resolve(data || {}));
  });
}

function setStorage(payload) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(payload, () => resolve());
  });
}

function queryActiveTab() {
  return new Promise((resolve) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(Array.isArray(tabs) && tabs.length ? tabs[0] : null);
      });
    } catch (error) {
      resolve(null);
    }
  });
}

function extractHost(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.hostname.toLowerCase();
    }
  } catch (error) {
    // ignore invalid URL
  }
  return null;
}

function normalizeList(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map((item) => (typeof item === 'string' ? item.toLowerCase() : '')))].filter(Boolean);
}

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusEl = document.getElementById('status');
  const hostNameEl = document.getElementById('hostName');
  const siteStateEl = document.getElementById('siteState');
  const siteBtn = document.getElementById('siteBtn');
  const hintEl = document.getElementById('siteHint');

  const activeTab = await queryActiveTab();
  const currentHost = extractHost(activeTab ? activeTab.url : null);

  let state = await getStorage([KEY_ENABLED, KEY_BLOCKED]);
  let enabled = state.hasOwnProperty(KEY_ENABLED) ? Boolean(state[KEY_ENABLED]) : true;
  let blockedHosts = normalizeList(state[KEY_BLOCKED]);
  let isBlocked = currentHost ? blockedHosts.includes(currentHost) : false;

  hostNameEl.textContent = currentHost || 'Unavailable';
  hintEl.classList.toggle('visible', !currentHost);
  siteBtn.disabled = !currentHost;

  function render() {
    toggleBtn.classList.toggle('enabled', enabled);
    toggleBtn.classList.toggle('disabled', !enabled);
    toggleBtn.textContent = enabled ? 'Disable Noto Emoji' : 'Enable Noto Emoji';
    statusEl.textContent = enabled ? 'Enabled globally' : 'Disabled globally';

    if (!currentHost) {
      siteBtn.textContent = 'Unavailable';
      siteBtn.classList.remove('blocked');
      siteStateEl.textContent = 'Site blocking unavailable.';
      return;
    }

    siteBtn.classList.toggle('blocked', isBlocked);
    siteBtn.textContent = isBlocked ? 'Unblock This Site' : 'Block This Site';
    siteStateEl.textContent = isBlocked ? 'Currently blocked on this site.' : 'Active on this site.';
  }

  render();

  toggleBtn.addEventListener('click', async () => {
    enabled = !enabled;
    render();
    await setStorage({ [KEY_ENABLED]: enabled });
  });

  siteBtn.addEventListener('click', async () => {
    if (!currentHost) return;
    const set = new Set(blockedHosts);
    if (isBlocked) {
      set.delete(currentHost);
      isBlocked = false;
    } else {
      set.add(currentHost);
      isBlocked = true;
    }
    blockedHosts = [...set];
    render();
    await setStorage({ [KEY_BLOCKED]: blockedHosts });
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (changes[KEY_ENABLED]) {
      enabled = Boolean(changes[KEY_ENABLED].newValue);
    }
    if (changes[KEY_BLOCKED]) {
      blockedHosts = normalizeList(changes[KEY_BLOCKED].newValue);
      isBlocked = currentHost ? blockedHosts.includes(currentHost) : false;
    }
    render();
  });
});
