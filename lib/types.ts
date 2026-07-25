export interface Buku {
  _id: string;
  judul: string;
  author: string;
  tahun_terbit: number;
  stok: number;
  createdAt: string;
  updatedAt: string;
}

export interface Peminjaman {
  _id: string;
  id_buku: Buku | string;
  nama_peminjam: string;
  tanggal_pinjam: string;
  is_return: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
