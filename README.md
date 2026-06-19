<div align="center">

# 🚀 JOLT
### **Fast & Ultra-Lightweight JavaScript Runtime for Termux**

<img src="docs/jolt.jpg" alt="Jolt Banner" width="400" style="border-radius: 8px; margin: 15px 0; max-width: 100%;"/>

Jolt adalah runtime JavaScript CommonJS yang ringan dan efisien, dibangun di atas **Go** menggunakan compiler engine **Goja**. Runtime ini dirancang khusus untuk perangkat mobile melalui **Termux (Android)** guna memberikan performa tinggi dengan konsumsi daya dan penyimpanan yang minimal.

*Bekerja mirip Node.js/Bun, tetapi dirancang tanpa beban folder raksasa `node_modules`.*

---

[![Go Version](https://img.shields.io/badge/Go-1.21%2B-00ADD8?logo=go&logoColor=white&style=for-the-badge)](https://golang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#-lisensi)
[![Platform](https://img.shields.io/badge/Platform-Termux%20%7C%20Android-brightgreen?style=for-the-badge)](#)
[![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=for-the-badge)](#-roadmap)

</div>



## 💡 Kenapa Jolt?
Pada perangkat mobile (seperti Android melalui Termux), performa V8 engine bawaan Node.js sering kali terlalu berat dan memakan banyak memori RAM. Selain itu, filesystem Android kurang optimal dalam menangani puluhan ribu file kecil bersarang di dalam folder `node_modules`.

Jolt memecahkan masalah ini dengan:
1. **Engine Goja**: Engine JavaScript berbasis Go murni yang jauh lebih ringan dan cepat saat startup.
2. **Centralized Package Directory**: Semua package diunduh langsung ke `.jolt/packages/` secara global/terpusat, tidak ada lagi duplikasi ribuan file kecil di setiap folder proyek Anda.
3. **Startup Instan**: Tanpa overhead pemuatan library V8.

---

## ✨ Fitur Utama
* ⚡ **Eksekusi JavaScript Cepat**: Dukungan penuh sintaks CommonJS (ES5/ES6 dasar).
* 📦 **Package Manager Terintegrasi**: Pasang modul npm langsung menggunakan perintah `jolt add <package>`.
* 🔌 **Modul Bawaan Intuitif**: API standar untuk menangani file (`fs`), jaringan (`net`), sistem (`os`), dan logging (`console`).
* 🔄 **Sistem Caching Pintar**: Pemuatan `require()` otomatis dicache untuk kecepatan eksekusi maksimum.
* 🛠️ **Inisialisasi Cepat**: Mulai proyek baru dalam hitungan detik dengan `jolt init`.
* 🎨 **Visual CLI Indah**: Dilengkapi visualisasi progress bar dan animasi interaktif saat menginstal dependensi.

---

## 📥 Instalasi

### 1. Instalasi Otomatis (Rekomendasi)
Cara termudah dan tercepat untuk memasang Jolt. Skrip ini akan otomatis mendeteksi arsitektur perangkat Anda (ARM64, AMD64, atau ARMv7) dan memasang binary rilis yang sesuai:

```bash
curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/jolt/main/install.sh | bash
```

### 2. Build Mandiri dari Source
Jika ingin mengompilasi sendiri, pastikan sudah memasang Go v1.21 ke atas:

```bash
# Clone repositori
git clone https://github.com/IHx-cmyk/jolt
cd jolt

# Kompilasi source code
go build -o jolt ./cmd/jolt

# Pindahkan ke bin path Termux
mv jolt $PREFIX/bin/
```

---

## 🚀 Panduan Penggunaan

### Inisialisasi Proyek Baru
Membuat file konfigurasi `package.json` dan entry point secara interaktif.
```bash
jolt init
```

### Menjalankan Berkas JavaScript
Menjalankan skrip JS Anda menggunakan runtime Jolt.
```bash
jolt run index.js
```

### Memasang Package NPM
Mengunduh package dan menyimpannya di direktori modul terpusat Jolt.
```bash
jolt add lodash
```

### Informasi Versi Jolt
Menampilkan versi Jolt yang terpasang.
```bash
jolt --version
```

---

## 📝 Contoh Kode

### 1. Membuat skrip `hello.js`
```javascript
console.log("🚀 Hello from Jolt!");

const fs = require('fs');
const os = require('os');

// Membaca Environment variable dan daftar file
console.log("OS Platform:", os.getenv("OSTYPE") || "unknown");
console.log("Files di direktori aktif:", fs.readdirSync("."));
```

Jalankan dengan perintah:
```bash
jolt run hello.js
```

### 2. Memasang dan Menggunakan Lodash
```bash
jolt add lodash
```

Buat kode berikut:
```javascript
const _ = require('lodash');

const data = [1, 2, 3, 4, 5];
console.log("Hasil chunk:", _.chunk(data, 2));
// Output: [[1, 2], [3, 4], [5]]
```

---

## 📁 Struktur Proyek
```text
jolt/
├── cmd/jolt/main.go          # Entry point utama untuk aplikasi CLI
├── internal/
│   ├── engine/               # Runtime Goja + mekanisme require()
│   ├── modules/              # Core API bawaan (console, fs, net, os)
│   ├── pkgmanager/           # Package manager engine (add, install, fetch)
│   ├── init/                 # Implementasi perintah jolt init
│   └── utils/                # Utility, Helper, dan Versioning
├── examples/                 # Kumpulan contoh skrip JavaScript
├── go.mod                    # Modul Go dependency
└── README.md                 # Dokumentasi proyek
```

---

## 📦 Package Manager (Tanpa `node_modules`)
Struktur penyimpanan dependensi Jolt berbeda dari runtime JS biasa:
* **`package.json`**: Tetap menggunakan format berkas package standar industri.
* **Folder `.jolt/packages/`**: Folder terpusat di direktori home pengguna tempat dependensi disimpan.
* **Resolusi Path**: Ketika memanggil `require('lodash')`, Jolt secara otomatis mencari di `.jolt/packages/lodash`.
* **Spesifikasi Versi**: Mendukung pemasangan versi tertentu seperti `jolt add lodash@4`.

---

## 🔌 Module Bawaan
Jolt menyediakan beberapa API inti tanpa perlu instalasi pihak ketiga:

| Module | Fungsi Utama | Contoh Penggunaan |
| :--- | :--- | :--- |
| `console` | Menampilkan log ke terminal dengan formatting warna. | `console.error("Gagal!")` *(teks merah)* |
| `fs` | Akses berkas sinkron (Sync) pada filesystem. | `fs.readdirSync(".")` |
| `net` | Melakukan HTTP request dengan ringkas. | `const res = net.fetch("https://api.github.com")` |
| `os` | Berinteraksi dengan environment dan argumen sistem. | `const args = os.args()` |

---

## 🧪 Pengujian (Testing)

Untuk memastikan runtime berjalan lancar, Anda dapat mencoba memasang package yang membutuhkan formatting warna:

```bash
jolt add chalk
```

Buat file `test.js`:
```javascript
const chalk = require('chalk');
console.log(chalk.green('✔ Hore! chalk dan runtime Jolt berfungsi dengan sempurna!'));
```

Jalankan pengujian:
```bash
jolt run test.js
```

---

## 🗺️ Peta Jalan (Roadmap)

- [x] **v0.1.0** — Core runtime, module resolver CommonJS, dan package manager dasar.
- [ ] **v0.2.0** — Watch mode (`--watch`) & dukungan pembacaan file `.env` otomatis.
- [ ] **v0.3.0** — REPL Interaktif di terminal.
- [ ] **v0.4.0** — Built-in HTTP Server (`Bun.serve`-like API).
- [ ] **v0.5.0** — Dukungan kompilasi TypeScript instan (via esbuild integrations).
- [ ] **v1.0.0** — Rilis stabil utama (production ready).
- [ ] **v1.5.0** — Dukungan parser ES Modules (`import` / `export`).
- [ ] **v2.0.0** — Refactoring total untuk optimalisasi performa ekstrem.

---

## 🤝 Kontribusi
Setiap kontribusi berupa perbaikan bug, penambahan modul bawaan baru, maupun saran peningkatan fitur sangat dihargai!

```bash
# Langkah pengembangan lokal:
git clone https://github.com/IHx-cmyk/jolt
cd jolt
go mod tidy
go build -o jolt ./cmd/jolt
```

Silakan buat Fork, lakukan perubahan, dan kirimkan Pull Request (PR) ke repositori ini.

---

## 📜 Lisensi
Proyek ini dilisensikan di bawah **MIT License**. Lihat berkas lisensi untuk detail selengkapnya.

MIT © 2026 [IHx-cmyk](https://github.com/IHx-cmyk)

---

<div align="center">

**Dibuat seadanya. Modal sebatang rokok dan seglintir harapan user Termux**

</div>
