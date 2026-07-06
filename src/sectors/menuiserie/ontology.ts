/**
 * Ontologie du secteur MENUISERIE — 100 % DONNÉE.
 *
 * C'est ici (et nulle part dans /core) que vit le vocabulaire métier : comment
 * traduire chaque clé technique en libellé clair, son unité, son aide, et le
 * sens de lecture (« plus bas = mieux »). Ajouter un secteur = ajouter un fichier
 * comme celui-ci, sans toucher au moteur.
 */

import type { SectorOntology } from '@/core/ontology/types';

export const ontologieMenuiserie: SectorOntology = {
  secteur: 'menuiserie',
  nom: 'Menuiserie',

  performances: {
    isolation_thermique: {
      label: 'Isolation thermique',
      unite: 'W/m²·K',
      aide: 'Capacité à retenir la chaleur (coefficient Uw). Plus la valeur est basse, mieux la fenêtre isole.',
      sensMieux: 'bas',
    },
    isolation_acoustique: {
      label: 'Isolation acoustique',
      unite: 'dB',
      aide: 'Réduction du bruit extérieur (affaiblissement Rw). Plus la valeur est haute, plus c’est silencieux.',
      sensMieux: 'haut',
    },
    etancheite_air: {
      label: 'Étanchéité à l’air',
      aide: 'Classe A*E*V : résistance aux courants d’air, à la pluie et au vent. Plus la classe est élevée, mieux c’est.',
      sensMieux: 'haut',
    },
    resistance_effraction: {
      label: 'Résistance à l’effraction',
      aide: 'Classe RC : temps de résistance à une tentative d’intrusion. Plus la classe est élevée, plus c’est sûr.',
      sensMieux: 'haut',
    },
    facteur_solaire: {
      label: 'Apports solaires',
      aide: 'Facteur solaire (Sw) : part de la chaleur du soleil laissée entrer. Utile en hiver, à maîtriser en été.',
    },
  },

  attributs: {
    dimensions: { label: 'Dimensions', unite: 'mm' },
    materiau: { label: 'Matériau' },
    couleur: { label: 'Couleur' },
    vitrage: { label: 'Vitrage' },
    ouverture: { label: 'Type d’ouverture' },
    profil: { label: 'Profilé' },
  },

  glossaire: {
    Uw: 'Coefficient d’isolation thermique de la fenêtre complète (vitrage + châssis). En W/m²·K, plus il est bas, mieux la fenêtre isole.',
    Rw: 'Indice d’affaiblissement acoustique, en décibels. Plus il est élevé, plus le bruit extérieur est atténué.',
    AEV: 'Classement Air / Eau / Vent : mesure l’étanchéité de la menuiserie. Noté A*E*V (ex. A4 E9A V C4).',
    'double vitrage': 'Deux vitres séparées par une lame de gaz isolant : bon compromis isolation / prix.',
    'triple vitrage': 'Trois vitres, meilleure isolation thermique, plus lourd et plus onéreux.',
    'oscillo-battant': 'Ouverture à la française (battant) OU en soufflet (bascule vers l’intérieur par le haut) pour aérer en sécurité.',
  },
};
