'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { login } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Identifiants invalides.');
    }
  };

  return (
    <Card>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
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
        {error && <p style={{ color: 'crimson', marginBottom: '12px' }}>{error}</p>}
        <Button type="submit">Se connecter</Button>
      </form>
    </Card>
  );
}
