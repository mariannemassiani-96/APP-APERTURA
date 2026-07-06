import type { DefinitionCle } from '@/core/ontology/types';

/**
 * Vue « à plat » de l'ontologie du secteur, sérialisable et transmise du serveur
 * aux composants client pour afficher des libellés/aides humains à partir des clés.
 */
export interface Lexique {
  nomSecteur: string;
  performances: Record<string, DefinitionCle>;
  attributs: Record<string, DefinitionCle>;
  glossaire: Record<string, string>;
}
