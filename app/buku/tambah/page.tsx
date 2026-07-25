'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBuku } from '@/lib/api';

export default function TambahBukuPage() {
  const router = useRouter();
  const [form, setForm] = useState({ judul: '', author: '', tahun_terbit: '', stok: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.author || !form.tahun_terbit || !form.stok) {
      setError('Mohon lengkapi semua rincian data!');
      return;
    }
    setLoading(true);
    try {
      await createBuku({
        judul: form.judul,
        author: form.author,
        tahun_terbit: parseInt(form.tahun_terbit),
        stok: parseInt(form.stok),
      });
      setSuccess('Buku berhasil ditambahkan ke dalam katalog!');
      setTimeout(() => router.push('/buku'), 1500);
    } catch {
      setError('Gagal menyimpan data buku. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <Link href="/buku" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '8px' }}>
          &larr; Kembali ke Katalog
        </Link>
        <h1 className="page-title">Tambah Buku Baru</h1>
        <p className="page-subtitle">Input informasi koleksi buku baru untuk dimasukkan ke dalam database</p>
      </div>

      <div style={{ maxWidth: '580px' }}>
        <div className="content-card" style={{ padding: '28px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} id="form-tambah-buku">
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label className="form-label" htmlFor="judul">Judul Buku</label>
                <input
                  id="judul" name="judul" type="text"
                  className="form-input"
                  placeholder="Contoh: Pemrograman Web Lanjut"
                  value={form.judul}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="author">Penulis / Author</label>
                <input
                  id="author" name="author" type="text"
                  className="form-input"
                  placeholder="Contoh: Guntur Purnama"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" htmlFor="tahun_terbit">Tahun Terbit</label>
                  <input
                    id="tahun_terbit" name="tahun_terbit" type="number"
                    className="form-input"
                    placeholder="Contoh: 2024"
                    min="1900" max={new Date().getFullYear()}
                    value={form.tahun_terbit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="stok">Jumlah Stok</label>
                  <input
                    id="stok" name="stok" type="number"
                    className="form-input"
                    placeholder="Contoh: 15"
                    min="0"
                    value={form.stok}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link href="/buku" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Batal
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ flex: 1, justifyContent: 'center' }}
                  id="btn-submit-tambah-buku"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
