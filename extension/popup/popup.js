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

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');
  toggle.checked = await getEnabled();
  toggle.addEventListener('change', async () => {
    await setEnabled(toggle.checked);
  });
});

