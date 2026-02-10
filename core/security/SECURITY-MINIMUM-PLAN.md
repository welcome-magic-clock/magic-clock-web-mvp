# Magic Clock – Plan minimal de sécurité (MVP)

Version : 0.1 (MVP)  
Dernière mise à jour : 2026-02-10

---

## 1. Objectif & périmètre

Ce document décrit le **plan minimal de sécurité** pour le lancement de Magic Clock (MVP) :

- Application web Magic Clock (Next.js / Vercel)
- Backends et services tiers (authentification, base de données, stockage fichiers, paiements)
- Données des utilisateurs (visiteurs, utilisateurs connectés, créateurs, admin)

Ce n’est **pas** un document juridique, mais un guide opérationnel pour l’équipe.

---

## 2. Architecture technique (vue rapide)

- **Frontend** : Next.js (Magic Clock Web MVP), déployé sur Vercel en HTTPS.
- **Auth** : fournisseur d’authentification (ex. NextAuth + provider e-mail / OAuth).
- **Base de données principale** : ex. Supabase / Postgres (ou équivalent).
- **Stockage de médias** : ex. R2 / bucket S3-compatible (images & vidéos des créateurs).
- **Paiements** : PSP (Stripe / Adyen / autre) – aucun numéro de carte stocké chez Magic Clock.
- **Logs & monitoring** : logs d’application + alertes basiques (erreurs, 5xx, temps de réponse).

---

## 3. Authentification & comptes

1. **Accès utilisateur**
   - Auth par e-mail + mot de passe ou lien magique, ou via OAuth (Google, Apple, etc.).
   - Tous les endpoints sensibles sont protégés par une vérification de session côté serveur.
   - Tokens et cookies marqués `HttpOnly`, `Secure` et `SameSite=Lax` au minimum.

2. **Rôles & permissions**
   - Rôles minimum : `user`, `creator`, `admin` (et plus tard `moderator`).
   - Les actions d’admin (modération, accès aux données, etc.) ne sont possibles que côté serveur, jamais directement depuis le frontend.

3. **Sécurité des admin**
   - Comptes admin limités au strict nécessaire.
   - 2FA activée sur :
     - le fournisseur d’auth (Google, GitHub, etc.),
     - la console du fournisseur de base de données,
     - la console du stockage de fichiers,
     - le PSP (paiements).

---

## 4. Données & stockage

1. **Données personnelles stockées**
   - E-mail, nom / pseudo, avatar, contenu publié (photos / vidéos / textes), préférences.
   - **Jamais** de mot de passe en clair : uniquement des hash bcrypt/argon2.
   - **Jamais** de numéro de carte bancaire brut : tout passe par le PSP.

2. **Base de données**
   - Accès limité par IP / rôle (au minimum : aucun accès public sans auth).
   - Lecture/écriture contrôlée via une API ou des policies (RLS si Supabase).
   - Backups automatiques activés au niveau du fournisseur (quotidien).

3. **Stockage de médias (R2 / S3)**
   - Buckets privés par défaut.
   - Génération de liens signés / URLs temporaires pour l’accès aux fichiers.
   - Éviter de stocker des données ultra sensibles (seulement du contenu “social” : images, vidéos, etc.).

---

## 5. Paiements & données financières

1. **Principe général**
   - Magic Clock ne stocke **aucune donnée de carte bancaire**.
   - Toutes les opérations passent par un PSP externe (Stripe / autre).

2. **Intégration PSP**
   - Utilisation de **tokens / payment intents** fournis par le PSP.
   - Webhooks sécurisés (secret) pour recevoir les événements (paiement réussi, échec, remboursement).
   - Vérification systématique de la signature des webhooks.

3. **Données conservées côté Magic Clock**
   - ID de transaction / session de paiement,
   - montant, devise, type d’accès (FREE / SUB / PPV),
   - statut (en attente, payé, remboursé).
   - Aucune donnée de carte brute ou CVV.

---

## 6. Accès internes & secrets

1. **Secrets & clés**
   - Tous les secrets (API keys, DB URL, PSP key, etc.) sont stockés dans :
     - les variables d’environnement de Vercel / serveur,
     - **jamais** commit dans Git.
   - Rotation des clés possible (prévoir un process simple).

2. **Accès aux consoles**
   - Accès DB / R2 / PSP / Vercel limité aux comptes :
     - protégés par mot de passe fort + 2FA,
     - appartenant uniquement aux personnes qui en ont besoin.

3. **Postes de travail**
   - Navigateur à jour.
   - OS à jour.
   - Verrouillage de session (mot de passe / Touch ID) activé sur les machines qui ont accès aux consoles.

---

## 7. Journalisation & monitoring

1. **Logs applicatifs**
   - Logs minimum :
     - erreurs serveurs (5xx),
     - échecs d’authentification,
     - opérations sensibles (login, création/suppression de contenu, changements de rôle).
   - Logs ne contiennent **pas** :
     - de mots de passe,
     - de numéros de cartes,
     - ni d’informations ultra sensibles.

2. **Monitoring**
   - Alertes basiques :
     - taux d’erreur anormal (5xx),
     - temps de réponse anormal,
     - erreurs répétées sur un même endpoint.

---

## 8. Sauvegardes & continuité

1. **Base de données**
   - Backups automatiques activés (quotidiens minimum).
   - Procédure testée régulièrement :
     - restauration sur un environnement de test.

2. **Code & config**
   - Code versionné sur GitHub.
   - Utilisation de branches + PR pour les changements importants.

3. **Plan simple en cas de panne**
   - Possibilité de :
     - désactiver temporairement les nouvelles inscriptions,
     - afficher une page “maintenance” en cas de problème grave.

---

## 9. Gestion des incidents

En cas d’incident (sécurité, disponibilité, données, paiements) :

1. **Étapes de base**
   - Contenir : limiter immédiatement l’impact (désactiver l’endpoint, couper une fonctionnalité, etc.).
   - Analyser : vérifier les logs, les configurations, les accès.
   - Corriger : patch technique, configuration, rollback si nécessaire.
   - Documenter : remplir une fiche d’incident.

2. **Fiche d’incident**
   - Utiliser le modèle :  
     `core/security/incident-template.ts` → `INCIDENT_REPORT_TEMPLATE_MD`
   - Chaque incident significatif doit avoir une fiche, même s’il est vite résolu.

3. **Après incident**
   - Identifier la cause racine.
   - Définir au moins **une action préventive** (test, procédure, check-list).
   - Mettre à jour ce plan si nécessaire.

---

## 10. Check-list avant mise en production

- [ ] HTTPS actif partout (front + API + PSP).
- [ ] Authentification testée (login, logout, rôles, accès protégés).
- [ ] Aucune clé ou secret dans le code Git.
- [ ] Accès consoles (Vercel, DB, stockage, PSP) protégés par 2FA.
- [ ] Backups DB activés + test simple de restauration.
- [ ] Buckets de stockage privés + lien signé OK.
- [ ] Intégration PSP testée (paiement OK, échec géré, webhooks vérifiés).
- [ ] Pages légales de base visibles : CGU, Politique de confidentialité (même en version MVP).
- [ ] Template de fiche d’incident disponible.
- [ ] Ce plan lu et validé par le Capitaine (et l’avocat pour la partie légale si nécessaire).

---

## 11. Révision du plan

- Ce document doit être relu à chaque **phase importante du projet** :
  - changement d’architecture (ex. ajout d’une nouvelle base ou micro-service),
  - connexion d’un nouveau PSP,
  - ouverture dans un nouveau pays ou cadre légal,
  - après un incident majeur.

- Historique des versions :
  - **0.1 – 2026-02-10** : version MVP initiale (lancement Magic Clock).
