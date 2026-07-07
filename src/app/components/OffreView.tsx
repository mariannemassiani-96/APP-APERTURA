'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Offre } from '@/core/model/offre';

import { DemanderPanel } from './DemanderPanel';
import { PlanView } from './PlanView';
import { PosteCard } from './PosteCard';
import { formaterEuros } from './PrixTag';
import type { Lexique } from './types';

type Vue = 'liste' | 'plan';

/**
 * Vue « devis augmenté » d'une offre.
 *
 * - Applique la marque blanche (couleurs du pro) via des variables CSS.
 * - Deux modes : Liste (postes dépliables) et Plan (postes situés dans le logement).
 * - Tient l'état d'ouverture des postes et la trace des postes consultés
 *   (indicateur + POST /api/trace), partagés entre les deux modes.
 * - Monte l'assistant « Demander » (non-bloquant : le devis reste cliquable).
 */
export function OffreView({ offre, lexique }: { offre: Offre; lexique: Lexique }) {
  const [vue, setVue] = useState<Vue>('liste');
  const [ouverts, setOuverts] = useState<Set<string>>(new Set());
  const [consultes, setConsultes] = useState<Set<string>>(new Set());
  const [cibleScroll, setCibleScroll] = useState<string | null>(null);

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

  // Enregistre une consultation (une seule fois) + trace serveur best-effort.
  const marquerConsulte = useCallback(
    (posteId: string) => {
      setConsultes((prec) => {
        if (prec.has(posteId)) return prec;
        const suivant = new Set(prec);
        suivant.add(posteId);
        return suivant;
      });
      void fetch('/api/trace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ offreId: offre.id, posteId }),
      }).catch(() => {});
    },
    [offre.id],
  );

  const basculerPoste = useCallback(
    (posteId: string) => {
      setOuverts((prec) => {
        const suivant = new Set(prec);
        if (suivant.has(posteId)) suivant.delete(posteId);
        else {
          suivant.add(posteId);
          marquerConsulte(posteId);
        }
        return suivant;
      });
    },
    [marquerConsulte],
  );

  // Depuis le plan : basculer en liste, ouvrir le poste, le mettre au centre.
  const voirDetail = useCallback(
    (posteId: string) => {
      setVue('liste');
      setOuverts((prec) => new Set(prec).add(posteId));
      marquerConsulte(posteId);
      setCibleScroll(posteId);
    },
    [marquerConsulte],
  );

  // Défilement vers le poste ciblé une fois la liste rendue.
  useEffect(() => {
    if (vue !== 'liste' || !cibleScroll) return;
    const id = cibleScroll;
    const t = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCibleScroll(null);
    });
    return () => cancelAnimationFrame(t);
  }, [vue, cibleScroll]);

  const total = offre.postes.reduce((s, p) => s + p.prix.montant, 0);
  const tousProposes = offre.postes.every((p) => p.prix.statut === 'propose');
  const aPlan = Boolean(offre.plan && offre.plan.pieces.length > 0);

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

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Sélecteur Liste / Plan */}
        {aPlan && (
          <div
            role="tablist"
            aria-label="Affichage du devis"
            className="mb-6 inline-flex rounded-full border border-noir/10 bg-white p-1 shadow-carte"
          >
            {(['liste', 'plan'] as const).map((mode) => (
              <button
                key={mode}
                role="tab"
                aria-selected={vue === mode}
                onClick={() => setVue(mode)}
                className={[
                  'rounded-full px-5 py-1.5 text-sm font-medium transition',
                  vue === mode ? 'bg-maquis text-creme' : 'text-noir/60 hover:text-noir',
                ].join(' ')}
              >
                {mode === 'liste' ? 'Liste' : 'Plan'}
              </button>
            ))}
          </div>
        )}

        {/* Contenu */}
        {vue === 'plan' && aPlan ? (
          <PlanView
            offre={offre}
            consultes={consultes}
            onConsulter={marquerConsulte}
            onVoirDetail={voirDetail}
          />
        ) : (
          <section className="space-y-3">
            {offre.postes.map((poste) => (
              <PosteCard
                key={poste.id}
                poste={poste}
                lexique={lexique}
                ouvert={ouverts.has(poste.id)}
                onToggle={basculerPoste}
              />
            ))}
          </section>
        )}

        {/* Total + trace */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-noir/10 bg-white px-6 py-5 shadow-carte">
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
      </div>

      <DemanderPanel offreId={offre.id} />
    </main>
  );
}
