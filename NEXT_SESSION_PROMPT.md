# Prompt prêt à coller — session suivante (Projet Lumen)

> Copier-coller le bloc ci-dessous pour démarrer la prochaine session.

---

CONTEXTE
Nous poursuivons « Projet Lumen » : une plateforme qui transforme un devis technique
en une expérience web vivante (comprendre / visualiser / comparer / décider). Le
premier incrément (secteur menuiserie) est en place dans ce dépôt : app Next.js
(App Router + TypeScript + Tailwind) avec une architecture stricte
`core` (moteur générique) / `sectors/menuiserie` (métier = donnée) / `app` (UI),
une couche LLM abstraite (provider `echo` par défaut, adaptateurs Anthropic/OpenAI,
stub Agent 0), un repository mémoire, et un assistant « Demander » ancré sur les
faits. Lire d'abord `README.md` et `HANDOFF.md`.

PRINCIPES NON NÉGOCIABLES (inchangés)
- Le métier est de la DONNÉE, jamais du code : rien de spécifique au secteur dans `core`.
- Deux cerveaux séparés : faits (tous les chiffres) vs langage (explique, n'invente jamais).
- Couche LLM abstraite : passer par `getLlmClient()` / l'interface `LlmClient`.
- Ne pas sur-ingénierer.

DÉJÀ FAIT : base « devis augmenté » (incr. 1) ; mode plan schématique + assistant
non-bloquant (incr. 2) ; intégration d'un vrai devis CASAPERTURA (incr. 3) ; plan
interactif sur vrais plans côté client, onglets RDC/R+1 + repères cliquables (incr. 4).
App déployée sur Vercel. Prototype de l'éditeur pro validé (Artifact).

PROCHAINE ÉTAPE PRIORITAIRE — Éditeur pro « plan » + persistance
  Objectif : le pro importe ses vrais plans et place lui-même les repères (comme le
  prototype `lumen-plan-editor.html` : onglets RDC/R+1, gestion des quantités, contrôle
  de complétude), puis le client voit le résultat.
  Bloquant technique : il faut une PERSISTANCE (l'app est en mémoire ; Vercel serverless
  ne conserve pas les écritures runtime). Donc :
   1. Choisir le stockage (ex. Vercel Postgres/Neon pour les repères + Vercel Blob pour
      les images de plans), brancher derrière `OffreRepository` (`src/core/data`) sans
      changer l'interface ni l'UI.
   2. Ajouter les routes d'écriture (upload plan, sauvegarde des repères sur l'offre).
   3. Construire l'éditeur pro dans l'app en réutilisant la logique du prototype.
  Modèle déjà prêt : `PlanImage` + `Repere` dans `core/model/offre.ts`.

AUTRES PISTES : brancher « Agent 0 » (RAG) via `core/llm/agent0.ts` ; import/saisie
d'un devis réel (formulaire pro, puis PDF) produisant une `Offre` typée.

CONSIGNE
Commence par relire `README.md` + `HANDOFF.md`, propose ton plan pour l'option
retenue (fichiers touchés, impact sur le moteur = idéalement nul), attends ma
validation, puis code. Termine par : app qui tourne, doc de passation mise à jour,
et prompt prêt pour la session d'après.
