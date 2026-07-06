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

PROCHAINE ÉTAPE — choisir UNE direction et la traiter proprement :

Option A — Brancher « Agent 0 » (RAG interne)
  Implémenter l'adaptateur `src/core/llm/agent0.ts` pour appeler le service FastAPI +
  ChromaDB existant, en lui transmettant le même contexte de faits que les autres
  providers (voir `serialiserContexte`). Conserver le garde-fou « pas d'invention ».
  Ajouter la config d'env nécessaire. Tester avec `LLM_PROVIDER=agent0`.

Option B — Mode « plan / spatialisé »
  Exploiter `Poste.localisation` (pièce/façade, déjà dans le modèle) pour une vue
  plan du logement : postes positionnés, cliquables, reliés à la vue devis. Garder
  la donnée générique (pas de géométrie codée en dur dans `core`).

Option C — Persistance PostgreSQL
  Remplacer l'implémentation mémoire derrière `OffreRepository` (`src/core/data`) par
  une couche PostgreSQL, sans changer l'interface ni l'UI. Prévoir migrations et un
  chargement du seed menuiserie en base.

CONSIGNE
Commence par relire `README.md` + `HANDOFF.md`, propose ton plan pour l'option
retenue (fichiers touchés, impact sur le moteur = idéalement nul), attends ma
validation, puis code. Termine par : app qui tourne, doc de passation mise à jour,
et prompt prêt pour la session d'après.
