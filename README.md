# Dhanush Kumar G DevOps Portfolio

Personal portfolio website for Dhanush Kumar G, built as an interactive, animated DevOps engineering showcase. The site combines a 3D character hero, GSAP-powered scrolling, responsive project sections, social links, resume access, and a GitHub Pages-ready deployment setup.

Live site: https://dhanushindevops.github.io/DhanushDevOpsPortfolio/

## Features

- Interactive 3D character hero built with Three.js and GLTF loading
- Smooth scroll and split-text animations powered by GSAP
- Animated loading experience with branded DKG logo
- Responsive sections for about, skills, career, work, and contact
- 3D tech stack visualization using React Three Fiber and Rapier physics
- Public resume link and social profile shortcuts
- GitHub Pages-compatible asset paths through Vite `base`
- Deployment-safe GSAP package usage, with no `gsap-trial` dependency

## Tech Stack

- React 18
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- React Three Rapier
- GSAP and ScrollTrigger
- CSS files for component styling
- GitHub Pages

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Because this project is configured for GitHub Pages, open the app at:

```text
http://localhost:5173/DhanushDevOpsPortfolio/
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment Notes

The Vite base path is configured in `vite.config.ts`:

```ts
base: "/DhanushDevOpsPortfolio/"
```

Keep this value when deploying to:

```text
https://dhanushindevops.github.io/DhanushDevOpsPortfolio/
```

If the repository name or deployment path changes, update the Vite `base` value and any GitHub Pages workflow settings accordingly.

## Project Structure

```text
public/
  draco/                 Draco decoder files for compressed 3D assets
  images/                Logo, tech icons, and project images
  models/                Encrypted character model and HDR environment
src/
  components/            Portfolio sections and UI components
  components/Character/  Three.js character scene and helpers
  components/styles/     Component CSS files
  components/utils/      GSAP animation utilities
  context/               Loading state provider
  data/                  Character/animation support data
  utils/                 Shared app helpers
```

## Assets

The branded logo lives at:

```text
public/images/dkg-logo.png
```

The 3D character is loaded from an encrypted model asset:

```text
public/models/character.enc
```

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check and build production files
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm run test      # Placeholder test command
```

## License

This project is open source under the [MIT License](LICENSE).
