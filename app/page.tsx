import Link from 'next/link';
import { getAllBuku, getAllPeminjaman } from '@/lib/api';

export const metadata = {
  title: 'Beranda — Sistem Perpustakaan Digital',
};

export default async function DashboardPage() {
  let bukuList = [];
  let peminjamanList = [];
  let error = null;

  try {
    [bukuList, peminjamanList] = await Promise.all([
      getAllBuku(),
      getAllPeminjaman(),
    ]);
  } catch {
    error = 'Koneksi ke server backend gagal. Pastikan layanan backend aktif di port 5000.';
  }

  const totalBuku = bukuList.length;
  const totalStok = bukuList.reduce((sum: number, b: { stok: number }) => sum + b.stok, 0);
  const dipinjam = peminjamanList.filter((p: { is_return: boolean }) => !p.is_return).length;
  const dikembalikan = peminjamanList.filter((p: { is_return: boolean }) => p.is_return).length;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Panel Admin Perpustakaan</h1>
          <p className="page-subtitle">Sistem Informasi Manajemen Koleksi & Sirkulasi Buku</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Ringkasan Statistik */}
      <div className="stats-grid-3">
        <div className="stat-box">
          <div className="stat-label">Total Koleksi Buku</div>
          <div className="stat-value">{totalBuku} <span className="stat-unit">Judul</span></div>
          <div className="stat-sub">Total ketersediaan: {totalStok} eksemplar</div>
        </div>

        <div className="stat-box stat-highlight-blue">
          <div className="stat-label">Sedang Dipinjam</div>
          <div className="stat-value">{dipinjam} <span className="stat-unit">Buku</span></div>
          <div className="stat-sub">Sirkulasi aktif saat ini</div>
        </div>

        <div className="stat-box stat-highlight-teal">
          <div className="stat-label">Sirkulasi Selesai</div>
          <div className="stat-value">{dikembalikan} <span className="stat-unit">Transaksi</span></div>
          <div className="stat-sub">Buku telah dikembalikan</div>
        </div>
      </div>

      {/* Grid Content Utama */}
      <div className="dashboard-grid">
        {/* Kolom Kiri: Katalog Buku */}
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Katalog Terbaru</h2>
              <p className="card-subtitle">Daftar buku yang tersedia di perpustakaan</p>
            </div>
            <Link href="/buku/tambah" className="btn-primary btn-sm">
              + Tambah Buku
            </Link>
          </div>

          {bukuList.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada data buku dalam katalog.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Judul Buku</th>
                    <th>Penulis</th>
                    <th className="text-right">Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {bukuList.slice(0, 5).map((buku: { _id: string; judul: string; author: string; stok: number }) => (
                    <tr key={buku._id}>
                      <td className="font-medium">{buku.judul}</td>
                      <td className="text-muted">{buku.author}</td>
                      <td className="text-right">
                        <span className={`badge ${buku.stok > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {buku.stok} unit
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="card-footer">
                <Link href="/buku" className="link-action">Lihat Seluruh Katalog &rarr;</Link>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Aktivitas Peminjaman */}
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Sirkulasi Terakhir</h2>
              <p className="card-subtitle">Riwayat transaksi peminjaman buku</p>
            </div>
            <Link href="/peminjaman/tambah" className="btn-primary btn-sm">
              + Pinjam Buku
            </Link>
          </div>

          {peminjamanList.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada aktivitas peminjaman.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Peminjam</th>
                    <th>Buku</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {peminjamanList.slice(0, 5).map((p: { _id: string; nama_peminjam: string; id_buku: { judul: string } | string; is_return: boolean }) => (
                    <tr key={p._id}>
                      <td className="font-medium">{p.nama_peminjam}</td>
                      <td className="text-muted">
                        {typeof p.id_buku === 'object' ? p.id_buku.judul : '—'}
                      </td>
                      <td>
                        <span className={`badge ${p.is_return ? 'badge-success' : 'badge-warning'}`}>
                          {p.is_return ? 'Kembali' : 'Dipinjam'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="card-footer">
                <Link href="/peminjaman" className="link-action">Lihat Seluruh Sirkulasi &rarr;</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
