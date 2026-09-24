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
├── aircond-service/           # /aircond-service/ page
├── aircond-repair/            # /aircond-repair/ page
├── aircond-installation/      # /aircond-installation/ page
├── aircond-gas-top-up/        # /aircond-gas-top-up/ page
├── sitemap.xml, robots.txt    # For Google Search Console
├── assets/
│   ├── css/style.css          # All styles (colours and fonts set at the top in :root)
│   ├── js/main.js             # Mobile menu, FAQ accordion, form, scroll effects
│   └── images/                # Optimised WebP images used by the site
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

## Deploying

Upload `index.html`, the four service folders, `sitemap.xml`, `robots.txt` and the `assets/` folder to the hosting's public folder (`public_html`).
`source-images/` does not need to be uploaded.

The "Request a Service" form opens WhatsApp with the customer's details filled in, so no server-side code is needed.
Pages use clean URLs (`/aircond-service/`), which work on any normal web host.
