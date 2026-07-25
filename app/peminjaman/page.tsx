import Link from 'next/link';
import { getAllPeminjaman } from '@/lib/api';
import { Peminjaman, Buku } from '@/lib/types';
import ReturnButton from './ReturnButton';
import DeletePeminjamanButton from './DeletePeminjamanButton';

export const metadata = { title: 'Data Peminjaman — Sistem Perpustakaan Digital' };

export default async function PeminjamanPage() {
  let peminjamanList: Peminjaman[] = [];
  let error = null;

  try {
    peminjamanList = await getAllPeminjaman();
  } catch {
    error = 'Gagal mengambil data peminjaman dari server. Pastikan layanan backend aktif di port 5000.';
  }

  const dipinjam = peminjamanList.filter(p => !p.is_return).length;
  const kembali = peminjamanList.filter(p => p.is_return).length;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Sirkulasi & Peminjaman Buku</h1>
          <p className="page-subtitle">
            Total tercatat: {peminjamanList.length} transaksi | 
            <span style={{ color: '#fbbf24', marginLeft: '6px' }}>Sedang Dipinjam: {dipinjam}</span> |
            <span style={{ color: '#4ade80', marginLeft: '6px' }}>Selesai Dikembalikan: {kembali}</span>
          </p>
        </div>
        <Link href="/peminjaman/tambah" className="btn-primary" id="btn-tambah-peminjaman">
          + Catat Peminjaman
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        {peminjamanList.length === 0 && !error ? (
          <div className="empty-state">
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-primary)' }}>Belum Ada Transaksi</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>Data peminjaman buku akan muncul di sini setelah dicatat.</p>
            <Link href="/peminjaman/tambah" className="btn-primary">
              + Catat Peminjaman
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>No</th>
                  <th>Nama Peminjam</th>
                  <th>Judul Buku</th>
                  <th>Tanggal Pinjam</th>
                  <th>Status Sirkulasi</th>
                  <th style={{ width: '230px', textAlign: 'right' }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanList.map((p, idx) => {
                  const buku = typeof p.id_buku === 'object' ? (p.id_buku as Buku) : null;
                  return (
                    <tr key={p._id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="font-medium">{p.nama_peminjam}</td>
                      <td className="text-muted">{buku ? buku.judul : '—'}</td>
                      <td>{new Date(p.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`badge ${p.is_return ? 'badge-success' : 'badge-warning'}`}>
                          {p.is_return ? 'Dikembalikan' : 'Masih Dipinjam'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {!p.is_return && (
                            <ReturnButton id={p._id} namaPeminjam={p.nama_peminjam} />
                          )}
                          <DeletePeminjamanButton id={p._id} namaPeminjam={p.nama_peminjam} idx={idx} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
