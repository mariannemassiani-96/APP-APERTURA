'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Card from '../components/Card';
import { getMe } from '../lib/auth';

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then((user) => setEmail(user.email))
      .catch(() => setEmail(null));
  }, []);

  return (
    <div className="grid two">
      <Card>
        <h1>Casa Aperto PRO</h1>
        <p style={{ marginTop: '12px' }}>
          {email
            ? `Connectée en tant que ${email}`
            : 'Connectez-vous pour accéder aux projets.'}
        </p>
        {!email && (
          <p style={{ marginTop: '12px' }}>
            <Link href="/login">Accéder au login</Link>
          </p>
        )}
      </Card>
      <Card>
        <h2>Actions rapides</h2>
        <ul style={{ marginTop: '12px', paddingLeft: '16px' }}>
          <li>
            <Link href="/projects">Voir les projets</Link>
          </li>
          <li>
            <Link href="/admin/users">Administration utilisateurs</Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
