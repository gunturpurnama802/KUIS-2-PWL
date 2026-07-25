'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBukuById, updateBuku } from '@/lib/api';

export default function EditBukuPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState('');
  const [form, setForm] = useState({ judul: '', author: '', tahun_terbit: '', stok: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadBuku = useCallback(async (bukuId: string) => {
    try {
      const buku = await getBukuById(bukuId);
      setForm({
        judul: buku.judul,
        author: buku.author,
        tahun_terbit: buku.tahun_terbit.toString(),
        stok: buku.stok.toString(),
      });
    } catch {
      setError('Gagal mengambil data dari sistem.');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      loadBuku(resolvedId);
    });
  }, [params, loadBuku]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.author || !form.tahun_terbit || !form.stok) {
      setError('Mohon isi seluruh data yang diperlukan.');
      return;
    }
    setLoading(true);
    try {
      await updateBuku(id, {
        judul: form.judul,
        author: form.author,
        tahun_terbit: parseInt(form.tahun_terbit),
        stok: parseInt(form.stok),
      });
      setSuccess('Data koleksi buku berhasil diperbarui!');
      setTimeout(() => router.push('/buku'), 1500);
    } catch {
      setError('Gagal memperbarui data buku. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Mengambil data buku...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <Link href="/buku" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '8px' }}>
          &larr; Kembali ke Katalog
        </Link>
        <h1 className="page-title">Ubah Informasi Buku</h1>
        <p className="page-subtitle">Perbarui data atau penyesuaian stok pada katalog</p>
      </div>

      <div style={{ maxWidth: '580px' }}>
        <div className="content-card" style={{ padding: '28px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} id="form-edit-buku">
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label className="form-label" htmlFor="judul">Judul Buku</label>
                <input id="judul" name="judul" type="text" className="form-input" value={form.judul} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label" htmlFor="author">Penulis / Author</label>
                <input id="author" name="author" type="text" className="form-input" value={form.author} onChange={handleChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" htmlFor="tahun_terbit">Tahun Terbit</label>
                  <input id="tahun_terbit" name="tahun_terbit" type="number" className="form-input" min="1900" max={new Date().getFullYear()} value={form.tahun_terbit} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label" htmlFor="stok">Jumlah Stok</label>
                  <input id="stok" name="stok" type="number" className="form-input" min="0" value={form.stok} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link href="/buku" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Batal</Link>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }} id="btn-submit-edit-buku">
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
