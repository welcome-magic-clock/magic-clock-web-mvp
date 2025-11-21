
# Magic Clock — PWA Skeleton v2 (Full folders)

**Pourquoi un seul ZIP ?** Pour cadrer l'architecture dès le départ et remplacer dossier par dossier ensuite.

## Arborescence
- `app/` : routes (Amazing, Meet me, Studio, Display, Monet, Messages, Notifications, Legal, profils)
- `app/api/*` : endpoints mocks (feed, creators, checkout Adyen)
- `core/` : `config`, `domain` (types), `i18n`, `analytics`, `storage`, `payments` (AdyenMock)
- `features/` : `amazing`, `meet`, `studio`, `monet`, `messages`
- `components/` : `LeftNav`, `ui/*`
- `public/` : images, `manifest.webmanifest`, `sw.js`, icônes PWA

## Lancer
```bash
npm i
npm run dev
```
Déployer sur Vercel (Next.js auto-détecté).

## Prochaines briques
- Auth + rôles, paywall, i18n complet, thème persistant
- Éditeurs Magic Studio/Display aboutis
- Paiements Adyen réels, factures PDF & TVA


## Prisma & Database (MVP)

- Schema: `prisma/schema.prisma` (SQLite by default).
- Local dev:
  - Copy `.env.example` to `.env`.
  - Run `npx prisma generate`.
  - Run `npx prisma migrate dev --name init` to create `dev.db`.
- Production (Vercel): switch provider to `postgresql` and set `DATABASE_URL` in Vercel env vars.


## Accès contenus (canViewContent)

La logique d'accès aux contenus (FREE / ABO / PPV) est centralisée dans `core/domain/access.ts` via la fonction `canViewContent(content, viewer)`.
Le contexte utilisateur minimal est décrit par `ViewerAccessContext` (connexion, abonnements, contenus PPV débloqués).
