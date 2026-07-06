import { notFound } from 'next/navigation';

// Enregistre les secteurs (ontologies + offres seed) avant tout accès aux données.
import '@/sectors';
import { repository } from '@/core/data';
import { getOntologie } from '@/core/ontology/registry';

import { OffreView } from '@/app/components/OffreView';
import type { Lexique } from '@/app/components/types';

export default async function PageOffre({ params }: { params: { id: string } }) {
  const offre = await repository.getOffre(params.id);
  if (!offre) notFound();

  const ontologie = getOntologie(offre.secteur);
  const lexique: Lexique = {
    nomSecteur: ontologie?.nom ?? offre.secteur,
    performances: ontologie?.performances ?? {},
    attributs: ontologie?.attributs ?? {},
    glossaire: ontologie?.glossaire ?? {},
  };

  return <OffreView offre={offre} lexique={lexique} />;
}
