import type { Variante } from '@/core/model/offre';

/**
 * Variantes exprimées en DIRECTIONS (« plus d'isolation », « plus de sécurité »)
 * et leur effet concret pour le client — jamais une recette technique copiable.
 */
export function Variantes({ variantes }: { variantes: Variante[] }) {
  if (variantes.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-noir/50">
        Et si on ajustait ?
      </h4>
      <ul className="space-y-2">
        {variantes.map((v, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-creme/70 px-3 py-2">
            <span className="mt-0.5 select-none text-cuivre" aria-hidden>
              ↗
            </span>
            <span className="text-sm">
              <span className="font-semibold text-maquis">{v.direction}</span>
              <span className="text-noir/70"> — {v.effet}.</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
