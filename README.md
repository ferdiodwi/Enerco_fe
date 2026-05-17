# EnergEco GlobalChain - Frontend (Web App)

Frontend repository untuk **EnergEco GlobalChain**, platform distribusi energi bersih yang cerdas dan terintegrasi untuk mendukung UMKM dan kolaborasi lokal. Dibangun dengan fokus pada antarmuka premium, interaktif, dan *mobile-responsive*.

## 🚀 Teknologi yang Digunakan
* **Framework:** React 18
* **Build Tool:** Vite
* **Bahasa:** TypeScript
* **Styling:** Tailwind CSS (dengan palet warna *Emerald* bergaya DevoraV2)
* **Routing:** React Router v6
* **State & Data Fetching:** React Query & Axios
* **Pemetaan (Maps):** React-Leaflet
* **Visualisasi Data:** Recharts
* **Iconography:** Lucide React

## 📦 Fitur Utama UI/UX
1. **Dynamic Role-Based Dashboard:** Tampilan UI dan menu *Sidebar* yang secara dinamis berubah sesuai peran pengguna (Admin, UMKM, Government, Provider, Partner).
2. **Priority Map:** Peta interaktif Leaflet yang menampilkan lokasi geospasial UMKM dan Sumber Energi secara visual.
3. **Marketplace & Katalog:** Tampilan grid katalog produk ramah lingkungan dari UMKM untuk ditawarkan ke *Partner*.
4. **Data Analytics:** Dasbor visual (grafik reduksi emisi, dsb) untuk memantau dampak keberlanjutan.
5. **Autentikasi Cerdas:** *Redirect* otomatis berdasarkan token (Sanctum) ke masing-masing dasbor sesuai profil akses.

---

## 🛠️ Cara Instalasi & Menjalankan Sistem

### 1. Persyaratan Sistem
Pastikan Anda sudah menginstal aplikasi berikut di komputer Anda:
* Node.js (versi 18.x atau lebih baru disarankan)
* npm (Node Package Manager)

### 2. Langkah-langkah Instalasi

**Clone atau Ekstrak Project:**
Masuk ke direktori `Enerco_fe` (repository ini).

**Install Dependencies:**
Jalankan perintah berikut untuk mengunduh semua paket *library* yang dibutuhkan oleh aplikasi:
```bash
npm install
```
*(Catatan: Jika mengalami kendala versi dependensi yang saling terkait, Anda bisa menggunakan `npm install --legacy-peer-deps`)*.

**Konfigurasi Environment:**
Secara *default*, aplikasi React ini dikonfigurasi untuk berkomunikasi dengan API backend di `http://127.0.0.1:8000/api`.
Jika Anda ingin mengubahnya (misalnya saat *deployment*), Anda dapat membuat file `.env` di dalam folder ini dan menambahkan baris:
```env
VITE_API_URL=http://url-backend-anda.com/api
```

### 3. Menjalankan Server Development

Setelah instalasi selesai, jalankan perintah berikut untuk memulai server lokal:
```bash
npm run dev
```

Aplikasi frontend Anda sekarang berjalan di: **`http://localhost:5173`**

### 4. Build untuk Production
Jika aplikasi sudah siap untuk di-*deploy* ke server *hosting* (seperti Vercel, Netlify, atau Nginx), jalankan perintah:
```bash
npm run build
```
Perintah ini akan membuat folder `dist/` yang berisi file HTML, CSS, dan JS statis yang sudah di-*minify* dan siap di-hosting.

---
*Desain UI dioptimalkan untuk presentasi kompetisi.*
