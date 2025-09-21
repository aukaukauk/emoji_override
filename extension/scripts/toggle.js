(() => {
  const KEY = 'enabled';
  const root = document.documentElement;

  function apply(enabled) {
    if (!root) return;
    if (enabled) root.classList.add('noto-emoji-enabled');
    else root.classList.remove('noto-emoji-enabled');
    try {
      if (enabled) {
        window.__NotoEmoji && window.__NotoEmoji.start && window.__NotoEmoji.start();
      } else {
        window.__NotoEmoji && window.__NotoEmoji.stop && window.__NotoEmoji.stop();
      }
    } catch (e) {}
  }

  try {
    chrome.storage.sync.get([KEY], (data) => {
      const enabled = data && Object.prototype.hasOwnProperty.call(data, KEY)
        ? Boolean(data[KEY])
        : true; // 默认开启
      apply(enabled);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync' || !changes[KEY]) return;
      apply(Boolean(changes[KEY].newValue));
    });
  } catch (e) {
    // 在某些限制环境下，尽量不影响页面
  }
})();
