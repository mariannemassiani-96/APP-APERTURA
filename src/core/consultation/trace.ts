/**
 * Trace horodatée des postes consultés — EN MÉMOIRE pour l'instant.
 *
 * Objectif : garder une trace simple de ce que le client final a ouvert/regardé,
 * utile plus tard pour le pro (« votre client s'est attardé sur la sécurité »).
 * Volontairement minimal : un tableau d'événements par offre, sans persistance.
 * Se remplacera par une écriture en base sans changer l'interface.
 */

export interface EvenementConsultation {
  offreId: string;
  posteId: string;
  /** Horodatage ISO 8601. */
  horodatage: string;
}

const evenements: EvenementConsultation[] = [];

/** Enregistre la consultation d'un poste. */
export function tracerConsultation(offreId: string, posteId: string): EvenementConsultation {
  const evenement: EvenementConsultation = {
    offreId,
    posteId,
    horodatage: new Date().toISOString(),
  };
  evenements.push(evenement);
  return evenement;
}

/** Retourne la trace d'une offre, dans l'ordre chronologique. */
export function getTrace(offreId: string): EvenementConsultation[] {
  return evenements.filter((e) => e.offreId === offreId);
}
