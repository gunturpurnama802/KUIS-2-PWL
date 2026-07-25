'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/buku', label: 'Katalog Buku' },
  { href: '/peminjaman', label: 'Data Peminjaman' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="logo-box">GP</div>
          <span className="navbar-title">Perpustakaan <span className="gradient-text">Digital</span></span>
        </Link>

        <nav className="navbar-menu">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`navbar-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="navbar-user">
          <span className="user-dot"></span>
          <span>Guntur Purnama</span>
        </div>
      </div>
    </header>
  );
}
