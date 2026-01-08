'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMe, logout } from '../lib/auth';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    getMe()
      .then((me) => setUser(me))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" style={{ color: 'white', fontWeight: 700 }}>
          Casa Aperto PRO
        </Link>
        <nav className="nav-links">
          <Link href="/projects">Projets</Link>
          {user?.role === 'admin' && <Link href="/admin/users">Admin</Link>}
          {user ? (
            <button className="button" onClick={handleLogout} type="button">
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
