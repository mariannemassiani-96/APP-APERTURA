/**
 * Enregistrement du secteur MENUISERIE auprès du moteur.
 *
 * Le secteur pousse SA donnée dans les registres du core (ontologie + offres).
 * Le moteur n'importe jamais ce fichier : c'est l'inverse. Importer ce module
 * (via le barrel /sectors) suffit à rendre le secteur disponible dans l'app.
 */

import { enregistrerOffre } from '@/core/data/memoryRepository';
import { enregistrerOntologie } from '@/core/ontology/registry';

import { connaissancesMenuiserie } from './knowledge';
import { ontologieMenuiserie } from './ontology';
import { offreAstolfi } from './seed.astolfi';
import { offreExempleMenuiserie } from './seed.offre';

enregistrerOntologie(ontologieMenuiserie);
enregistrerOffre(offreExempleMenuiserie);
enregistrerOffre(offreAstolfi);

export { connaissancesMenuiserie, ontologieMenuiserie, offreExempleMenuiserie, offreAstolfi };

/** Base de connaissances par secteur, résolue par la route « Demander ». */
export const connaissancesParSecteur: Record<string, typeof connaissancesMenuiserie> = {
  menuiserie: connaissancesMenuiserie,
};
