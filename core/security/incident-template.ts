// core/security/incident-template.ts

/**
 * Modèle de fiche d'incident de sécurité Magic Clock.
 *
 * Format : Markdown
 * Usage : pour documenter tout incident (technique, sécurité, données, paiement, etc.)
 */

export const INCIDENT_REPORT_TEMPLATE_MD = `# Fiche d'incident – Magic Clock

## 1. Informations générales

- **ID incident** : \`INC-YYYYMMDD-XXX\`
- **Date et heure de détection** : 
- **Détecté par** : (nom / rôle / e-mail)
- **Canal de signalement** : (ex. utilisateur, monitoring, partenaire, interne)
- **Portée présumée** : (Magic Studio, Magic Display, comptes utilisateurs, paiements, etc.)

---

## 2. Résumé rapide (pour le Capitaine & le board)

> 3–5 lignes maximum, compréhensibles par quelqu'un qui ne connaît pas la technique.
> Exemple : "Fuite potentielle d'adresses e-mail via un endpoint non protégé..."

---

## 3. Description détaillée

- **Que s'est-il passé ?**
- **Depuis quand ? (si connu)**
- **Où dans le système ?**
  - URL / fonctionnalité concernée :
  - Service / composant (ex. API auth, stockage R2, Supabase, etc.) :
- **Type d'incident** :
  - [ ] Disponibilité (panne / downtime)
  - [ ] Intégrité (données corrompues / modifiées)
  - [ ] Confidentialité (fuite / accès non autorisé)
  - [ ] Paiement / facturation
  - [ ] Autre : 

---

## 4. Impact

### 4.1 Impact technique

- Services impactés :
- Dégradations constatées (erreurs 5xx, lenteur, timeouts, etc.) :
- Volume estimé (requêtes, jobs, fichiers, etc.) :

### 4.2 Impact sur les utilisateurs

- **Catégories d'utilisateurs** :
  - [ ] Invités (visiteurs non connectés)
  - [ ] Utilisateurs authentifiés
  - [ ] Créateurs
  - [ ] Administrateurs
- **Nombre d'utilisateurs concernés (estimé)** :
- **Pays / zones concernées** (si pertinents pour le RGPD / Suisse) :
- **Données personnelles potentiellement exposées** :
  - [ ] E-mail
  - [ ] Nom / prénom
  - [ ] Contenus (photos / vidéos / texte)
  - [ ] Données de paiement (tokenisées uniquement, pas de numéro brut)
  - [ ] Autre : 

---

## 5. Chronologie (timeline)

> L'objectif est d'avoir une ligne du temps claire.

- **T0 – Détection** : (date / heure / événement)
- **T1 – Première action** : (qui, quoi)
- **T2 – Mesures de confinement** : 
- **T3 – Correction appliquée** :
- **T4 – Retour à la normale** :
- **T5 – Communication aux utilisateurs / partenaires** (si applicable) :

---

## 6. Cause racine (root cause)

- **Cause technique principale** :
  - (ex. mauvaise configuration de règle R2, oubli d'auth sur un endpoint, bug logique, etc.)
- **Facteurs contributifs** :
  - (ex. absence de tests, manque de revues de code, config manuelle non documentée...)
- **Vérifications effectuées** :
  - Logs, traces, monitoring, audit de configuration, etc.

---

## 7. Mesures correctives immédiates

> Ce qui a été fait pour éteindre l'incendie.

- [ ] Endpoint désactivé / corrigé
- [ ] Clés / secrets régénérés
- [ ] Sessions utilisateur invalidées
- [ ] Règles de firewall / WAF ajustées
- [ ] Autre : 

Détails :

---

## 8. Actions préventives (pour que ça n'arrive plus)

> Ce que l'équipe s'engage à mettre en place à court / moyen terme.

- **Code & tests**
  - [ ] Ajouter des tests automatisés (unitaires / e2e)
  - [ ] Ajouter une revue de code obligatoire (pull request)
- **Architecture & configuration**
  - [ ] Renforcer les règles d'accès (R2 / Supabase / API)
  - [ ] Mettre à jour la configuration des secrets / VPN / IP allowlist
- **Processus**
  - [ ] Documenter le flux (dans /docs)
  - [ ] Mettre à jour la check-list de déploiement
- **Organisation / formation**
  - [ ] Sensibilisation de l'équipe sur ce type de risque
  - [ ] Mise à jour du plan de réponse aux incidents

---

## 9. Communication externe

- **Notification aux utilisateurs nécessaire ?**
  - [ ] Oui
  - [ ] Non
  - Si oui, pourquoi ? (réglementaire, transparence, confiance, etc.)
- **Message prévu** :
  - Canal : (e-mail, in-app, réseaux sociaux, autre)
  - Résumé du message :
- **Notification à des tiers** (hébergeur, fournisseur de paiement, DPA, autorité) :
  - Qui ? 
  - Quand ? 

---

## 10. Statut final

- **Statut de l'incident** :
  - [ ] Ouvert
  - [ ] En cours d'analyse
  - [ ] Corrigé techniquement
  - [ ] Clos après revue
- **Responsable du suivi** :
- **Date de clôture** :

---

## 11. Annexes

- Captures d'écran :
- Extraits de logs (filtrés, sans données sensibles) :
- Liens vers issues GitHub / tickets :
- Autre documentation utile :

---

*Dernière mise à jour du modèle : 2026-02-XX – Version 0.1 (MVP Magic Clock).*`;
