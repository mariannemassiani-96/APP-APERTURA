'use client';

import { useCallback, useMemo, useState } from 'react';

import type { Offre } from '@/core/model/offre';

import { DemanderPanel } from './DemanderPanel';
import { PosteCard } from './PosteCard';
import { formaterEuros } from './PrixTag';
import type { Lexique } from './types';

/**
 * Vue « devis augmenté » d'une offre.
 *
 * - Applique la marque blanche (couleurs du pro) via des variables CSS.
 * - Rend chaque poste dépliable (PosteCard).
 * - Tient une trace en mémoire des postes consultés (indicateur + POST /api/trace).
 * - Monte l'assistant « Demander ».
 */
export function OffreView({ offre, lexique }: { offre: Offre; lexique: Lexique }) {
  const [consultes, setConsultes] = useState<Set<string>>(new Set());

  const styleMarque = useMemo(
    () =>
      ({
        '--marque-primaire': offre.pro.branding.couleurs.primaire,
        '--marque-accent': offre.pro.branding.couleurs.accent,
        '--marque-encre': offre.pro.branding.couleurs.encre,
        '--marque-fond': offre.pro.branding.couleurs.fond,
      }) as React.CSSProperties,
    [offre.pro.branding],
  );

  const onConsulter = useCallback(
    (posteId: string) => {
      setConsultes((prec) => {
        if (prec.has(posteId)) return prec;
        const suivant = new Set(prec);
        suivant.add(posteId);
        return suivant;
      });
      // Trace côté serveur (en mémoire). Best-effort : on n'interrompt pas l'UX.
      void fetch('/api/trace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ offreId: offre.id, posteId }),
      }).catch(() => {});
    },
    [offre.id],
  );

  const total = offre.postes.reduce((s, p) => s + p.prix.montant, 0);
  const tousProposes = offre.postes.every((p) => p.prix.statut === 'propose');

  return (
    <main style={styleMarque} className="fond-marque min-h-screen pb-28">
      {/* En-tête pro + client */}
      <header className="border-b border-noir/10">
        <div className="mx-auto max-w-3xl px-6 pb-8 pt-10">
          {offre.exemple && (
            <div className="mb-5 rounded-lg border border-cuivre/40 bg-cuivre/10 px-4 py-2 text-sm text-noir/70">
              Devis <strong>exemple</strong> — les valeurs sont des placeholders
              réalistes, à remplacer par la base de faits réelle. Rien n’est présenté
              comme certifié.
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-maquis">
                {lexique.nomSecteur}
              </p>
              <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{offre.pro.nom}</h1>
              {offre.pro.branding.slogan && (
                <p className="mt-1 text-sm italic text-noir/55">{offre.pro.branding.slogan}</p>
              )}
            </div>
            {offre.pro.branding.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={offre.pro.branding.logoUrl} alt={offre.pro.nom} className="h-12 w-auto" />
            )}
          </div>

          <p className="mt-6 text-noir/70">
            Bonjour <strong>{offre.client.nom}</strong>, voici votre devis. Chaque ligne
            se déplie pour tout comprendre en clair : ce que vous obtenez, pourquoi, et
            comment l’ajuster.
          </p>
        </div>
      </header>

      {/* Postes */}
      <section className="mx-auto max-w-3xl space-y-3 px-6 py-8">
        {offre.postes.map((poste) => (
          <PosteCard
            key={poste.id}
            poste={poste}
            lexique={lexique}
            onConsulter={onConsulter}
          />
        ))}
      </section>

      {/* Total + trace */}
      <section className="mx-auto max-w-3xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-noir/10 bg-white px-6 py-5 shadow-carte">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-noir/50">Total indicatif</p>
            <p className="text-2xl font-semibold tabular-nums">{formaterEuros(total)}</p>
            <p className="mt-0.5 text-xs text-noir/45">
              {tousProposes ? 'Prix proposés — à confirmer.' : 'Voir le détail par poste.'}
            </p>
          </div>
          <div className="text-right text-sm text-noir/55">
            <span className="font-medium text-maquis">{consultes.size}</span> / {offre.postes.length}{' '}
            postes consultés
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-noir/40">
          Une question ? Utilisez « Demander » en bas à droite.
        </p>
      </section>

      <DemanderPanel offreId={offre.id} />
    </main>
  );
}
