<div align="center">

# 🌌 NASA APOD

### `ASTRONOMY PICTURE OF THE DAY`

**A cinematic window into the universe — powered by NASA.**

<br>

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-Visit_Project-0b1220?style=for-the-badge)](https://kawishjaykar91-beep.github.io/nasa-apod/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-0b1220?style=for-the-badge&logo=github)](https://github.com/kawishjaykar91-beep/nasa-apod)
[![NASA API](https://img.shields.io/badge/API-NASA_APOD-0b1220?style=for-the-badge)](https://api.nasa.gov/)

<br>

![Status](https://img.shields.io/badge/STATUS-LIVE-22c55e?style=flat-square)
![Built With](https://img.shields.io/badge/BUILT_WITH-VANILLA_JS-3178c6?style=flat-square)
![Vite](https://img.shields.io/badge/VITE-8.x-646cff?style=flat-square&logo=vite)
![GitHub Pages](https://img.shields.io/badge/DEPLOYED-GITHUB_PAGES-181717?style=flat-square&logo=github)

</div>

---

## 🛰️ Mission Brief

**NASA APOD** is a cinematic web experience built around NASA's **Astronomy Picture of the Day API**.

Every day, NASA publishes a different view of the universe — from distant galaxies and nebulae to planets, spacecraft, and other astronomical phenomena.

This project turns that daily data into an immersive interface rather than a simple API demo.

> **The goal:** make exploring NASA's archive feel like navigating a small piece of mission control.

---

## 🌠 Live Experience

### 🚀 [Launch NASA APOD →](https://kawishjaykar91-beep.github.io/nasa-apod/)

The live application includes:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│       NASA · PLANETARY SCIENCE                      │
│                                                     │
│       ASTRONOMY PICTURE OF THE DAY                  │
│                                                     │
│       Explore the universe through NASA's archive   │
│                                                     │
│   ◀ PREVIOUS    [ 2026-09-20 ]    TODAY    NEXT ▶  │
│                                                     │
│       ┌─────────────────────────────────────┐       │
│       │                                     │       │
│       │          NASA APOD MEDIA            │       │
│       │                                     │       │
│       └─────────────────────────────────────┘       │
│                                                     │
│       Astronomy explanation & metadata              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# ✨ Core Systems

### 🌌 Cinematic Space Interface

The interface is built around a deep-space visual system rather than a standard card-based tutorial design.

- Layered radial nebula gradients
- Multiple star fields
- Atmospheric glow effects
- Glassmorphism
- NASA-inspired telemetry styling
- Orbitron display typography
- Inter editorial typography
- Cinematic image presentation
- Responsive layouts

---

### 🕰️ APOD Time Machine

The project isn't limited to today's picture.

The **Time Machine** lets you navigate NASA's archive directly from the interface.

```text
        ┌──────────┐
        │ PREVIOUS │
        └────┬─────┘
             │
             ▼
      ┌───────────────┐
      │  APOD DATE    │
      │  2026-09-19   │
      └───────────────┘
             │
             ▼
        ┌──────────┐
        │   NEXT   │
        └──────────┘
```

### Navigation features

- 📅 Native date picker
- ⏮️ Previous day
- ⏭️ Next day
- 🏠 Return to today
- 🔗 Shareable date URLs
- 🔙 Browser Back support
- 🔜 Browser Forward support
- 📆 Leap-year and month-boundary handling
- 🚫 Next button automatically disabled on today's APOD

Example:

```text
https://kawishjaykar91-beep.github.io/nasa-apod/?date=2026-09-19
```

---

# 🧠 Architecture

The application uses a lightweight **Vanilla JavaScript architecture**.

```text
                         ┌──────────────────┐
                         │     Browser      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    main.js       │
                         │                  │
                         │  State + Events  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             ┌──────────────┐           ┌──────────────┐
             │ URL / History│           │ NASA APOD API│
             └──────┬───────┘           └──────┬───────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   APOD Panel     │
                         │                  │
                         │ Image / Video    │
                         │ Title            │
                         │ Date             │
                         │ Explanation      │
                         └──────────────────┘
```

### Static shell architecture

The page shell is created **once**.

Only the inner APOD panel changes during navigation.

This prevents the date picker and navigation controls from being destroyed and recreated every time a new APOD loads.

---

# 🎨 Design System

The visual system is built entirely with CSS.

### Typography

```text
DISPLAY
Orbitron
│
├── NASA telemetry
├── Dates
└── Navigation controls

BODY
Inter
│
├── Explanations
├── Descriptions
└── Supporting content
```

### Visual language

```text
Deep Space
    ↓
Nebula
    ↓
Glass
    ↓
Telemetry
    ↓
Editorial
    ↓
Cinematic
```

---

# ⚡ Loading Experience

The loading state uses a custom CSS orbital system.

```text
             ◯
          ╱     ╲
        ◯    •    ◯
          ╲     ╱
             ◯
```

Instead of a generic spinner, the interface uses:

- Concentric orbital rings
- Opposite rotation
- Central pulse
- Reduced-motion fallback

---

# ♿ Accessibility

Accessibility isn't treated as an afterthought.

The application includes:

- Semantic HTML
- Accessible navigation labels
- Keyboard-friendly controls
- `:focus-visible` states
- Hidden labels for form controls
- Image `alt` text
- ARIA live regions
- Reduced-motion support
- Responsive touch targets

Users who enable:

```css
prefers-reduced-motion: reduce
```

receive a reduced-animation experience.

---

# 📱 Responsive Design

The interface adapts across:

```text
320px       Mobile
375px       Mobile
480px       Small mobile
600px       Mobile / tablet boundary
768px       Tablet
1024px      Desktop
1280px+     Large desktop
```

The navigation automatically adapts to narrow screens while maintaining usable controls and preventing horizontal scrolling.

---

# 🛠️ Technology Stack

<div align="center">

| Technology | Role |
|---|---|
| HTML5 | Semantic structure |
| CSS3 | Visual system & animation |
| Vanilla JavaScript | Application logic |
| Vite | Development & build system |
| NASA APOD API | Astronomy data |
| Google Fonts | Typography |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

</div>

---

# 🚀 Getting Started

## Requirements

- Node.js
- npm
- NASA API key

---

## 1. Clone

```bash
git clone https://github.com/kawishjaykar91-beep/nasa-apod.git
cd nasa-apod
```

---

## 2. Install

```bash
npm install
```

---

## 3. Configure NASA API

Create:

```text
.env
```

Then add:

```env
VITE_NASA_API_KEY=your_nasa_api_key
```

> Never commit your real API key to Git.

---

## 4. Start Development

```bash
npm run dev
```

---

## 5. Production Build

```bash
npm run build
```

The production output is generated in:

```text
dist/
```

---

# 🌐 Deployment

The project is deployed automatically through **GitHub Actions → GitHub Pages**.

```text
       git push
          │
          ▼
   ┌───────────────┐
   │ GitHub Actions│
   └───────┬───────┘
           │
           ▼
      npm ci
           │
           ▼
     npm run build
           │
           ▼
        dist/
           │
           ▼
    GitHub Pages 🚀
```

Every push to `main` can trigger a new production deployment.

---

# 🤖 AI Development

AI was used throughout development as a **development assistant**.

It helped with:

- Architecture planning
- Feature design
- Implementation guidance
- Debugging
- CSS refinement
- UX improvements
- Documentation
- Development workflow

The project was manually reviewed, tested, built, committed, and deployed during development.

---

# 📊 Project Evolution

```text
Clean Tutorial UI
       │
       ▼
Cinematic Redesign
       │
       ▼
NASA APOD Integration
       │
       ▼
Time Machine
       │
       ▼
URL History
       │
       ▼
GitHub Pages
       │
       ▼
🚀 LIVE PROJECT
```

---

# 🗺️ Current Feature Map

| System | Status |
|---|:---:|
| NASA APOD API | ✅ |
| Image support | ✅ |
| Video support | ✅ |
| Cinematic UI | ✅ |
| Responsive design | ✅ |
| Accessibility | ✅ |
| Reduced motion | ✅ |
| Date picker | ✅ |
| Previous / Next | ✅ |
| Today button | ✅ |
| URL synchronization | ✅ |
| Browser history | ✅ |
| GitHub Pages | ✅ |
| Automated deployment | ✅ |

---

# 📁 Project Structure

```text
nasa-apod/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.js
│   └── style.css
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🔐 Environment Variables

| Variable | Required | Purpose |
|---|:---:|---|
| `VITE_NASA_API_KEY` | ✅ | NASA API authentication |

For local development:

```env
VITE_NASA_API_KEY=DEMO_KEY
```

NASA provides a public `DEMO_KEY`, although it has lower rate limits than a personal API key.

---

# 🌌 Why This Project?

NASA's APOD API is simple to consume.

The interesting challenge was turning that data into an experience.

Instead of stopping at:

```text
fetch()
    ↓
JSON
    ↓
<img>
```

the project evolved into:

```text
NASA DATA
    ↓
DATA STATE
    ↓
DATE NAVIGATION
    ↓
URL HISTORY
    ↓
RESPONSIVE UI
    ↓
CINEMATIC PRESENTATION
    ↓
IMMERSIVE EXPERIENCE
```

---

# 👨‍🚀 Author

## Kawish

Built with curiosity, code, and a fascination with space. 🌌

**GitHub:**  
https://github.com/kawishjaykar91-beep

**Project:**  
https://github.com/kawishjaykar91-beep/nasa-apod

**Live:**  
https://kawishjaykar91-beep.github.io/nasa-apod/

---

<div align="center">

## 🌌 Keep Looking Up

**One API.  
One picture.  
One universe.**

🚀

</div>
