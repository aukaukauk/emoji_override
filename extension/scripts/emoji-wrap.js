(() => {
  const CLASS_NAME = 'noto-emoji-glyph';
  const EXCLUDE_SELECTOR = 'pre, code, kbd, samp, tt, textarea, input, script, style, svg, math';

  let EMOJI_PATTERN;
  try {
    EMOJI_PATTERN = new RegExp(
      '(?:\\p{Extended_Pictographic}|\\p{Emoji_Presentation})(?:\\uFE0F|\\uFE0E)?(?:\\u200D(?:\\p{Extended_Pictographic}|\\p{Emoji_Presentation})(?:\\uFE0F|\\uFE0E)?)*(?:\\uFE0F)?|\\p{Regional_Indicator}{2}',
      'gu'
    );
  } catch (error) {
    EMOJI_PATTERN = /[\u{1F1E6}-\u{1F1FF}]{2}|[\u{2600}-\u{27BF}]|[\u{1F300}-\u{1FAFF}]|\u200D|\uFE0F|\uFE0E/u;
  }

  let observer = null;
  let active = false;
  let domReady = document.readyState !== 'loading';

  if (!domReady) {
    document.addEventListener('DOMContentLoaded', () => {
      domReady = true;
      if (active) processDocument();
    }, { once: true });
  }

  function containsEmoji(text) {
    if (!text) return false;
    EMOJI_PATTERN.lastIndex = 0;
    return EMOJI_PATTERN.test(text);
  }

  function isEligible(node) {
    const parent = node.parentElement;
    if (!parent) return false;
    if (parent.closest(EXCLUDE_SELECTOR)) return false;
    if (parent.classList.contains(CLASS_NAME)) return false;
    let el = parent;
    while (el) {
      if (el.isContentEditable) return false;
      el = el.parentElement;
    }
    return true;
  }

  function wrapTextNode(node) {
    const text = node.nodeValue;
    if (!text || !containsEmoji(text)) return;
    const doc = node.ownerDocument;
    const fragment = doc.createDocumentFragment();
    EMOJI_PATTERN.lastIndex = 0;
    let lastIndex = 0;

    for (const match of text.matchAll(EMOJI_PATTERN)) {
      const index = match.index || 0;
      if (index > lastIndex) {
        fragment.appendChild(doc.createTextNode(text.slice(lastIndex, index)));
      }
      const span = doc.createElement('span');
      span.className = CLASS_NAME;
      span.textContent = match[0];
      fragment.appendChild(span);
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(doc.createTextNode(text.slice(lastIndex)));
    }

    node.replaceWith(fragment);
  }

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (isEligible(node)) wrapTextNode(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.closest && node.closest(EXCLUDE_SELECTOR)) return;
    if (node.classList && node.classList.contains(CLASS_NAME)) return;

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode(current) {
        if (!current.nodeValue || current.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT;
        if (!isEligible(current)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(wrapTextNode);
  }

  function processDocument() {
    if (!domReady) return;
    processNode(document.body || document.documentElement);
  }

  function handleMutations(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const target = mutation.target;
        if (target.nodeType === Node.TEXT_NODE && isEligible(target)) wrapTextNode(target);
        continue;
      }

      for (const added of mutation.addedNodes) {
        if (added.nodeType === Node.TEXT_NODE) {
          if (isEligible(added)) wrapTextNode(added);
        } else if (added.nodeType === Node.ELEMENT_NODE) {
          processNode(added);
        }
      }
    }
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  function unwrapAll() {
    const wrapped = document.querySelectorAll('span.' + CLASS_NAME);
    wrapped.forEach((span) => {
      const text = span.textContent || '';
      span.replaceWith(document.createTextNode(text));
    });
  }

  function start() {
    if (active) return;
    active = true;
    if (domReady) processDocument();
    startObserver();
  }

  function stop() {
    if (!active) return;
    active = false;
    stopObserver();
    if (domReady) unwrapAll();
  }

  window.__NotoEmojiWrapper = {
    start,
    stop
  };
})();
