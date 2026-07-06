import { NextResponse } from 'next/server';

// Enregistre les secteurs (ontologies + offres seed) au chargement du module.
import '@/sectors';
import { connaissancesDuSecteur } from '@/sectors';
import { repository } from '@/core/data';
import { getLlmClient, serialiserContexte, type LlmMessage } from '@/core/llm';
import { construireContexteFaits } from '@/core/llm/contexteOffre';
import { getOntologie } from '@/core/ontology/registry';

export const runtime = 'nodejs';

/**
 * Route « Demander ».
 *
 * Nourrit la couche LLM UNIQUEMENT avec : les faits de CETTE offre + la base de
 * connaissances du secteur. Consigne système stricte : n'affirmer que ce qui est
 * dans les faits, ne jamais inventer de chiffre, dire « je ne sais pas » sinon.
 */
export async function POST(req: Request) {
  let corps: { offreId?: string; question?: string; historique?: LlmMessage[] };
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const { offreId, question, historique = [] } = corps;
  if (!offreId || !question) {
    return NextResponse.json({ erreur: 'offreId et question sont requis.' }, { status: 400 });
  }

  const offre = await repository.getOffre(offreId);
  if (!offre) {
    return NextResponse.json({ erreur: 'Offre introuvable.' }, { status: 404 });
  }

  const ontologie = getOntologie(offre.secteur);
  const connaissances = connaissancesDuSecteur(offre.secteur);
  const contexte = construireContexteFaits(offre, ontologie, connaissances);

  const consigne = [
    `Tu es l'assistant du devis émis par « ${offre.pro.nom} » pour « ${offre.client.nom} ».`,
    `Tu aides un particulier à COMPRENDRE ce devis, en langage clair, chaleureux et sobre.`,
    ``,
    `RÈGLES ABSOLUES :`,
    `- Tu ne t'appuies QUE sur les FAITS fournis ci-dessous et la base de connaissances.`,
    `- Tu n'inventes JAMAIS un chiffre, une valeur ou une caractéristique. Tout chiffre vient des faits.`,
    `- Si l'information n'est pas dans les faits, dis-le franchement et invite à demander au professionnel.`,
    `- Tu ne donnes pas de référence-système technique copiable ; tu parles bénéfices et usages.`,
    `- Réponses courtes, concrètes, sans jargon. Tu peux citer les faits utiles.`,
    ``,
    `FAITS DE L'OFFRE ET BASE DE CONNAISSANCES (source unique) :`,
    serialiserContexte(contexte),
  ].join('\n');

  const messages: LlmMessage[] = [
    { role: 'system', content: consigne },
    ...historique.filter((m) => m.role === 'user' || m.role === 'assistant'),
    { role: 'user', content: question },
  ];

  try {
    const client = getLlmClient();
    const reponse = await client.complete(messages);
    return NextResponse.json({ reponse, fournisseur: client.nom });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue.';
    return NextResponse.json(
      { erreur: `L'assistant est momentanément indisponible. (${message})` },
      { status: 502 },
    );
  }
}
