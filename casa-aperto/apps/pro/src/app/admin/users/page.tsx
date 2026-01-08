'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Badge from '../../../components/Badge';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { createUser, getUsers } from '../../../lib/api';
import { getMe } from '../../../lib/auth';

type User = {
  id: number;
  email: string;
  role: 'admin' | 'sales';
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<'admin' | 'sales'>('sales');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    getMe()
      .then((user) => {
        if (user.role !== 'admin') {
          setForbidden(true);
          return;
        }
        loadUsers();
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createUser({ email, password, role });
      setEmail('');
      setPassword('');
      setSuccess('Utilisateur créé.');
      await loadUsers();
    } catch (err) {
      setError('Création impossible.');
    }
  };

  if (forbidden) {
    return (
      <Card>
        <h1>Accès interdit</h1>
        <p style={{ marginTop: '12px' }}>
          Cette section est réservée aux administrateurs.
        </p>
        <p style={{ marginTop: '12px' }}>
          <Link href="/">Retour à l'accueil</Link>
        </p>
      </Card>
    );
  }

  return (
    <div className="grid two">
      <Card>
        <h1>Utilisateurs internes</h1>
        <div style={{ marginTop: '12px', display: 'grid', gap: '12px' }}>
          {users.map((user) => (
            <Card key={user.id}>
              <p style={{ fontWeight: 600 }}>{user.email}</p>
              <p style={{ marginTop: '6px' }}>
                <Badge role={user.role}>{user.role}</Badge>
              </p>
              <p style={{ marginTop: '6px', fontSize: '12px' }}>
                Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </p>
            </Card>
          ))}
        </div>
      </Card>
      <Card>
        <h2>Créer un utilisateur</h2>
        <form onSubmit={handleCreate} style={{ marginTop: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="password">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="label" htmlFor="role">
              Rôle
            </label>
            <Select id="role" value={role} onChange={(event) => setRole(event.target.value as 'admin' | 'sales')}>
              <option value="sales">Sales</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          {error && <p style={{ color: 'crimson', marginBottom: '12px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginBottom: '12px' }}>{success}</p>}
          <Button type="submit">Créer</Button>
        </form>
      </Card>
    </div>
  );
}
