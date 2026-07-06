import { NextResponse } from 'next/server';

import { getTrace, tracerConsultation } from '@/core/consultation/trace';

export const runtime = 'nodejs';

/**
 * Trace des postes consultés (en mémoire, best-effort).
 * POST { offreId, posteId } -> enregistre. GET ?offreId=… -> lit la trace.
 */
export async function POST(req: Request) {
  let corps: { offreId?: string; posteId?: string };
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  if (!corps.offreId || !corps.posteId) {
    return NextResponse.json({ erreur: 'offreId et posteId sont requis.' }, { status: 400 });
  }

  const evenement = tracerConsultation(corps.offreId, corps.posteId);
  return NextResponse.json({ ok: true, evenement });
}

export function GET(req: Request) {
  const offreId = new URL(req.url).searchParams.get('offreId');
  if (!offreId) {
    return NextResponse.json({ erreur: 'offreId requis.' }, { status: 400 });
  }
  return NextResponse.json({ trace: getTrace(offreId) });
}
