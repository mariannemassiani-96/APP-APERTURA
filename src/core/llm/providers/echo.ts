/**
 * Fournisseur `echo` — mode HORS-LIGNE, déterministe.
 *
 * Ne fait AUCUN appel réseau et ne « connaît » rien d'autre que les faits qu'on
 * lui transmet dans le contexte. Il illustre parfaitement le principe : le
 * langage ne peut pas inventer de chiffre, il ne fait que retrouver et citer les
 * faits pertinents. Si aucun fait ne correspond, il le dit clairement.
 *
 * C'est le provider par défaut : l'app se démontre sans clé API.
 */

import { extraireContexte, type ContexteFaits, type FaitAtome } from '../context';
import type { LlmClient, LlmMessage } from '../types';

/** Minuscule + suppression des accents, pour une comparaison robuste en français. */
function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

/** Mots vides ignorés dans le calcul de pertinence. */
const MOTS_VIDES = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'au', 'aux',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ce', 'cette', 'ces', 'quel',
  'quelle', 'quels', 'quelles', 'est', 'sont', 'pour', 'avec', 'sur', 'dans',
  'que', 'qui', 'quoi', 'comment', 'combien', 'mon', 'ma', 'mes', 'votre', 'vos',
  'pas', 'plus', 'moins', 'son', 'ses',
]);

function motsCles(texte: string): string[] {
  return normaliser(texte)
    .split(/\s+/)
    // On garde les mots >= 2 lettres : les sigles courts et signifiants (Uw, Rw,
    // PVC, alu) comptent ; les petits mots vides français sont filtrés à part.
    .filter((m) => m.length >= 2 && !MOTS_VIDES.has(m));
}

/**
 * Deux mots « se ressemblent » s'ils sont égaux, ou s'ils partagent un préfixe
 * d'au moins 4 lettres (stemming léger : « isole »/« isolation »,
 * « silencieuse »/« silencieux », « bruit »/« bruits »).
 */
function ressemblent(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  return a.slice(0, 4) === b.slice(0, 4);
}

/** Score de pertinence d'un ensemble de mots-clés vis-à-vis de la question. */
function score(motsQuestion: string[], cibles: string[]): number {
  const normalisees = cibles.map(normaliser).filter((c) => c.length > 1);
  let s = 0;
  for (const mot of motsQuestion) {
    if (normalisees.includes(mot)) s += 2; // correspondance exacte
    else if (normalisees.some((c) => ressemblent(c, mot))) s += 1; // variante morphologique
  }
  return s;
}

function repondreDepuisFaits(ctx: ContexteFaits, question: string): string {
  const nomPro = ctx.offre.pro;
  const mots = motsCles(question);

  if (mots.length === 0) {
    return (
      `Bonjour, je réponds à vos questions sur ce devis de ${nomPro}. ` +
      `Vous pouvez m'interroger sur l'isolation, l'acoustique, la sécurité, ` +
      `les dimensions, le prix ou les garanties.`
    );
  }

  const faitsClasses = ctx.faits
    .map((f) => ({ f, s: score(mots, f.motsCles) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  const connaissancesClassees = ctx.connaissances
    .map((c) => ({ c, s: score(mots, c.motsCles) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  if (faitsClasses.length === 0 && connaissancesClassees.length === 0) {
    return (
      `Je ne dispose pas de cette information dans les faits de votre devis, ` +
      `je préfère donc ne pas avancer de chiffre. Vous pouvez m'interroger sur ` +
      `l'isolation thermique, l'acoustique, la sécurité, les dimensions, le prix ` +
      `ou les garanties — ou demander à ${nomPro} pour ce point précis.`
    );
  }

  const morceaux: string[] = [];

  if (faitsClasses.length > 0) {
    const parPoste = new Map<string, FaitAtome[]>();
    for (const { f } of faitsClasses.slice(0, 5)) {
      const liste = parPoste.get(f.designation) ?? [];
      liste.push(f);
      parPoste.set(f.designation, liste);
    }
    for (const [designation, faits] of parPoste) {
      const lignes = faits.map((f) => `• ${f.texte}`).join('\n');
      morceaux.push(`D'après votre devis, pour « ${designation} » :\n${lignes}`);
    }
  }

  if (connaissancesClassees.length > 0) {
    morceaux.push(`Pour éclairer : ${connaissancesClassees[0].c.texte}`);
  }

  return morceaux.join('\n\n');
}

export function creerEchoClient(): LlmClient {
  return {
    nom: 'echo (hors-ligne)',
    async complete(messages: LlmMessage[]): Promise<string> {
      const systeme = messages.find((m) => m.role === 'system')?.content ?? '';
      const question = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
      const ctx = extraireContexte(systeme);

      if (!ctx) {
        return `Je n'ai pas reçu les faits de l'offre : je ne peux pas répondre de façon fiable.`;
      }
      return repondreDepuisFaits(ctx, question);
    },
  };
}
