/**
 * Pont « cerveau de faits » -> contexte LLM.
 *
 * Transforme une Offre (données exactes) + son ontologie + la base de
 * connaissances du secteur en un ContexteFaits sérialisable, que la couche LLM
 * recevra comme SEULE source. Générique : fonctionne pour tout secteur via
 * l'ontologie, aucune logique menuiserie ici.
 */

import type { Offre } from '../model/offre';
import type { SectorOntology } from '../ontology/types';
import type { ConnaissanceAtome, ContexteFaits, FaitAtome } from './context';

/** Découpe un texte en mots-clés simples (l'indexation fine est faite côté echo). */
function mots(...morceaux: (string | number | undefined)[]): string[] {
  return morceaux
    .filter((m): m is string | number => m !== undefined)
    .join(' ')
    .split(/\s+/)
    .filter((m) => m.length > 1);
}

export function construireContexteFaits(
  offre: Offre,
  ontologie: SectorOntology | undefined,
  connaissances: ConnaissanceAtome[],
): ContexteFaits {
  const labelPerf = (cle: string) => ontologie?.performances[cle]?.label ?? cle;
  const aidePerf = (cle: string) => ontologie?.performances[cle]?.aide ?? '';
  const labelAttr = (cle: string) => ontologie?.attributs[cle]?.label ?? cle;

  const faits: FaitAtome[] = [];

  // On indexe sur la PIÈCE (séjour/chambre/cuisine : discriminante) et le contenu
  // sémantique, PAS sur les mots du type de produit (« fenêtre », « porte »…) qui
  // apparaissent sur tous les postes et brouilleraient la recherche.
  for (const poste of offre.postes) {
    const designation = poste.identite.designation;
    const piece = poste.localisation?.piece;

    for (const perf of poste.performances) {
      const label = labelPerf(perf.cle);
      const unite = perf.unite ? ` ${perf.unite}` : '';
      faits.push({
        posteId: poste.id,
        designation,
        categorie: 'performance',
        texte: `${label} : ${perf.valeur}${unite} (${perf.statut})`,
        // Enrichi avec les mots de l'aide de l'ontologie (bruit, chaleur, sécurité…).
        motsCles: mots(label, perf.cle, aidePerf(perf.cle), piece),
      });
    }

    for (const attr of poste.attributs) {
      const label = labelAttr(attr.cle);
      const unite = attr.unite ? ` ${attr.unite}` : '';
      faits.push({
        posteId: poste.id,
        designation,
        categorie: 'attribut',
        texte: `${label} : ${attr.valeur}${unite}`,
        motsCles: mots(label, attr.cle, String(attr.valeur), piece),
      });
    }

    faits.push({
      posteId: poste.id,
      designation,
      categorie: 'benefice',
      texte: poste.benefice.texte,
      motsCles: mots(piece, 'benefice', 'avantage', 'pourquoi', 'interet'),
    });

    faits.push({
      posteId: poste.id,
      designation,
      categorie: 'prix',
      texte: `Prix ${poste.prix.statut} : ${poste.prix.montant} ${poste.prix.devise ?? 'EUR'}`,
      motsCles: mots('prix', 'cout', 'tarif', 'montant', 'euro', 'combien', piece),
    });

    for (const variante of poste.variantes) {
      faits.push({
        posteId: poste.id,
        designation,
        categorie: 'variante',
        texte: `Option « ${variante.direction} » : ${variante.effet}`,
        motsCles: mots(variante.direction, variante.effet, 'option', 'variante', 'alternative', 'ameliorer', piece),
      });
    }

    for (const preuve of poste.preuves) {
      faits.push({
        posteId: poste.id,
        designation,
        categorie: 'preuve',
        texte: `${preuve.type} : ${preuve.libelle}`,
        motsCles: mots(preuve.type, preuve.libelle, 'garantie', 'certification', 'preuve', piece),
      });
    }
  }

  return {
    offre: {
      id: offre.id,
      secteur: offre.secteur,
      pro: offre.pro.nom,
      client: offre.client.nom,
    },
    faits,
    connaissances,
  };
}
