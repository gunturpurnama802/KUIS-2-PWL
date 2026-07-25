'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPeminjaman, getAllBuku } from '@/lib/api';
import { Buku } from '@/lib/types';

export default function TambahPeminjamanPage() {
  const router = useRouter();
  const [bukuList, setBukuList] = useState<Buku[]>([]);
  const [form, setForm] = useState({ id_buku: '', nama_peminjam: '', tanggal_pinjam: '' });
  const [loading, setLoading] = useState(false);
  const [loadingBuku, setLoadingBuku] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAllBuku()
      .then(data => {
        setBukuList(data.filter(b => b.stok > 0));
      })
      .catch(() => setError('Gagal memuat daftar buku dari server'))
      .finally(() => setLoadingBuku(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_buku || !form.nama_peminjam || !form.tanggal_pinjam) {
      setError('Mohon isi seluruh field formulir.');
      return;
    }
    setLoading(true);
    try {
      await createPeminjaman({
        id_buku: form.id_buku,
        nama_peminjam: form.nama_peminjam,
        tanggal_pinjam: form.tanggal_pinjam,
      });
      setSuccess('Peminjaman berhasil dicatat! Stok buku otomatis berkurang -1.');
      setTimeout(() => router.push('/peminjaman'), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mencatat transaksi peminjaman.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <Link href="/peminjaman" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '8px' }}>
          &larr; Kembali ke Data Peminjaman
        </Link>
        <h1 className="page-title">Catat Peminjaman Buku</h1>
        <p className="page-subtitle">Input transaksi peminjaman baru oleh anggota perpustakaan</p>
      </div>

      <div style={{ maxWidth: '580px' }}>
        <div className="content-card" style={{ padding: '28px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} id="form-tambah-peminjaman">
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label className="form-label" htmlFor="id_buku">Pilih Koleksi Buku</label>
                {loadingBuku ? (
                  <div className="form-input" style={{ color: 'var(--text-muted)' }}>Mengambil daftar koleksi buku...</div>
                ) : (
                  <select
                    id="id_buku" name="id_buku"
                    className="form-input"
                    value={form.id_buku}
                    onChange={handleChange}
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">-- Pilih Koleksi --</option>
                    {bukuList.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.judul} — {b.author} (Sisa Stok: {b.stok})
                      </option>
                    ))}
                  </select>
                )}
                {!loadingBuku && bukuList.length === 0 && (
                  <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
                    Mohon maaf, saat ini tidak ada buku yang berstatus tersedia.
                  </p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="nama_peminjam">Nama Peminjam</label>
                <input
                  id="nama_peminjam" name="nama_peminjam" type="text"
                  className="form-input"
                  placeholder="Contoh: Guntur Purnama"
                  value={form.nama_peminjam}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="tanggal_pinjam">Tanggal Transaksi</label>
                <input
                  id="tanggal_pinjam" name="tanggal_pinjam" type="date"
                  className="form-input"
                  value={form.tanggal_pinjam}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '6px', padding: '12px 14px' }}>
                <p style={{ fontSize: '12px', color: '#38bdf8', lineHeight: '1.4' }}>
                  Catatan: Stok pada katalog utama akan berkurang secara otomatis begitu transaksi peminjaman disimpan.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link href="/peminjaman" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Batal</Link>
                <button
                  type="submit" className="btn-primary"
                  disabled={loading || loadingBuku || bukuList.length === 0}
                  style={{ flex: 1, justifyContent: 'center' }}
                  id="btn-submit-pinjam"
                >
                  {loading ? 'Memproses...' : 'Simpan Transaksi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
