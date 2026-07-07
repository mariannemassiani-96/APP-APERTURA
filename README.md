# Projet Lumen — le devis augmenté

Lumen transforme un devis technique (aujourd'hui un PDF incompréhensible pour un
particulier) en une **expérience web vivante**, envoyée par simple lien, qui aide
le client final à **comprendre, visualiser, comparer et décider**.

Ce premier incrément porte sur le secteur **menuiserie**, avec un devis exemple.

**Deux modes de lecture** : une vue **Liste** (chaque poste se déplie) et une vue
**Plan** (chaque menuiserie est située dans le logement, sur le mur de sa façade,
cliquable). L'assistant **« Demander »** est une fenêtre non-bloquante : on peut
l'interroger tout en continuant à parcourir le devis.

---

## Principe d'architecture : « le métier est de la DONNÉE, jamais du code »

Le **moteur** (`src/core`) ne code rien de spécifique à la menuiserie. Tout ce
qui est « menuiserie » vit dans `src/sectors/menuiserie` sous forme de **données**
(une ontologie de secteur + une base de connaissances + un devis seed). On peut
ajouter un autre secteur plus tard **sans toucher au moteur**.

### Deux sources de vérité séparées

| Cerveau | Rôle | Où |
|---|---|---|
| **Cerveau de faits** | Données structurées exactes (références, attributs, valeurs de performance). **Source de tous les chiffres.** | `src/sectors/menuiserie/seed.offre.ts` (via le repository `src/core/data`) |
| **Cerveau de langage** | Couche IA qui **explique** à partir des faits, mais n'invente **jamais** une valeur. | `src/core/llm` + route `src/app/api/demander` |

Chaque valeur du modèle porte sa **source** (`fait` vs `genere`) : c'est la
traçabilité qui garantit la fiabilité. Les performances chiffrées ont toujours
`source: 'fait'`.

### Couche LLM abstraite

L'appel au modèle passe par un module isolé (`src/core/llm`) exposant une
interface `LlmClient`. On change de fournisseur (echo / Anthropic / OpenAI) ou on
branchera l'agent RAG interne (« Agent 0 ») **par variable d'environnement**,
sans réécrire l'app.

---

## Arborescence

```
src/
├── core/                      # LE MOTEUR — générique, zéro mot "menuiserie"
│   ├── model/offre.ts         # Types génériques : Offre, Poste, Performance…
│   ├── data/                  # Accès données isolé (repository) — mémoire aujourd'hui, SQL demain
│   ├── llm/                   # Couche LLM abstraite : contrat + factory + providers
│   │   ├── types.ts           #   interface LlmClient
│   │   ├── index.ts           #   getLlmClient() piloté par l'env
│   │   ├── context.ts         #   pont faits -> contexte (sérialisation)
│   │   ├── contexteOffre.ts   #   construit le contexte depuis une Offre + ontologie
│   │   ├── providers/         #   echo (hors-ligne), anthropic, openai
│   │   └── agent0.ts          #   stub RAG interne (à brancher)
│   ├── ontology/              # Contrat d'ontologie + registre (générique)
│   └── consultation/trace.ts  # Trace horodatée des postes consultés (en mémoire)
│
├── sectors/menuiserie/        # LE MÉTIER — 100 % donnée
│   ├── ontology.ts            #   vocabulaire, unités, libellés, glossaire
│   ├── knowledge.ts           #   base de connaissances courte (pour l'assistant)
│   ├── seed.offre.ts          #   devis EXEMPLE (3 postes, valeurs placeholder)
│   └── index.ts               #   enregistre l'ontologie + l'offre auprès du moteur
│
└── app/                       # L'UI (Next App Router)
    ├── page.tsx               #   accueil : liste des offres
    ├── offre/[id]/page.tsx    #   la page "devis augmenté" (ouverte via son lien)
    ├── components/            #   OffreView, PosteCard, PlanView, badges, variantes, DemanderPanel
    └── api/
        ├── demander/route.ts  #   assistant IA : faits de l'offre + KB -> couche LLM
        └── trace/route.ts     #   trace des consultations
```

**Frontières nettes** : `app` ne connaît que `core`. `core` ne connaît **jamais**
`sectors`. Les secteurs poussent leur donnée dans les registres du moteur.

---

## Lancer en local

Prérequis : Node.js 18+.

```bash
npm install
cp .env.example .env.local     # facultatif : par défaut, provider "echo" hors-ligne
npm run dev                    # http://localhost:3000
```

- Accueil : <http://localhost:3000>
- Devis exemple : <http://localhost:3000/offre/demo-menuiserie>

Autres commandes :

```bash
npm run build        # build de production
npm run start        # sert le build
npm run typecheck    # vérification TypeScript
npm run lint         # ESLint
```

---

## Configuration LLM (variables d'environnement)

Aucune clé n'est codée en dur. Voir `.env.example`.

| Variable | Rôle | Défaut |
|---|---|---|
| `LLM_PROVIDER` | `echo` \| `anthropic` \| `openai` \| `agent0` | `echo` |
| `LLM_API_KEY` | Clé du fournisseur (inutile en `echo`) | — |
| `LLM_MODEL` | Modèle (ex. `claude-sonnet-5`, `gpt-4o-mini`) | défaut par provider |
| `AGENT0_BASE_URL` | URL du service RAG interne (si `agent0`) | `http://localhost:8000` |

**Mode `echo` (défaut)** : réponses déterministes, hors-ligne, construites
uniquement à partir des faits de l'offre. L'app se démontre **sans clé API** et
illustre le garde-fou « pas d'invention de chiffre ». Pour brancher un vrai
modèle : `LLM_PROVIDER=anthropic` + `LLM_API_KEY=…`.

---

## Garde-fous de l'assistant « Demander »

La route `/api/demander` nourrit la couche LLM **uniquement** avec les faits
structurés de l'offre + la base de connaissances du secteur, et une consigne
système stricte : n'affirmer que ce qui est dans les faits, ne jamais inventer de
chiffre, dire « je ne sais pas » sinon, et ne pas livrer de référence-système
copiable.

---

## Données d'exemple

Le devis `demo-menuiserie` est **explicitement marqué comme exemple**
(`exemple: true`). Ses valeurs chiffrées sont des **placeholders réalistes**, à
remplacer par la base de faits réelle. Rien n'y est présenté comme certifié.
