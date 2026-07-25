import Link from 'next/link';
import { getAllBuku } from '@/lib/api';
import DeleteBukuButton from './DeleteBukuButton';

export const metadata = { title: 'Katalog Buku — Sistem Perpustakaan Digital' };

export default async function BukuPage() {
  let bukuList = [];
  let error = null;

  try {
    bukuList = await getAllBuku();
  } catch {
    error = 'Gagal mengambil data katalog. Pastikan layanan backend aktif di port 5000.';
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Katalog Koleksi Buku</h1>
          <p className="page-subtitle">Total ketersediaan {bukuList.length} judul dalam sistem perpustakaan</p>
        </div>
        <Link href="/buku/tambah" className="btn-primary" id="btn-tambah-buku">
          + Tambah Buku
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        {bukuList.length === 0 && !error ? (
          <div className="empty-state">
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-primary)' }}>Katalog Masih Kosong</p>
            <p style={{ fontSize: '13px', marginBottom: '20px' }}>Silakan tambahkan data buku pertama ke dalam katalog.</p>
            <Link href="/buku/tambah" className="btn-primary">
              + Tambah Buku
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>No</th>
                  <th>Judul Buku</th>
                  <th>Penulis</th>
                  <th>Tahun Terbit</th>
                  <th>Stok</th>
                  <th>Status Ketersediaan</th>
                  <th style={{ width: '220px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bukuList.map((buku: { _id: string; judul: string; author: string; tahun_terbit: number; stok: number }, idx: number) => (
                  <tr key={buku._id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="font-medium">{buku.judul}</td>
                    <td className="text-muted">{buku.author}</td>
                    <td>{buku.tahun_terbit}</td>
                    <td className="font-medium">{buku.stok} unit</td>
                    <td>
                      <span className={`badge ${buku.stok > 5 ? 'badge-success' : buku.stok > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {buku.stok > 5 ? 'Tersedia' : buku.stok > 0 ? 'Hampir Habis' : 'Stok Habis'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link href={`/buku/${buku._id}`} className="btn-secondary btn-sm" id={`btn-detail-buku-${idx}`}>
                          Detail
                        </Link>
                        <Link href={`/buku/edit/${buku._id}`} className="btn-secondary btn-sm" id={`btn-edit-buku-${idx}`}>
                          Ubah
                        </Link>
                        <DeleteBukuButton id={buku._id} judul={buku.judul} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
