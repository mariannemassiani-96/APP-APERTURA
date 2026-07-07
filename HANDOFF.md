# Document de passation — Projet Lumen

_Secteur : menuiserie — Branche : `claude/lumen-augmented-quote-cwzy2a` (déployée sur Vercel via `main`)_

## Incrément 3 (2026-07-07) — intégration d'un vrai devis

- **Deuxième offre = devis réel** CASAPERTURA `P_2026-0029v2` (projet 4 logements
  Calenzana), saisie à la main depuis le PDF dans `sectors/menuiserie/seed.astolfi.ts`
  (17 postes, total 99 803,60 € HT — conforme au PDF). `exemple: false`.
- **Discipline « cerveau de faits »** : tous les chiffres/caractéristiques (dimensions,
  gamme Kawneer, coloris RAL 7016, vitrage 4/20/4 argon FE1.0, feuilleté SP10, surface,
  poids, prix, quantités, garanties GPA/décennale, traçabilité WINDOW.ID) viennent
  EXACTEMENT du devis ; les `benefice` sont `genere` et n'avancent aucun chiffre absent
  du PDF (le devis ne chiffre pas de Uw/Rw par ligne — non inventé). RIB/IBAN et CGV du
  PDF volontairement exclus.
- Ontologie enrichie des attributs réels (gamme, coloris, surface, poids, pose,
  fermeture, quantité, prix unitaire HT). `PosteCard` masque la rubrique
  « Performances » quand un poste n'en chiffre aucune.
- Pas de `plan` pour cette offre (projet multi-logements : le placement fidèle des
  ouvertures demande une décision de périmètre — cf. points ouverts).
- ⚠️ CONFIDENTIALITÉ : cette offre contient un nom client réel + des prix réels et est
  accessible par lien sur le déploiement public. À anonymiser si diffusion large.

## Incrément 2 (2026-07-07) — mode « plan » + assistant non-bloquant + déploiement

- **Déploiement Vercel** : l'app est en ligne (branche `main` = Lumen). Provider LLM
  réglé par variables d'env dans Vercel. Correctif appliqué : le paramètre
  `temperature` n'est plus envoyé par défaut (les modèles Claude récents le refusent).
- **Mode « plan / spatialisé »** : sélecteur Liste / Plan sur la page offre. La vue
  Plan dessine les pièces (données `offre.plan`, unités abstraites normalisées) et
  place chaque poste sur le mur de sa façade (Nord haut / Sud bas / Est droite /
  Ouest gauche). Clic sur un repère → bulle d'infos (bénéfice + prix) + « Voir le
  détail » qui bascule en Liste, déplie le poste et le centre. Reste générique :
  `PlanView` lit `offre.plan` + `poste.localisation`, aucun code métier dans `core`.
  Nouveaux types génériques : `PiecePlan`, `PlanLogement` (`core/model/offre.ts`).
- **Assistant « Demander » non-bloquant** : fenêtre flottante (bas-droit sur
  ordinateur, feuille en bas sur mobile) SANS voile — le devis reste défilable et
  cliquable pendant la conversation. `PosteCard` est passé en expansion contrôlée
  (état remonté dans `OffreView`) pour permettre l'ouverture depuis le plan.
- Vérifs : `typecheck` + `build` OK ; parcours plan → « Voir le détail » et
  cliquabilité du devis pendant « Demander » testés (Playwright).

---

# Incrément 1 — base « devis augmenté »

_Date : 2026-07-06_

## 1. Ce qui a été fait

Une application Next.js (App Router, TypeScript, Tailwind) qui affiche un devis
de menuiserie en mode **« devis augmenté »** et embarque un **assistant IA
ancré sur les faits**. Livrable démontrable en local.

- **Moteur générique** (`src/core`) : modèle de données « offre vivante »,
  couche d'accès données isolée, contrat + registre d'ontologie, trace de
  consultation, et **couche LLM abstraite** avec factory pilotée par l'env.
- **Métier en donnée** (`src/sectors/menuiserie`) : ontologie (libellés, unités,
  glossaire), base de connaissances courte, et devis seed à 3 postes (baie
  coulissante séjour, fenêtre 2 vantaux chambre, porte-fenêtre cuisine).
- **UI** : accueil, page `/offre/[id]` responsive priorité mobile, postes
  dépliables (bénéfice en clair, attributs, performances avec badge
  promesse/preuve, variantes en directions, preuves, prix), marque blanche
  thémable, compteur de postes consultés, panneau « Demander ».
- **API** : `/api/demander` (assistant) et `/api/trace` (consultations).
- **Docs** : `README.md`, ce fichier, et `NEXT_SESSION_PROMPT.md`.

### Vérifications effectuées

- `npm run build` ✅ · `npm run typecheck` ✅
- Pages `/` (200), `/offre/demo-menuiserie` (200), offre inexistante (404) ✅
- Assistant `echo` testé : compare l'isolation/l'acoustique entre postes en
  citant les faits, explique le Uw via la base de connaissances, et répond
  « je ne dispose pas de cette information » hors périmètre — **sans jamais
  inventer de chiffre** ✅
- Trace `POST`/`GET` fonctionnelle ✅
- Rendu visuel validé (capture mobile) : typographies et palette Apertura ✅

## 2. Décisions prises

1. **App autonome à la racine du dépôt.** L'ancien dossier `casa-aperto`
   (doublon du site, inutilisé) a été supprimé sur validation. Lumen est un
   projet neuf à architecture propre.
2. **Provider LLM par défaut = `echo` (hors-ligne).** L'app se démontre sans clé
   API et illustre le garde-fou « pas d'invention ». Adaptateur Anthropic prêt
   (fetch, aucune dépendance) ; OpenAI également ; **Agent 0 stubé**.
3. **Séparation stricte core / sectors / app.** `core` n'importe jamais
   `sectors` : ce sont les secteurs qui s'enregistrent dans les registres du
   moteur (ontologie + offres). Matérialise « métier = donnée ».
4. **Traçabilité par la donnée.** Chaque valeur porte sa `source` ; les
   performances sont typées `source: 'fait'` (garantie au niveau du type).
5. **Pas de sur-ingénierie.** Une seule ontologie, un registre simple, un
   repository mémoire (interface prête pour PostgreSQL). Pas de pipeline
   d'ingestion PDF, pas de base de données à ce stade.
6. **Polices via `<link>`** (et non `next/font`) pour un build robuste même
   hors-ligne ; repli système défini dans `tailwind.config.ts`.

## 3. État du code

- Build & typecheck au vert. Un seul warning ESLint bénin
  (`no-page-custom-font`) lié au choix `<link>` pour les polices.
- Le repository et la trace sont **en mémoire** (réinitialisés au redémarrage) —
  conforme à l'incrément.
- L'adaptateur `agent0` lève une erreur explicite tant qu'il n'est pas branché
  (aucune réponse inventée).

## 4. Points ouverts / limites connues

- **Persistance** : tout est en mémoire. Brancher PostgreSQL derrière
  `OffreRepository` (changer l'export dans `src/core/data/index.ts`).
- **Assistant `echo`** : recherche par mots-clés + stemming léger. Suffisant
  pour la démo et pédagogiquement fidèle, mais c'est un repli : la vraie valeur
  vient d'Anthropic/Agent 0.
- **Mode « plan / spatialisé »** : le modèle porte déjà `localisation`
  (pièce/façade) mais l'UI ne propose pas encore de vue plan.
- **Multi-offres / auth pro** : hors périmètre de cet incrément (accès par lien
  sans authentification, une offre exemple).
- **Trace côté pro** : enregistrée mais pas encore exposée dans une vue pro.
- **Preuves/certifications** : libellés d'exemple à documenter avec la base de
  faits réelle.

## 5. Où regarder en priorité

- Contrat LLM : `src/core/llm/types.ts` + `src/core/llm/index.ts`
- Garde-fous assistant : `src/app/api/demander/route.ts`
- Pont faits → contexte : `src/core/llm/contexteOffre.ts`
- Modèle de données : `src/core/model/offre.ts`
- Ontologie & seed menuiserie : `src/sectors/menuiserie/`
