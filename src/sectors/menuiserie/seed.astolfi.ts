/**
 * Offre réelle — devis CASAPERTURA P_2026-0029v2 (variante porte-fenêtres).
 *
 * Données saisies À LA MAIN depuis le PDF fourni (pas encore de pipeline
 * d'ingestion). Fidélité au « cerveau de faits » :
 *  - Tous les CHIFFRES et caractéristiques (dimensions, gamme, coloris, vitrage,
 *    surface, poids, prix, quantités, garanties) proviennent EXACTEMENT du devis.
 *  - Les `benefice` sont des traductions en langage clair (source: 'genere'),
 *    fondées sur les faits — sans jamais avancer un chiffre absent du devis
 *    (ex. le devis ne donne pas de Uw/Rw chiffré par ligne : on ne l'invente pas).
 *  - Coordonnées bancaires et CGV du PDF volontairement exclues (hors sujet ici).
 *
 * Projet : 4 logements (T3/T2), Calenzana. Prix en € HT (comme le devis).
 */

import type { Attribut, Offre, Poste, Preuve, Variante } from '@/core/model/offre';

const REF = 'P_2026-0029v2';

// Garanties et traçabilité annoncées dans le devis (faits) — communes à tous les postes.
const GARANTIES: Preuve[] = [
  { type: 'garantie', libelle: 'Garantie de parfait achèvement — 1 an' },
  { type: 'garantie', libelle: 'Garantie de bon fonctionnement — 2 ans' },
  { type: 'garantie', libelle: 'Garantie décennale — 10 ans' },
  { type: 'traçabilité', libelle: 'Traçabilité WINDOW.ID (QR code par menuiserie)' },
];

// Pose commune (toutes menuiseries).
const POSE: Attribut = { cle: 'pose', valeur: 'En applique, isolation intérieure 120 mm' };

const eur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €';

/** Petite fabrique pour limiter les répétitions et les fautes de frappe. */
function poste(p: {
  id: string;
  pos: number;
  designation: string;
  piece: string;
  attributs: Attribut[];
  performances?: Poste['performances'];
  benefice: string;
  variantes: Variante[];
  prixUnitaire: number;
  quantite: number;
  totalHt: number;
  preuves?: Preuve[];
  /** La pose « en applique iso 120 mm » ne concerne que fenêtres/portes (défaut true). */
  pose?: boolean;
}): Poste {
  return {
    id: p.id,
    identite: { reference: `${REF} · Pos. ${p.pos}`, designation: p.designation },
    attributs: [
      ...p.attributs,
      ...(p.pose === false ? [] : [POSE]),
      { cle: 'quantite', valeur: `×${p.quantite}` },
      { cle: 'prix_unitaire', valeur: eur(p.prixUnitaire) },
    ],
    performances: p.performances ?? [],
    benefice: { texte: p.benefice, source: 'genere' },
    variantes: p.variantes,
    prix: { montant: p.totalHt, devise: 'EUR', statut: 'propose' },
    localisation: { piece: p.piece },
    preuves: p.preuves ?? GARANTIES,
  };
}

// Attributs récurrents.
const gammeKassiopee: Attribut = { cle: 'gamme', valeur: 'Kawneer AA765 Kassiopée (aluminium)' };
const gammeKanada: Attribut = { cle: 'gamme', valeur: 'Kawneer AA765 Kanada (aluminium)' };
const coloris7016: Attribut = { cle: 'coloris', valeur: 'Gris anthracite RAL 7016 S (classe 1)' };
const vitrageIsolant: Attribut = {
  cle: 'vitrage',
  valeur: 'Double vitrage 4/20/4, argon, warm-edge, couche peu émissive (FE 1.0)',
};

// Étanchéité renforcée A0 (annoncée sur les oscillo-battants) — fait.
const etancheiteA0: Poste['performances'] = [
  { cle: 'etancheite_air', valeur: 'A0 — étanchéité à l’air renforcée', statut: 'promesse', source: 'fait' },
];

const varIsolation: Variante = {
  direction: 'Plus d’isolation',
  effet: 'un triple vitrage possible sur les façades les plus exposées',
};
const varSolaire: Variante = {
  direction: 'Plus de confort d’été',
  effet: 'un vitrage à contrôle solaire pour limiter la surchauffe',
};

export const offreAstolfi: Offre = {
  id: 'devis-astolfi',
  etat: 'offre',
  secteur: 'menuiserie',
  exemple: false, // données réelles issues du devis
  pro: {
    nom: 'CASAPERTURA',
    branding: {
      couleurs: { primaire: '#4F5E46', accent: '#C27A4A', encre: '#1A1A1A', fond: '#F5F0E8' },
      slogan: 'Châssis aluminium sur mesure — groupe SIAL.',
    },
  },
  client: { nom: 'M. Cheyband Astolfi' },
  postes: [
    poste({
      id: 'pos-1',
      pos: 1,
      designation: 'Porte-fenêtre 1400 × 2200 — Séjour / cuisine (RDC)',
      piece: 'RDC · Séjour / cuisine',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '1400 × 2200', unite: 'mm' },
        coloris7016,
        vitrageIsolant,
        { cle: 'ouverture', valeur: 'Ouvrant à la française 2 vantaux, seuil réduit' },
        { cle: 'surface', valeur: '3,08', unite: 'm²' },
        { cle: 'fermeture', valeur: 'Crémone simple, béquille noire' },
      ],
      benefice:
        'Un grand accès vitré qui ouvre le séjour-cuisine sur l’extérieur et fait entrer la lumière. Le double vitrage isolant (argon, couche peu émissive) aide à garder la chaleur, et le seuil réduit facilite le passage au quotidien.',
      variantes: [varIsolation, varSolaire],
      prixUnitaire: 1701.42,
      quantite: 4,
      totalHt: 6805.68,
    }),
    poste({
      id: 'pos-2',
      pos: 2,
      designation: 'Fenêtre 2 vantaux 1000 × 1200 — Séjour / cuisine (RDC)',
      piece: 'RDC · Séjour / cuisine',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '1000 × 1200', unite: 'mm' },
        coloris7016,
        vitrageIsolant,
        { cle: 'ouverture', valeur: 'Ouvrant à la française 2 vantaux' },
        { cle: 'surface', valeur: '1,2', unite: 'm²' },
      ],
      benefice:
        'Une fenêtre à deux ouvrants pour aérer largement le séjour-cuisine, avec le même vitrage isolant que le reste des menuiseries pour un confort homogène.',
      variantes: [varIsolation],
      prixUnitaire: 981.25,
      quantite: 4,
      totalHt: 3925.0,
    }),
    poste({
      id: 'pos-3',
      pos: 3,
      designation: 'Fenêtre 2 vantaux 1000 × 1200 — Chambres (RDC)',
      piece: 'RDC · Chambres',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '1000 × 1200', unite: 'mm' },
        coloris7016,
        vitrageIsolant,
        { cle: 'ouverture', valeur: 'Ouvrant à la française 2 vantaux' },
        { cle: 'surface', valeur: '1,2', unite: 'm²' },
      ],
      benefice:
        'Les fenêtres des chambres : lumière et aération à deux vantaux, vitrage isolant pour des nuits plus confortables été comme hiver.',
      variantes: [varIsolation],
      prixUnitaire: 981.25,
      quantite: 8,
      totalHt: 7850.0,
    }),
    poste({
      id: 'pos-4',
      pos: 4,
      designation: 'Oscillo-battant 500 × 1000 — Salle de bain, verre dépoli (RDC)',
      piece: 'RDC · Salle de bain',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '500 × 1000', unite: 'mm' },
        coloris7016,
        { cle: 'vitrage', valeur: 'Feuilleté acoustique SP10, dépoli (intimité), argon' },
        { cle: 'ouverture', valeur: 'Oscillo-battant (ouverture + soufflet)' },
        { cle: 'surface', valeur: '0,5', unite: 'm²' },
      ],
      performances: etancheiteA0,
      benefice:
        'La fenêtre de salle de bain : le verre dépoli préserve l’intimité, le vitrage feuilleté renforce sécurité et calme, et l’ouverture en soufflet permet d’aérer sans tout ouvrir.',
      variantes: [
        { direction: 'Plus de discrétion', effet: 'un dépoli déjà prévu ; possible plus opacifiant' },
      ],
      prixUnitaire: 578.72,
      quantite: 4,
      totalHt: 2314.88,
    }),
    poste({
      id: 'pos-5',
      pos: 5,
      designation: 'Porte d’entrée 1000 × 2200 — aspect bois (RDC)',
      piece: 'RDC · Entrée',
      attributs: [
        gammeKanada,
        { cle: 'dimensions', valeur: '1000 × 2200', unite: 'mm' },
        { cle: 'coloris', valeur: 'Faux-bois chêne doré (classe 4)' },
        { cle: 'vitrage', valeur: 'Panneau sandwich plein, double tôle aluminium' },
        { cle: 'ouverture', valeur: 'Ouvrant 1 vantail' },
        { cle: 'fermeture', valeur: 'Serrure 3 points + gâche réglable' },
        { cle: 'surface', valeur: '2,2', unite: 'm²' },
      ],
      benefice:
        'Une porte d’entrée à l’aspect chaleureux du bois (chêne doré), avec un panneau plein isolant et une serrure 3 points pour la sécurité et la tranquillité au quotidien.',
      variantes: [
        { direction: 'Plus de sécurité', effet: 'des options de serrure/vitrage renforcés selon le besoin' },
        { direction: 'Plus de style', effet: 'd’autres finitions et coloris disponibles' },
      ],
      prixUnitaire: 2359.23,
      quantite: 4,
      totalHt: 9436.92,
    }),
    poste({
      id: 'pos-6',
      pos: 6,
      designation: 'Porte-fenêtre 1400 × 2200 — Séjour / cuisine (R+1)',
      piece: 'R+1 · Séjour / cuisine',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '1400 × 2200', unite: 'mm' },
        coloris7016,
        vitrageIsolant,
        { cle: 'ouverture', valeur: 'Ouvrant à la française 2 vantaux, seuil réduit' },
        { cle: 'surface', valeur: '3,08', unite: 'm²' },
      ],
      benefice:
        'Comme au rez-de-chaussée, un grand accès vitré pour le séjour-cuisine de l’étage : lumière généreuse et vitrage isolant, avec seuil réduit pour un passage aisé.',
      variantes: [varIsolation, varSolaire],
      prixUnitaire: 1701.42,
      quantite: 4,
      totalHt: 6805.68,
    }),
    poste({
      id: 'pos-7',
      pos: 7,
      designation: 'Fenêtre 2 vantaux 1000 × 1200 — Chambres (R+1)',
      piece: 'R+1 · Chambres',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '1000 × 1200', unite: 'mm' },
        coloris7016,
        vitrageIsolant,
        { cle: 'ouverture', valeur: 'Ouvrant à la française 2 vantaux' },
        { cle: 'surface', valeur: '1,2', unite: 'm²' },
      ],
      benefice:
        'Les fenêtres des chambres de l’étage : deux vantaux pour aérer, vitrage isolant pour le confort thermique.',
      variantes: [varIsolation],
      prixUnitaire: 981.25,
      quantite: 4,
      totalHt: 3925.0,
    }),
    poste({
      id: 'pos-8',
      pos: 8,
      designation: 'Oscillo-battant 500 × 1000 — Salle de bain, verre dépoli (R+1)',
      piece: 'R+1 · Salle de bain',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '500 × 1000', unite: 'mm' },
        coloris7016,
        { cle: 'vitrage', valeur: 'Feuilleté acoustique SP10, dépoli (intimité), argon' },
        { cle: 'ouverture', valeur: 'Oscillo-battant (ouverture + soufflet)' },
        { cle: 'surface', valeur: '0,5', unite: 'm²' },
      ],
      performances: etancheiteA0,
      benefice:
        'La fenêtre de salle de bain de l’étage : verre dépoli pour l’intimité, feuilleté pour la sécurité et le calme, ouverture soufflet pour aérer facilement.',
      variantes: [{ direction: 'Plus de discrétion', effet: 'dépoli déjà prévu' }],
      prixUnitaire: 578.72,
      quantite: 4,
      totalHt: 2314.88,
    }),
    poste({
      id: 'pos-9',
      pos: 9,
      designation: 'Oscillo-battant 500 × 1000 — Cuisine (R+1)',
      piece: 'R+1 · Cuisine',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '500 × 1000', unite: 'mm' },
        coloris7016,
        { cle: 'vitrage', valeur: 'Feuilleté acoustique SP10, argon, couche peu émissive' },
        { cle: 'ouverture', valeur: 'Oscillo-battant (ouverture + soufflet)' },
        { cle: 'surface', valeur: '0,5', unite: 'm²' },
      ],
      performances: etancheiteA0,
      benefice:
        'Petite fenêtre de cuisine oscillo-battante : aération facile en position soufflet et vitrage feuilleté pour plus de sécurité et de confort acoustique.',
      variantes: [varIsolation],
      prixUnitaire: 568.58,
      quantite: 4,
      totalHt: 2274.32,
    }),
    poste({
      id: 'pos-10',
      pos: 10,
      designation: 'Oscillo-battant 500 × 1000 — Cellier (R+1)',
      piece: 'R+1 · Cellier',
      attributs: [
        gammeKassiopee,
        { cle: 'dimensions', valeur: '500 × 1000', unite: 'mm' },
        coloris7016,
        { cle: 'vitrage', valeur: 'Feuilleté acoustique SP10, argon, couche peu émissive' },
        { cle: 'ouverture', valeur: 'Oscillo-battant (ouverture + soufflet)' },
        { cle: 'surface', valeur: '0,5', unite: 'm²' },
      ],
      performances: etancheiteA0,
      benefice:
        'Fenêtre de cellier oscillo-battante : un point d’aération pratique et sûr, avec le même niveau de finition que le reste du logement.',
      variantes: [varIsolation],
      prixUnitaire: 568.58,
      quantite: 4,
      totalHt: 2274.32,
    }),
    poste({
      id: 'pos-11',
      pos: 11,
      designation: 'Porte d’entrée 1000 × 2200 — aspect bois (R+1)',
      piece: 'R+1 · Entrée',
      attributs: [
        gammeKanada,
        { cle: 'dimensions', valeur: '1000 × 2200', unite: 'mm' },
        { cle: 'coloris', valeur: 'Faux-bois chêne doré (classe 4)' },
        { cle: 'vitrage', valeur: 'Panneau sandwich plein, double tôle aluminium' },
        { cle: 'ouverture', valeur: 'Ouvrant 1 vantail' },
        { cle: 'fermeture', valeur: 'Serrure 3 points + gâche réglable' },
        { cle: 'surface', valeur: '2,2', unite: 'm²' },
      ],
      benefice:
        'La porte d’entrée de l’étage, à l’aspect chêne doré chaleureux : panneau plein isolant et serrure 3 points pour la sécurité.',
      variantes: [
        { direction: 'Plus de sécurité', effet: 'options de serrure/vitrage renforcés' },
        { direction: 'Plus de style', effet: 'autres finitions et coloris' },
      ],
      prixUnitaire: 2359.23,
      quantite: 4,
      totalHt: 9436.92,
    }),
    poste({
      id: 'pos-12',
      pos: 12,
      designation: 'Garde-corps rampant barreaudé — Terrasses',
      piece: 'Terrasses (R+1)',
      attributs: [
        { cle: 'gamme', valeur: 'Kawneer 1800 Kadence' },
        { cle: 'coloris', valeur: 'Gris anthracite, assorti aux menuiseries' },
        { cle: 'ouverture', valeur: 'Barreaudage vertical, main-courante plate, pose sur dalle' },
        { cle: 'dimensions', valeur: 'Hauteur 1010 mm — 24 ml au total (6 ml/appartement)' },
      ],
      benefice:
        'Un garde-corps sobre et assorti aux fenêtres (gris anthracite) pour sécuriser les terrasses et rampes en hauteur, sans alourdir la ligne de la façade.',
      variantes: [{ direction: 'Plus de vue', effet: 'un remplissage verre en option' }],
      prixUnitaire: 350.0,
      quantite: 24,
      totalHt: 8400.0,
      preuves: GARANTIES,
      pose: false,
    }),
    poste({
      id: 'pos-13',
      pos: 13,
      designation: 'Persiennes aluminium 1400 × 2200 — aspect bois (RDC)',
      piece: 'RDC · Façades',
      attributs: [
        { cle: 'materiau', valeur: 'Aluminium (aspect bois)' },
        { cle: 'dimensions', valeur: '1400 × 2200', unite: 'mm' },
        { cle: 'ouverture', valeur: 'Battantes sur gonds, espagnolette, arrêts marseillais' },
      ],
      benefice:
        'Des persiennes aluminium à l’aspect bois : occultation, protection solaire et sécurité, avec le charme des volets traditionnels corses — mais sans l’entretien du bois.',
      variantes: [
        { direction: 'Plus de confort', effet: 'une motorisation possible' },
        { direction: 'Plus de couleur', effet: 'd’autres teintes disponibles' },
      ],
      prixUnitaire: 1335.0,
      quantite: 4,
      totalHt: 5340.0,
      pose: false,
    }),
    poste({
      id: 'pos-14',
      pos: 14,
      designation: 'Persiennes aluminium 1000 × 2200 — aspect bois (RDC)',
      piece: 'RDC · Façades',
      attributs: [
        { cle: 'materiau', valeur: 'Aluminium (aspect bois)' },
        { cle: 'dimensions', valeur: '1000 × 2200', unite: 'mm' },
        { cle: 'ouverture', valeur: 'Battantes sur gonds, espagnolette, arrêts marseillais' },
      ],
      benefice:
        'Persiennes aluminium aspect bois pour les autres ouvertures du rez-de-chaussée : occultation et protection, esthétique traditionnelle sans entretien.',
      variantes: [{ direction: 'Plus de confort', effet: 'motorisation possible' }],
      prixUnitaire: 840.0,
      quantite: 12,
      totalHt: 10080.0,
      pose: false,
    }),
    poste({
      id: 'pos-15',
      pos: 15,
      designation: 'Persiennes aluminium 1400 × 2200 — aspect bois (R+1)',
      piece: 'R+1 · Façades',
      attributs: [
        { cle: 'materiau', valeur: 'Aluminium (aspect bois)' },
        { cle: 'dimensions', valeur: '1400 × 2200', unite: 'mm' },
        { cle: 'ouverture', valeur: 'Battantes sur gonds, espagnolette, arrêts marseillais' },
      ],
      benefice:
        'Les persiennes aluminium aspect bois de l’étage : mêmes protection et charme traditionnel que le rez-de-chaussée.',
      variantes: [{ direction: 'Plus de confort', effet: 'motorisation possible' }],
      prixUnitaire: 1335.0,
      quantite: 4,
      totalHt: 5340.0,
      pose: false,
    }),
    poste({
      id: 'pos-16',
      pos: 16,
      designation: 'Persiennes aluminium — aspect bois (R+1)',
      piece: 'R+1 · Façades',
      attributs: [
        { cle: 'materiau', valeur: 'Aluminium (aspect bois)' },
        { cle: 'ouverture', valeur: 'Battantes sur gonds, espagnolette, arrêts marseillais' },
      ],
      benefice:
        'Complément de persiennes aluminium aspect bois pour l’étage, dans la même finition que l’ensemble.',
      variantes: [{ direction: 'Plus de confort', effet: 'motorisation possible' }],
      prixUnitaire: 840.0,
      quantite: 4,
      totalHt: 3360.0,
      pose: false,
    }),
    poste({
      id: 'pos-17',
      pos: 17,
      designation: 'Livraison, manutention, pose et réglages',
      piece: 'Projet',
      attributs: [{ cle: 'pose', valeur: 'Pose par poseurs qualifiés, conforme DTU 36.5' }],
      benefice:
        'La mise en œuvre complète : livraison, manutention, pose et réglages par des poseurs qualifiés, dans les règles de l’art (DTU 36.5). C’est ce qui garantit une menuiserie qui fonctionne et dure.',
      variantes: [],
      prixUnitaire: 9920.0,
      quantite: 1,
      totalHt: 9920.0,
      preuves: GARANTIES,
      pose: false,
    }),
  ],
  // Plans d'exemple (schématiques) + repères de démonstration. Dans le produit,
  // le pro importe ses vrais plans et place lui-même les repères (voir HANDOFF).
  plansImages: [
    { id: 'rdc', nom: 'RDC', image: '/plans/rdc.svg' },
    { id: 'r1', nom: 'R+1', image: '/plans/r1.svg' },
  ],
  reperes: [
    // RDC (logement T3 type)
    { posteId: 'pos-1', planId: 'rdc', x: 33.3, y: 95 }, // porte-fenêtre séjour (Sud)
    { posteId: 'pos-2', planId: 'rdc', x: 3.3, y: 72.5 }, // fenêtre séjour (Ouest)
    { posteId: 'pos-3', planId: 'rdc', x: 17.3, y: 5 }, // chambre 1
    { posteId: 'pos-3', planId: 'rdc', x: 47.3, y: 5 }, // chambre 2
    { posteId: 'pos-4', planId: 'rdc', x: 80, y: 5 }, // salle de bain
    { posteId: 'pos-5', planId: 'rdc', x: 96.7, y: 72.5 }, // porte d'entrée
    // R+1 (logement T2 type)
    { posteId: 'pos-6', planId: 'r1', x: 73.3, y: 47.5 }, // porte-fenêtre séjour
    { posteId: 'pos-7', planId: 'r1', x: 25, y: 5 }, // chambre
    { posteId: 'pos-9', planId: 'r1', x: 47.3, y: 50 }, // oscillo cuisine
    { posteId: 'pos-10', planId: 'r1', x: 80.7, y: 50 }, // oscillo cellier
    { posteId: 'pos-11', planId: 'r1', x: 96.7, y: 25 }, // porte d'entrée
  ],
};
