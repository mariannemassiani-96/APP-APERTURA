'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { createProject, getProjects } from '../../lib/api';
import { getMe } from '../../lib/auth';
import { buildingTypeLabels, buildingTypes } from '../../lib/labels';

type Project = {
  id: number;
  name: string;
  building_type: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [buildingType, setBuildingType] = useState(buildingTypes[0]);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Impossible de charger les projets.');
    }
  };

  useEffect(() => {
    getMe()
      .then(() => loadProjects())
      .catch(() => router.push('/login'));
  }, [router]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await createProject({ name, building_type: buildingType });
      setName('');
      await loadProjects();
    } catch (err) {
      setError('Création impossible.');
    }
  };

  return (
    <div className="grid two">
      <Card>
        <h1>Projets</h1>
        <ul style={{ marginTop: '12px', paddingLeft: '16px' }}>
          {projects.map((project) => (
            <li key={project.id} style={{ marginBottom: '8px' }}>
              <Link href={`/projects/${project.id}`}>
                {project.name} — {buildingTypeLabels[project.building_type]}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2>Nouveau projet</h2>
        <form onSubmit={handleCreate} style={{ marginTop: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="name">
              Nom du projet
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="buildingType">
              Type de bâtiment
            </label>
            <Select
              id="buildingType"
              value={buildingType}
              onChange={(event) => setBuildingType(event.target.value)}
            >
              {buildingTypes.map((type) => (
                <option key={type} value={type}>
                  {buildingTypeLabels[type]}
                </option>
              ))}
            </Select>
          </div>
          {error && <p style={{ color: 'crimson', marginBottom: '12px' }}>{error}</p>}
          <Button type="submit">Créer</Button>
        </form>
      </Card>
    </div>
  );
}
