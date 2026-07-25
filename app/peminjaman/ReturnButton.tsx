'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePeminjaman } from '@/lib/api';

export default function ReturnButton({ id, namaPeminjam }: { id: string; namaPeminjam: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = async () => {
    setLoading(true);
    try {
      await updatePeminjaman(id, { is_return: true });
      router.refresh();
    } catch {
      alert('Gagal mengembalikan buku ke sistem!');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        id={`btn-kembalikan-${id}`}
        className="btn-success btn-sm"
        onClick={() => setIsOpen(true)}
      >
        Kembalikan
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 16px', fontWeight: 'bold' }}>✓</div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Proses Pengembalian Buku</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Tandai transaksi atas nama <strong style={{ color: 'var(--text-primary)' }}>{namaPeminjam}</strong> telah selesai / dikembalikan?
              </p>
              <p style={{ color: '#4ade80', fontSize: '12px', marginTop: '6px' }}>Stok buku terkait akan otomatis bertambah +1 dalam katalog.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setIsOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Batal</button>
              <button className="btn-success" onClick={handleReturn} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Memproses...' : 'Ya, Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
