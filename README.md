# Magic Clock — PWA Skeleton v3.1 (Next.js 16)

Pack prêt à pousser sur Vercel (App Router, TS, Tailwind).  
Inclus : SEO, manifest PWA, robots/sitemap, pages légales, CookieBanner, sections placeholder.

## Lancer
```bash
npm i
npm run dev
```

## Environnement
Copie `.env.example` → `.env.local` et ajuste :
```
NEXT_PUBLIC_SITE_URL=https://www.magic-clock.com
```

## Dossiers
- `app/` : routes (Amazing, Meet, Studio, Display, Monet, Messages, Legal)
- `components/` : UI (CookieBanner, LeftNav)
- `lib/` : `constants`, `seo`
- `public/` : icônes & OG, manifest alimenté par `app/manifest.ts`

## À faire ensuite
- Brancher l’analytics + consentement
- Intégrer gating FREE / SUB / PPV (mock) + My Magic
- Remplacer les icônes par les versions officielles
