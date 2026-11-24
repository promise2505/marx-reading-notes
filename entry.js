// Run in <head>, before the browser restores a previous reading position.
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  let interacted = false;
  const stopReset = () => { interacted = true; };
  for (const event of ['pointerdown', 'touchstart', 'wheel', 'keydown']) {
    window.addEventListener(event, stopReset, { passive: true, once: true });
  }
  const positionEntry = () => {
    if (interacted) return;
    // With manual restoration, explicitly position valid chapter links too.
    let chapter = null;
    if (location.hash) {
      try { chapter = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
      catch { return; }
      if (!chapter) return;
    }
    // Override CSS smooth scrolling so entry never animates through the page.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    if (chapter) chapter.scrollIntoView({ block: 'start', behavior: 'auto' });
    else window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  };
  document.addEventListener('DOMContentLoaded', positionEntry, { once: true });
  window.addEventListener('pageshow', () => {
    positionEntry();
    // Embedded browsers can restore scroll after pageshow; check once more
    // at the next paint, without interrupting someone who has started reading.
    requestAnimationFrame(positionEntry);
  });
})();
