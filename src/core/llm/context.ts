/**
 * Contexte de faits transmis à la couche LLM.
 *
 * C'est le pont entre le « cerveau de faits » et le « cerveau de langage » :
 * la route /api/demander aplatit les faits de l'offre + la base de connaissances
 * du secteur en un contexte structuré, sérialisé dans le message système.
 *
 * - Les vrais fournisseurs (Anthropic/OpenAI) le lisent comme du texte de contexte.
 * - Le fournisseur `echo` le re-parse pour répondre HORS-LIGNE, uniquement à
 *   partir de ces faits (aucune invention possible : il ne connaît rien d'autre).
 */

/** Catégorie d'un fait atomique (pour l'affichage et le tri). */
export type CategorieFait =
  | 'attribut'
  | 'performance'
  | 'benefice'
  | 'prix'
  | 'preuve'
  | 'variante';

/** Un fait atomique, prêt à être cité. */
export interface FaitAtome {
  posteId: string;
  designation: string;
  categorie: CategorieFait;
  /** Texte lisible et auto-suffisant, ex. « Isolation thermique : Uw = 1,3 W/m²·K (promesse) ». */
  texte: string;
  /** Mots-clés (déjà normalisés) pour la recherche du fournisseur echo. */
  motsCles: string[];
}

/** Entrée de la base de connaissances du secteur. */
export interface ConnaissanceAtome {
  titre: string;
  texte: string;
  motsCles: string[];
}

/** Contexte complet fourni au LLM pour répondre sur UNE offre. */
export interface ContexteFaits {
  offre: {
    id: string;
    secteur: string;
    pro: string;
    client: string;
  };
  faits: FaitAtome[];
  connaissances: ConnaissanceAtome[];
}

// Marqueurs délimitant le bloc JSON dans le message système.
const DEBUT = '<<<FAITS_JSON';
const FIN = 'FAITS_JSON>>>';

/** Sérialise le contexte en bloc balisé, à insérer dans le message système. */
export function serialiserContexte(ctx: ContexteFaits): string {
  return `${DEBUT}\n${JSON.stringify(ctx)}\n${FIN}`;
}

/** Extrait le contexte depuis un contenu système (null si absent/illisible). */
export function extraireContexte(contenu: string): ContexteFaits | null {
  const i = contenu.indexOf(DEBUT);
  const j = contenu.indexOf(FIN);
  if (i === -1 || j === -1 || j <= i) return null;
  const brut = contenu.slice(i + DEBUT.length, j).trim();
  try {
    return JSON.parse(brut) as ContexteFaits;
  } catch {
    return null;
  }
}
