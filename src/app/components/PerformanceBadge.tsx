import type { StatutPerformance } from '@/core/model/offre';

/**
 * Badge promesse / preuve.
 * - promesse : valeur annoncée (contour cuivre)
 * - preuve   : valeur documentée (plein vert maquis)
 * La distinction est un pilier de confiance : on ne survend pas une promesse.
 */
export function PerformanceBadge({ statut }: { statut: StatutPerformance }) {
  if (statut === 'preuve') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-maquis px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-creme">
        ✓ Preuve
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-cuivre/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cuivre">
      Promesse
    </span>
  );
}
