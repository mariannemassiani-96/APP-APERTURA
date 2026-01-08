'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { createOpening, getOpenings } from '../../../lib/api';
import { getMe } from '../../../lib/auth';
import { openingTypeLabels, openingTypes } from '../../../lib/labels';

type Opening = {
  id: number;
  type: string;
  width: number;
  height: number;
  quantity: number;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [type, setType] = useState(openingTypes[0]);
  const [width, setWidth] = useState('900');
  const [height, setHeight] = useState('1200');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');

  const loadOpenings = async () => {
    try {
      const data = await getOpenings(projectId);
      setOpenings(data);
    } catch (err) {
      setError('Impossible de charger les ouvertures.');
    }
  };

  useEffect(() => {
    getMe()
      .then(() => loadOpenings())
      .catch(() => router.push('/login'));
  }, [router, projectId]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createOpening(projectId, {
        type,
        width: Number(width),
        height: Number(height),
        quantity: Number(quantity),
      });
      await loadOpenings();
    } catch (err) {
      setError('Création impossible.');
    }
  };

  return (
    <div className="grid two">
      <Card>
        <h1>Ouvertures</h1>
        <ul style={{ marginTop: '12px', paddingLeft: '16px' }}>
          {openings.map((opening) => (
            <li key={opening.id} style={{ marginBottom: '8px' }}>
              {openingTypeLabels[opening.type]} — {opening.width} x {opening.height} mm — x
              {opening.quantity}
              <span style={{ marginLeft: '8px' }}>
                <Link href={`/projects/${projectId}/openings/${opening.id}`}>Voir 3D</Link>
              </span>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: '12px' }}>
          <Link href="/projects">Retour aux projets</Link>
        </p>
      </Card>
      <Card>
        <h2>Nouvelle ouverture</h2>
        <form onSubmit={handleCreate} style={{ marginTop: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="type">
              Type
            </label>
            <Select id="type" value={type} onChange={(event) => setType(event.target.value)}>
              {openingTypes.map((item) => (
                <option key={item} value={item}>
                  {openingTypeLabels[item]}
                </option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: '12px' }}>
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
          <div style={{ marginBottom: '12px' }}>
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
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="quantity">
              Quantité
            </label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          {error && <p style={{ color: 'crimson', marginBottom: '12px' }}>{error}</p>}
          <Button type="submit">Ajouter</Button>
        </form>
      </Card>
    </div>
  );
}
