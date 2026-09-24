# NARTI Aircon Service — Website

Static website for NARTI Aircon Service: aircond service, repair, installation and gas top-up in Skudai and Johor Bahru.

- Domain: https://nartiairconservice.com
- Phone / WhatsApp: +60 16-821 0460
- Address: 21, Jalan Pulai 26, Taman Pulai Utama, 81300 Skudai, Johor
Plain HTML, CSS and JavaScript. No build step: upload the files and the site works.

## Folder structure

```
narti-aircon-service/
├── index.html                 # Home page
├── about/                     # /about/ page (service areas live here)
├── aircond-service/           # /aircond-service/ page
├── aircond-repair/            # /aircond-repair/ page
├── aircond-installation/      # /aircond-installation/ page
├── aircond-gas-top-up/        # /aircond-gas-top-up/ page
├── 404.html, .htaccess        # Custom not-found page, caching (Apache hosting)
├── sitemap.xml, robots.txt    # For Google Search Console
├── assets/
│   ├── css/style.css          # All styles (colours and fonts set at the top in :root)
│   ├── js/main.js             # Mobile menu, FAQ accordion, form, scroll effects
│   └── images/                # WebP images; each has -480, -800 and -1536 sizes for srcset
│       ├── brand/             # logo.png, logo-white.png (footer), favicon.png
│       ├── hero/              # Hero technician cut-out
│       ├── about/             # About section collage
│       ├── services/          # Services section photo
│       ├── process/           # "Four simple steps" photos (step-1 … step-4)
│       ├── projects/          # "Our Work" cards
│       ├── why-us/            # "Why choose us" photo
│       ├── faq/               # FAQ section photo
│       ├── blog/              # Article cards
│       └── cta/               # Bottom call-to-action technician cut-out
└── source-images/             # Original full-size PNG uploads (not needed on the live server)
```

## Editing

- **Phone / address:** the header, footer and contact links repeat on all 5 pages. Search every `index.html` for `+60 16-821 0460` / `60168210460`.
- **Brand colours:** change `--navy` and `--orange` at the top of `assets/css/style.css`.
- **Replacing an image:** keep the same file name and folder, or update the `src` in `index.html`.

## Google and Trustpilot ratings

Open `assets/js/main.js` and fill in the `REVIEWS` block at the top:

```js
google:     { rating: 4.9, count: 52, url: 'https://g.page/r/…/review' },
trustpilot: { rating: 4.8, count: 20, url: 'https://www.trustpilot.com/review/nartiairconservice.com' }
```

While `rating` is `null` the badges show "Read our reviews" without stars, so the site never shows a score the business has not earned.

## URLs, SSL and the preferred domain

`.htaccess` makes `https://nartiairconservice.com/` the only address, and every URL ends in `/` with no `.html`:

| Visitor types | Lands on (one 301 redirect) |
|---|---|
| `http://nartiairconservice.com/` | `https://nartiairconservice.com/` |
| `www.nartiairconservice.com/aircond-repair` | `https://nartiairconservice.com/aircond-repair/` |
| `/aircond-service/index.html` | `/aircond-service/` |
| `/aircond-service` | `/aircond-service/` |

Switch on the free SSL certificate in the hosting panel first. Without it, the https redirect shows a browser warning.

## Deploying

Upload `index.html`, `404.html`, `.htaccess`, the four service folders, `sitemap.xml`, `robots.txt` and the `assets/` folder to the hosting's public folder (`public_html`).
`source-images/` does not need to be uploaded.

The "Request a Service" form opens WhatsApp with the customer's details filled in, so no server-side code is needed.
Pages use clean URLs (`/aircond-service/`), which work on any normal web host.
