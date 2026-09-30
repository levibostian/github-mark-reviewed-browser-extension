# GitHub Mark Viewed

Press **Q** on a pull request **Files changed** page to mark the file you are
currently looking at as **Viewed**. GitHub does the collapsing — this extension
just clicks the same "Viewed" button you would click by hand.

No config, no options page, no permissions. Install, enable, done.

## What it does

- The file "in focus" is the one GitHub itself pins at the top of your
  viewport while you scroll (its sticky file header). This stays correct even
  when you are deep inside a tall file.
- Pressing `q` marks that file viewed and lets GitHub collapse it, so the next
  file rises into place. Scroll, press `q`, repeat.
- Safe guards: does nothing while you are typing in any text field (GitHub's
  comment box, the file filter, code editor), and never toggles a file that is
  already viewed back to unviewed.

`q` was chosen because GitHub does not use it on the Files changed tab
(audited against GitHub's published shortcut list and verified live there).

## Install

### Brave / Chrome (Chromium)

1. Open `brave://extensions` (or `chrome://extensions`).
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this folder.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `manifest.json` from this folder.

Note: Firefox temporary add-ons unload when Firefox restarts, so re-load it
after a restart. (Permanent installation requires signing through
addons.mozilla.org, which is out of scope for this personal extension.)

## Files

- `manifest.json` — MV3 manifest; works in both Chromium and Firefox
  (`browser_specific_settings.gecko.id` is required for Firefox).
- `content.js` — the whole extension. Uses GitHub's own stable hooks
  (`div#diff-<sha>` anchors and the `aria-pressed`/`aria-label="Not Viewed"`
  toggle) instead of hashed CSS classes, so it should keep working across
  GitHub redesigns. If a future GitHub change breaks both hooks, the worst
  case is the shortcut silently stops working — it never clicks the wrong
  thing.

## Changing the key

Edit one line in `content.js`:

```js
const KEY = "q";
```

Only non-modifier keypresses are accepted, and only when focus is not in a
text field, so most keys are safe choices.