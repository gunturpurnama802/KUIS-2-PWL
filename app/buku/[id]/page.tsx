import Link from 'next/link';
import { getBukuById } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const buku = await getBukuById(id);
    return { title: `${buku.judul} — Katalog Perpustakaan` };
  } catch {
    return { title: 'Buku tidak ditemukan' };
  }
}

export default async function DetailBukuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let buku = null;
  try {
    buku = await getBukuById(id);
  } catch {
    notFound();
  }

  if (!buku) notFound();

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link href="/buku" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '8px' }}>
              &larr; Kembali ke Katalog
            </Link>
            <h1 className="page-title">Informasi Detail Buku</h1>
          </div>
          <Link href={`/buku/edit/${buku._id}`} className="btn-primary" id="btn-edit-buku">
            Ubah Informasi Buku
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '620px' }}>
        <div className="content-card">
          <div className="card-header" style={{ padding: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{buku.judul}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Kode Registrasi: <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{buku._id}</span></p>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { label: 'Penulis / Author', value: buku.author },
                { label: 'Tahun Penerbitan', value: buku.tahun_terbit.toString() },
                { label: 'Ketersediaan Stok', value: `${buku.stok} unit`, highlight: buku.stok > 0 ? '#4ade80' : '#f87171' },
                { label: 'Tanggal Input', value: new Date(buku.createdAt).toLocaleString('id-ID') },
                { label: 'Pembaruan Terakhir', value: new Date(buku.updatedAt).toLocaleString('id-ID') },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>{label}</span>
                  <span style={{ fontWeight: '600', color: highlight || 'var(--text-primary)', fontSize: '14px' }}>{value}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Status Sirkulasi</span>
                <div>
                  <span className={`badge ${buku.stok > 5 ? 'badge-success' : buku.stok > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {buku.stok > 5 ? 'Tersedia' : buku.stok > 0 ? 'Hampir Habis' : 'Stok Kosong'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
