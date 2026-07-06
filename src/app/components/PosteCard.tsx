'use client';

import { useId, useState } from 'react';

import type { Poste } from '@/core/model/offre';

import { PerformanceBadge } from './PerformanceBadge';
import { PrixTag } from './PrixTag';
import { Variantes } from './Variantes';
import type { Lexique } from './types';

/**
 * Un poste du devis, présenté comme une ligne rassurante et cliquable.
 * Replié : il ressemble à une ligne de devis. Déplié : il révèle le bénéfice en
 * clair, les attributs, les performances (badge promesse/preuve), les variantes,
 * les preuves. La première ouverture déclenche la trace de consultation.
 */
export function PosteCard({
  poste,
  lexique,
  onConsulter,
}: {
  poste: Poste;
  lexique: Lexique;
  onConsulter: (posteId: string) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const regionId = useId();

  function basculer() {
    const prochain = !ouvert;
    setOuvert(prochain);
    if (prochain) onConsulter(poste.id);
  }

  const labelPerf = (cle: string) => lexique.performances[cle]?.label ?? cle;
  const aidePerf = (cle: string) => lexique.performances[cle]?.aide;
  const labelAttr = (cle: string) => lexique.attributs[cle]?.label ?? cle;

  return (
    <article className="overflow-hidden rounded-xl2 border border-noir/10 bg-white shadow-carte transition hover:shadow-carteHover">
      <button
        type="button"
        onClick={basculer}
        aria-expanded={ouvert}
        aria-controls={regionId}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold">{poste.identite.designation}</h3>
            {poste.localisation?.piece && (
              <span className="shrink-0 rounded-full bg-creme px-2 py-0.5 text-[11px] font-medium text-noir/60">
                {poste.localisation.piece}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-noir/45">Réf. {poste.identite.reference}</p>
        </div>
        <div className="hidden sm:block">
          <PrixTag prix={poste.prix} />
        </div>
        <span
          aria-hidden
          className={`shrink-0 text-cuivre transition-transform duration-200 ${ouvert ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {/* Prix visible sur mobile (masqué dans l'en-tête compact). */}
      <div className="px-5 pb-2 sm:hidden">
        <PrixTag prix={poste.prix} />
      </div>

      {ouvert && (
        <div id={regionId} className="border-t border-noir/10 px-5 py-5">
          {/* Bénéfice en langage clair — le « pourquoi pour vous ». */}
          <p className="rounded-lg bg-maquis/5 px-4 py-3 text-[15px] leading-relaxed text-noir/80">
            {poste.benefice.texte}
          </p>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {/* Performances */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-noir/50">
                Performances
              </h4>
              <ul className="space-y-2.5">
                {poste.performances.map((perf) => (
                  <li key={perf.cle} className="text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{labelPerf(perf.cle)}</span>
                      <PerformanceBadge statut={perf.statut} />
                    </div>
                    <div className="mt-0.5 tabular-nums text-noir/80">
                      {perf.valeur}
                      {perf.unite ? ` ${perf.unite}` : ''}
                    </div>
                    {aidePerf(perf.cle) && (
                      <p className="mt-0.5 text-xs text-noir/45">{aidePerf(perf.cle)}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Attributs */}
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-noir/50">
                Caractéristiques
              </h4>
              <dl className="space-y-1.5 text-sm">
                {poste.attributs.map((attr) => (
                  <div key={attr.cle} className="flex justify-between gap-4">
                    <dt className="text-noir/55">{labelAttr(attr.cle)}</dt>
                    <dd className="text-right font-medium">
                      {attr.valeur}
                      {attr.unite ? ` ${attr.unite}` : ''}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <div className="mt-6">
            <Variantes variantes={poste.variantes} />
          </div>

          {/* Preuves */}
          {poste.preuves.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-noir/50">
                Garanties & preuves
              </h4>
              <ul className="flex flex-wrap gap-2">
                {poste.preuves.map((preuve, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-noir/10 bg-creme/60 px-3 py-1 text-xs text-noir/70"
                  >
                    {preuve.libelle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
