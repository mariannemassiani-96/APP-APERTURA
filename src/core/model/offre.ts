/**
 * Modèle de données générique « Offre vivante ».
 *
 * ⚠️ MOTEUR GÉNÉRIQUE — aucun mot spécifique à la menuiserie ici.
 * Tout le métier vit dans /sectors sous forme de DONNÉE (ontologie + seed).
 *
 * Principe de traçabilité : chaque valeur porte sa SOURCE.
 *   - source 'fait'   -> vient du « cerveau de faits » (donnée structurée exacte)
 *   - source 'genere' -> produit par le « cerveau de langage » (explication)
 * Les performances chiffrées ont TOUJOURS source 'fait' : l'IA n'invente aucun chiffre.
 */

/** Cycle de vie d'une offre (du brouillon au carnet d'entretien). */
export type EtatOffre = 'brouillon' | 'offre' | 'commande' | 'passeport' | 'carnet';

/** Provenance d'une valeur : fait exact vs texte généré. */
export type Source = 'fait' | 'genere';

/** Une performance est soit une promesse (annoncée), soit une preuve (documentée). */
export type StatutPerformance = 'promesse' | 'preuve';

/** Un prix est proposé (indicatif) ou ferme (engageant). */
export type StatutPrix = 'propose' | 'ferme';

/** Attribut descriptif (dimension, matériau, couleur…). */
export interface Attribut {
  cle: string; // clé technique, résolue en libellé via l'ontologie du secteur
  valeur: string | number;
  unite?: string;
}

/**
 * Performance chiffrée (isolation, acoustique…).
 * `source` est verrouillé à 'fait' au niveau du type : garantie que tout chiffre
 * affiché provient du cerveau de faits.
 */
export interface Performance {
  cle: string;
  valeur: string | number;
  unite?: string;
  statut: StatutPerformance;
  source: 'fait';
}

/** Traduction en langage clair : « le pourquoi pour vous ». */
export interface Benefice {
  texte: string;
  source: Source; // 'fait' si repris tel quel, 'genere' si reformulé par l'IA
}

/**
 * Variante exprimée en DIRECTION, pas en recette copiable.
 * Ex. { direction: "Plus d'isolation", effet: "hivers plus confortables, factures réduites" }
 */
export interface Variante {
  direction: string;
  effet: string;
}

/** Prix d'un poste. */
export interface Prix {
  montant: number;
  devise?: string; // défaut applicatif : EUR
  statut: StatutPrix;
}

/** Localisation dans le logement — préparé pour le futur mode « plan ». */
export interface Localisation {
  piece: string;
  façade?: string;
}

/** Élément de preuve : certification, garantie, label… */
export interface Preuve {
  type: string; // ex. 'certification', 'garantie'
  libelle: string;
}

/** Un poste du devis (un ouvrage / un produit). */
export interface Poste {
  id: string;
  identite: {
    reference: string;
    designation: string;
  };
  attributs: Attribut[];
  performances: Performance[];
  benefice: Benefice;
  variantes: Variante[];
  prix: Prix;
  localisation?: Localisation;
  preuves: Preuve[];
}

/**
 * Plan schématique du logement (générique, optionnel).
 *
 * Ce n'est PAS un plan d'architecte : de simples pièces posées sur une grille en
 * unités abstraites (x/y = coin haut-gauche). L'UI normalise ces coordonnées pour
 * dessiner un plan responsive, et positionne chaque poste sur le mur indiqué par
 * sa `localisation.façade`. Aucune géométrie métier n'est codée dans le moteur.
 */
export interface PiecePlan {
  nom: string; // doit correspondre à Localisation.piece
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

export interface PlanLogement {
  pieces: PiecePlan[];
}

/** Identité + marque blanche du professionnel émetteur. */
export interface Branding {
  couleurs: {
    primaire: string; // Vert Maquis par défaut
    accent: string; // Cuivre par défaut
    encre: string; // Noir par défaut
    fond: string; // Crème par défaut
  };
  logoUrl?: string;
  slogan?: string;
}

/** L'offre complète, racine du modèle. */
export interface Offre {
  id: string;
  etat: EtatOffre;
  secteur: string; // ex. 'menuiserie' — clé de résolution de l'ontologie
  pro: { nom: string; branding: Branding };
  client: { nom: string };
  postes: Poste[];
  /** Plan schématique optionnel du logement, pour le mode « plan ». */
  plan?: PlanLogement;
  /** Marque explicitement une offre comme donnée d'exemple (jamais présentée comme certifiée). */
  exemple?: boolean;
}
