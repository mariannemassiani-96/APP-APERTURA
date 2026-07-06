/**
 * Couche d'accès aux données (interface).
 *
 * L'UI et les routes API ne connaissent QUE cette interface — jamais la source
 * concrète. Aujourd'hui : implémentation en mémoire à partir de fichiers seed.
 * Demain : implémentation PostgreSQL, sans toucher au reste de l'app.
 */

import type { Offre } from '../model/offre';

export interface OffreRepository {
  /** Récupère une offre par son identifiant (null si absente). */
  getOffre(id: string): Promise<Offre | null>;
  /** Liste toutes les offres disponibles (utile pour l'accueil / la démo). */
  listOffres(): Promise<Offre[]>;
}
