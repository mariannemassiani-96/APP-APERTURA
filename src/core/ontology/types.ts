/**
 * Contrat d'ontologie de secteur (générique).
 *
 * Une ontologie décrit, EN DONNÉE, comment traduire les clés techniques d'un
 * secteur en langage humain : libellés, unités, aides, sens de lecture.
 * Le moteur ne connaît aucun secteur : il consomme ce contrat.
 *
 * ⚠️ On ne construit PAS un moteur d'ontologies générique complet à ce stade
 * (pas de sur-ingénierie). Juste le contrat minimal + un registre simple.
 */

/** Sens dans lequel « c'est mieux » pour une valeur chiffrée. */
export type SensMieux = 'bas' | 'haut';

/** Définition d'une clé technique (performance ou attribut). */
export interface DefinitionCle {
  /** Libellé lisible affiché à l'utilisateur (ex. « Isolation thermique »). */
  label: string;
  /** Unité par défaut (ex. « W/m²·K »). */
  unite?: string;
  /** Courte aide contextuelle, langage clair. */
  aide?: string;
  /** Pour une performance chiffrée : indique si « plus bas » ou « plus haut » est mieux. */
  sensMieux?: SensMieux;
}

/** Ontologie complète d'un secteur. */
export interface SectorOntology {
  /** Identifiant du secteur, doit correspondre à `Offre.secteur`. */
  secteur: string;
  /** Nom lisible du secteur (ex. « Menuiserie »). */
  nom: string;
  /** Définitions des clés de performance. */
  performances: Record<string, DefinitionCle>;
  /** Définitions des clés d'attribut. */
  attributs: Record<string, DefinitionCle>;
  /** Glossaire optionnel terme -> explication, pour l'assistant et les info-bulles. */
  glossaire?: Record<string, string>;
}
