// GitHub Mark Viewed
// Press "q" on a pull request "Files changed" page to mark the file you are
// currently looking at as viewed, and let GitHub collapse it.
//
// Selectors are GitHub's own stable hooks, not hashed CSS classes:
//   - file container: div with id = diff-<content sha> (GitHub's diff anchor,
//     e.g. #diff-a1b2c3...). The pure-hex id excludes impostor containers
//     like diff-comparison-viewer-container (the whole page) and
//     diff-file-tree-filter.
//   - viewed toggle:  button[aria-pressed][aria-label*="Viewed"]
//     (aria-label flips between "Not Viewed" and "Viewed"; a legacy
//     .js-reviewed-checkbox is kept as fallback)
// If GitHub renames both, the worst case is the shortcut silently does
// nothing — no clicks land on the wrong element.

const FILE_ID = /^diff-[0-9a-f]{40,64}$/;

// GitHub pins the header of the file you are scrolled into at the top of the
// viewport, so the "file in focus" is the one whose container top sits at the
// top edge of the screen (its sticky header). That is true even mid-scroll
// deep inside a tall file — which a "biggest visible area" heuristic gets
// wrong.
function currentFile() {
  const files = [...document.querySelectorAll('div[id^="diff-"]')].filter(
    (file) => FILE_ID.test(file.id)
  );
  if (!files.length) return null;

  let best = null;
  let bestTop = -Infinity;
  for (const file of files) {
    const top = file.getBoundingClientRect().top;
    // Pinned header: top is at/near the viewport's top edge (GitHub keeps a
    // small negative offset when stuck). Pick the lowest such file.
    if (top <= 8 && top > bestTop) {
      bestTop = top;
      best = file;
    }
  }
  if (best) return best;

  // Nothing pinned yet (e.g. very top of the page): pick the topmost file
  // whose top edge is on screen.
  bestTop = Infinity;
  for (const file of files) {
    const top = file.getBoundingClientRect().top;
    if (top >= 0 && top < bestTop) {
      bestTop = top;
      best = file;
    }
  }
  return best;
}

const KEY = "q";

function isEditable(el) {
  return (
    el &&
    (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
  );
}

function markViewed() {
  const best = currentFile();
  if (!best) return false;

  const toggle =
    best.querySelector('button[aria-pressed][aria-label*="Viewed" i]') ??
    best.querySelector(".js-reviewed-checkbox");
  if (!toggle) return false;
  // Already viewed (e.g. a viewed file was manually re-expanded) — never
  // un-view on the same keypress.
  if (toggle.getAttribute("aria-pressed") === "true") return false;

  toggle.click();
  return true;
}

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key.toLowerCase() !== KEY) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    if (e.defaultPrevented) return;
    if (isEditable(e.target)) return; // don't fire while typing in a field
    if (markViewed()) e.preventDefault();
  },
  true // capture: runs before GitHub's own hotkey handling
);