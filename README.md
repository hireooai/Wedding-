# Abhishek weds Pranjal — wedding website

A static site with no build step. Open `index.html` through any web server, or upload the whole folder to a static host.

## Edit dates, times and venue
Everything lives in the `WEDDING` object at the top of `js/main.js`:
- `events[]`: the title, `start`/`end` (local time, `YYYY-MM-DDTHH:MM`), the label shown on the card, and the description.
- The event marked `main: true` drives the countdown and every date printed on the page (hero, save-the-date, envelope card).
- `venue.directionsUrl` / `venue.mapUrl`: paste your exact Google Maps share link here if you prefer it to the name search.

## Change text or layout
Edit `src/index.template.html`, then run:

```
python3 src/build.py
```

That writes `index.html`, with the Ganesha line art inlined so it can animate.

## Font
The card uses **Delfina Script**, which is a commercial font. The site uses **Kaushan Script**, the closest free match. If you own a Delfina web licence, put `DelfinaScript.woff2` in `assets/fonts/` and uncomment the `@font-face` block at the top of `css/style.css`.

## Publish for guests
Drag this folder onto Netlify Drop (app.netlify.com/drop), or push it to GitHub Pages or Vercel. Any static host works.
