# NARTI Aircon Service — Website

Static website for NARTI Aircon Service (aircond servicing, repair and installation, Klang Valley).
Plain HTML, CSS and JavaScript. No build step: upload the files and the site works.

## Folder structure

```
narti-aircon-service/
├── index.html                 # Home page
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

- **Phone / email / address:** search `index.html` for `+60 12 345 6789` and `hello@narti.com.my`.
- **Brand colours:** change `--navy` and `--orange` at the top of `assets/css/style.css`.
- **Replacing an image:** keep the same file name and folder, or update the `src` in `index.html`.

## Deploying

Upload `index.html` and the `assets/` folder to the hosting's public folder (`public_html`).
`source-images/` does not need to be uploaded.

> The "Request a Service" form currently shows a thank-you message only.
> Connect it to email, WhatsApp or a form service before going live.
