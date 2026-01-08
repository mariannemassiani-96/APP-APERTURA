'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Button from '../../../../../components/Button';
import Card from '../../../../../components/Card';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Opening3D from '../../../../../components/Opening3D';
import { getOpening } from '../../../../../lib/api';
import { getMe } from '../../../../../lib/auth';
import { openingTypeLabels } from '../../../../../lib/labels';

const FRAME_COLORS = [
  { value: '#1A1A1A', label: 'Noir profond' },
  { value: '#C27A4A', label: 'Cuivre signature' },
  { value: '#4F5E46', label: 'Vert maquis' },
];

type Opening = {
  id: number;
  type: string;
  width: number;
  height: number;
  quantity: number;
};

export default function OpeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const openingId = Number(params.openingId);
  const [opening, setOpening] = useState<Opening | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0].value);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getMe()
      .then(async () => {
        setLoading(true);
        try {
          const data = await getOpening(projectId, openingId);
          setOpening(data);
          setWidth(String(data.width));
          setHeight(String(data.height));
        } catch (err) {
          setError("Impossible de charger l'ouverture.");
        } finally {
          setLoading(false);
        }
      })
      .catch(() => router.push('/login'));
  }, [openingId, projectId, router]);

  const handleSnapshot = () => {
    if (!canvasWrapperRef.current) {
      return;
    }
    const canvas = canvasWrapperRef.current.querySelector('canvas');
    if (!canvas) {
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    setSnapshots((prev) => [dataUrl, ...prev]);
  };

  if (loading) {
    return <Card>Chargement...</Card>;
  }

  if (error || !opening) {
    return (
      <Card>
        <p style={{ color: 'crimson' }}>{error || 'Ouverture introuvable.'}</p>
        <p style={{ marginTop: '12px' }}>
          <Link href={`/projects/${projectId}`}>Retour au projet</Link>
        </p>
      </Card>
    );
  }

  return (
    <div className="grid two">
      <Card>
        <h1>Ouverture — {openingTypeLabels[opening.type]}</h1>
        <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
          <div>
            <label className="label" htmlFor="width">
              Largeur (mm)
            </label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(event) => setWidth(event.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="height">
              Hauteur (mm)
            </label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="frameColor">
              Couleur du cadre
            </label>
            <Select
              id="frameColor"
              value={frameColor}
              onChange={(event) => setFrameColor(event.target.value)}
            >
              {FRAME_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <p style={{ marginTop: '16px' }}>
          <Link href={`/projects/${projectId}`}>Retour au projet</Link>
        </p>
      </Card>
      <Card>
        <h2>Vue 3D paramétrique</h2>
        <div ref={canvasWrapperRef} style={{ marginTop: '12px' }}>
          <Opening3D
            widthMm={Number(width) || opening.width}
            heightMm={Number(height) || opening.height}
            frameColor={frameColor}
          />
        </div>
        <p style={{ marginTop: '12px', fontSize: '12px', color: '#4f5e46' }}>
          Aperçu snapshot (non sauvegardé)
        </p>
        <Button type="button" onClick={handleSnapshot} style={{ marginTop: '8px' }}>
          Snapshot
        </Button>
        {snapshots.length > 0 && (
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {snapshots.map((snap, index) => (
              <Card key={`${snap}-${index}`}>
                <img src={snap} alt={`Snapshot ${index + 1}`} style={{ width: '100%' }} />
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
