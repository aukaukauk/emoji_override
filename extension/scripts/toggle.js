(() => {
  const KEY = 'enabled';
  const root = document.documentElement;

  function apply(enabled) {
    if (!root) return;
    if (enabled) {
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

  function readInitialState() {
    try {
      chrome.storage.sync.get([KEY], (data) => {
        const enabled = data && Object.prototype.hasOwnProperty.call(data, KEY)
          ? Boolean(data[KEY])
          : true;
        apply(enabled);
      });
    } catch (error) {
      apply(true);
    }
  }

  function subscribe() {
    try {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'sync' || !changes[KEY]) return;
        apply(Boolean(changes[KEY].newValue));
      });
    } catch (error) {
      // ignore
    }
  }

  readInitialState();
  subscribe();
})();
