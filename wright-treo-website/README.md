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
- `api/demo-request.js` — Vercel serverless function that emails demo-form submissions via [Resend](https://resend.com)

## Demo form setup (required before deploying)

The demo request form posts to `/api/demo-request`, which sends an email through Resend. Set these
environment variables in the Vercel project (Project Settings → Environment Variables) before going live:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from your [Resend](https://resend.com) account |
| `DEMO_TO_EMAIL` | Inbox that should receive demo requests |
| `DEMO_FROM_EMAIL` | Sender address on a domain verified with Resend (e.g. `Wright Treo <demo@wrightterminal.com>`) |

Without all three set, submissions fail with a visible error on the form (nothing is silently dropped —
the function logs and returns an error instead of pretending to succeed).

The serverless function has no npm dependencies (uses the platform's built-in `fetch`), so no build step
is required beyond deploying the repo as-is.

## Known placeholders (confirm before shipping)

- Leadership bios (Jack, Rory) are still first-draft filler text.
- "Download" routes to the demo form (no public installer exists yet — Wright Terminal is provisioned per account).
