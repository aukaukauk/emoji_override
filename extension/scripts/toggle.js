(() => {
  const KEY_ENABLED = 'enabled';
  const KEY_BLOCKED = 'blockedHosts';
  const root = document.documentElement;
  const host = (location.hostname || '').toLowerCase();

  let lastActive = null;

  function normalizeList(list) {
    if (!Array.isArray(list)) return [];
    return [...new Set(list.map((item) => (typeof item === 'string' ? item.toLowerCase() : '')))].filter(Boolean);
  }

  function setActive(shouldEnable) {
    if (shouldEnable === lastActive) return;
    lastActive = shouldEnable;

    if (!root) return;

    if (shouldEnable) {
      root.classList.add('noto-emoji-enabled');
      if (window.__NotoEmojiWrapper && typeof window.__NotoEmojiWrapper.start === 'function') {
        window.__NotoEmojiWrapper.start();
      }
    } else {
      root.classList.remove('noto-emoji-enabled');
      if (window.__NotoEmojiWrapper && typeof window.__NotoEmojiWrapper.stop === 'function') {
        window.__NotoEmojiWrapper.stop();
      }
    }
  }

  function evaluateState(data) {
    const enabled = data && Object.prototype.hasOwnProperty.call(data, KEY_ENABLED)
      ? Boolean(data[KEY_ENABLED])
      : true;

    const blockedHosts = normalizeList(data ? data[KEY_BLOCKED] : []);
    const isBlocked = host && blockedHosts.includes(host);

    setActive(enabled && !isBlocked);
  }

  function readInitialState() {
    try {
      chrome.storage.sync.get([KEY_ENABLED, KEY_BLOCKED], evaluateState);
    } catch (error) {
      setActive(true);
    }
  }

  function subscribe() {
    try {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'sync') return;
        if (!changes[KEY_ENABLED] && !changes[KEY_BLOCKED]) return;
        chrome.storage.sync.get([KEY_ENABLED, KEY_BLOCKED], evaluateState);
      });
    } catch (error) {
      // ignore
    }
  }

  readInitialState();
  subscribe();
})();
