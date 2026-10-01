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

Temporary (dev): `about:debugging#/runtime/this-firefox` → **Load Temporary
Add-on** → select `manifest.json`. Unloads on restart.

Permanent: Firefox requires a **Mozilla-signed** `.xpi`; release Firefox
refuses unsigned installs. Self-distribute through addons.mozilla.org:

1. Sign in at addons.mozilla.org → Developer Hub → become a developer.
2. **Submit a new add-on** → upload a zip of `manifest.json` + `content.js`.
3. Choose **self-distribution** (private, automated validation only, no
   human review, invisible in search).
4. Download the signed `.xpi` and drag it onto Firefox → install
   permanently. Keep the `.xpi` somewhere (e.g. a GitHub Release).

Alternative, from the CLI with Developer Hub API keys:

```sh
npx web-ext sign --api-key=<key> --api-secret=<secret> --channel=unlisted
```

**After any code change:** bump `version` in `manifest.json`, re-sign, and
reinstall — Firefox signatures are bound to the file hash.

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