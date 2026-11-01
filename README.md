# AI Project Guide + Prompt Studio  —  FARVO Digital Company

Bilingual (English / தமிழ்) learning site that teaches students to build a full project with ChatGPT + Claude in 7 steps,
now with **Prompt Studio**: type a project name, pick options, get a complete Claude prompt.

Pure HTML + CSS + JavaScript. **No build step, no dependencies.**

## Deploy on Vercel (2 ways)
**A. Drag & drop (easiest)**
1. Go to https://vercel.com/new  -> "Deploy" a folder / or use GitHub import.
2. Upload this folder (the one that contains `index.html` and `vercel.json`).
3. Framework Preset: **Other**. Build Command: *(empty)*. Output Directory: *(empty / `.`)*.
4. Deploy. Done.

**B. GitHub**
1. Push this folder to a GitHub repo.
2. Vercel -> Add New Project -> import the repo -> Framework **Other** -> Deploy.

**After the first deploy:** open `index.html`, find `YOUR-DOMAIN.vercel.app` in the `og:image` meta tag and replace it
with your real domain (this makes WhatsApp / LinkedIn previews show the FARVO logo). Then redeploy.

## Run locally
Double-click `index.html`, or `python3 -m http.server 8000` and open http://localhost:8000
(Google Fonts need internet; everything else works offline. Clipboard "Copy" works on https/localhost.)

## Prompt Studio
- Auto-detects project type from the name (College, Hospital, Shop, Library, Hotel, Restaurant, Gym, Inventory, Other); you can override it manually.
- Frontend-only (HTML/CSS/JS) or PHP + MySQL (XAMPP).
- Theme colour, real photos, dark/light toggle, animations, charts, CSV/print, beginner code comments, ZIP delivery.
- Generated prompt includes strict "no-error" rules: no ES modules/fetch on `file://`, script order, relative paths, localStorage safety, a self-check list.
- Copy, Download .txt, Open Claude. Your last inputs are remembered in the browser.
- To add a new project type: add an entry to `G` at the top of `js/studio.js`.

## Features
- Light / Dark toggle (circular reveal animation, remembers choice, no flash on load)
- Scroll-reveal animations, animated logo glow, floating hero, scroll progress bar (all disabled for `prefers-reduced-motion`)
- English / Tamil switcher, 7 steps with checklists and progress

## Structure
```
index.html
vercel.json            (security headers + cache)
css/style.css
js/data.js             (STEPS, FAQ, UI text – edit content here)
js/app.js              (guide, theme, language, animations)
js/studio.js           (Prompt Studio)
assets/images/         (farvo-logo.png, founder.jpg, hero.jpg, step1-7.jpg/svg, favicons, og-image.jpg)
```

## Replace images
- Founder photo: `assets/images/founder.jpg` (square, ~600x600, face centred in the upper-middle).
- Logo: `farvo-logo.png` (512), `farvo-logo-192.png`, `favicon-32.png`, `favicon-64.png`, `apple-touch-icon.png`, `og-image.jpg` (1200x630).

## Built by FARVO Digital Company
- Company: https://farvodigital.netlify.app
- Personal: https://farvodigital.netlify.app/personal
- LinkedIn: https://www.linkedin.com/in/mohamedfarhan-it
