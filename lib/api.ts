import { Buku, Peminjaman, ApiResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getAllBuku(): Promise<Buku[]> {
  const res = await fetch(`${BASE_URL}/buku`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data buku');
  const json: ApiResponse<Buku[]> = await res.json();
  return json.data;
}

export async function getBukuById(id: string): Promise<Buku> {
  const res = await fetch(`${BASE_URL}/buku/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data buku');
  const json: ApiResponse<Buku> = await res.json();
  return json.data;
}

export async function createBuku(data: Omit<Buku, '_id' | 'createdAt' | 'updatedAt'>): Promise<Buku> {
  const res = await fetch(`${BASE_URL}/buku`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal menambahkan buku');
  const json: ApiResponse<Buku> = await res.json();
  return json.data;
}

export async function updateBuku(id: string, data: Partial<Buku>): Promise<Buku> {
  const res = await fetch(`${BASE_URL}/buku/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal memperbarui data buku');
  const json: ApiResponse<Buku> = await res.json();
  return json.data;
}

export async function deleteBuku(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/buku/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal menghapus buku');
}

export async function getAllPeminjaman(): Promise<Peminjaman[]> {
  const res = await fetch(`${BASE_URL}/peminjaman`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data peminjaman');
  const json: ApiResponse<Peminjaman[]> = await res.json();
  return json.data;
}

export async function getPeminjamanById(id: string): Promise<Peminjaman> {
  const res = await fetch(`${BASE_URL}/peminjaman/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data peminjaman');
  const json: ApiResponse<Peminjaman> = await res.json();
  return json.data;
}

export async function createPeminjaman(data: {
  id_buku: string;
  nama_peminjam: string;
  tanggal_pinjam: string;
}): Promise<Peminjaman> {
  const res = await fetch(`${BASE_URL}/peminjaman`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal menambahkan peminjaman');
  }
  const json: ApiResponse<Peminjaman> = await res.json();
  return json.data;
}

export async function updatePeminjaman(id: string, data: Partial<Peminjaman>): Promise<Peminjaman> {
  const res = await fetch(`${BASE_URL}/peminjaman/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal memperbarui data peminjaman');
  const json: ApiResponse<Peminjaman> = await res.json();
  return json.data;
}

export async function deletePeminjaman(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/peminjaman/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal menghapus data peminjaman');
}
