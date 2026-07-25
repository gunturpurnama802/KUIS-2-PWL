'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePeminjaman } from '@/lib/api';

export default function DeletePeminjamanButton({ id, namaPeminjam, idx }: { id: string; namaPeminjam: string; idx: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePeminjaman(id);
      router.refresh();
    } catch {
      alert('Gagal menghapus data peminjaman dari sistem.');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        id={`btn-hapus-peminjaman-${idx}`}
        className="btn-danger btn-sm"
        onClick={() => setIsOpen(true)}
      >
        Hapus
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px', fontWeight: 'bold' }}>!</div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Konfirmasi Hapus Riwayat</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Yakin ingin menghapus catatan sirkulasi atas nama <strong style={{ color: 'var(--text-primary)' }}>{namaPeminjam}</strong>?
              </p>
              <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>Riwayat yang dihapus tidak dapat dipulihkan.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setIsOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
              <button className="btn-danger" onClick={handleDelete} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
