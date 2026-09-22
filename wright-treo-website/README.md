# Wright Treo Limited — marketing site

Public-facing marketing site for Wright Treo Limited, the company behind [Wright Terminal](/Users/jackstapleton/wright-terminal). This is the storefront/brochure site — not the product itself.

## Local preview

```
python3 -m http.server 8020
```

Then open `http://localhost:8020`. (Or use the Browser pane, which is wired up via `.claude/launch.json`.)

## Structure

- `index.html` — single-page site
- `assets/css/styles.css` — design system, reusing the terminal's exact color/type tokens
- `assets/js/app.js` — nav toggle, ticker, scroll reveal, demo form handling

## Known placeholders (confirm before shipping)

- Leadership bios (Jack, Rory) are still first-draft filler text.
- "Download" routes to the demo form (no public installer exists yet — Wright Terminal is provisioned per account).
- Demo request form is front-end only — not yet wired to an email/CRM/backend.
