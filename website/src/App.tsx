import { useState, useEffect } from 'react'

interface PageItem {
  key: string
  title: string
}

const pageOrder: PageItem[] = [
  { key: 'index', title: 'Home' },
  { key: 'installation', title: 'Instalasi' },
  { key: 'usage', title: 'Penggunaan' },
  { key: 'project', title: 'Struktur' },
  { key: 'modules', title: 'Modules' },
  { key: 'roadmap', title: 'Roadmap' },
  { key: 'contributing', title: 'Kontribusi' }
]

export default function App() {
  const [activePage, setActivePage] = useState<string>('index')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [copiedTextMap, setCopiedTextMap] = useState<Record<string, boolean>>({})

  // Hash-based client-side routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      const match = pageOrder.find(p => p.key === hash)
      if (match) {
        setActivePage(hash)
      } else {
        setActivePage('index')
      }
      setMobileMenuOpen(false)
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Run initially

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.trim())
    setCopiedTextMap(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCopiedTextMap(prev => ({ ...prev, [id]: false }))
    }, 2000)
  }

  // Get index position for pager buttons
  const currentPageIndex = pageOrder.findIndex(p => p.key === activePage)
  const prevPage = currentPageIndex > 0 ? pageOrder[currentPageIndex - 1] : null
  const nextPage = currentPageIndex < pageOrder.length - 1 ? pageOrder[currentPageIndex + 1] : null

  // Render components for each page
  const renderPageContent = () => {
    switch (activePage) {
      case 'index':
        return (
          <div className="doc">
            <div className="home-hero">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                dibuat dengan Go + Goja
              </div>
              <h1 className="hero-heading">Jolt</h1>
              <p className="hero-desc">
                Runtime JavaScript ringan dan cepat untuk Termux. Eksekusi script, install package, dan jalankan proyek — <strong>tanpa node_modules</strong>.
              </p>
              <div className="hero-buttons">
                <a href="#installation" className="btn btn-primary">
                  Mulai Instalasi →
                </a>
                <a href="https://github.com/IHx-cmyk/jolt" target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Lihat di GitHub
                </a>
              </div>

              {/* Terminal Preview */}
              <div className="term-window" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
                <div className="term-bar">
                  <div className="term-dots">
                    <span className="term-dot r"></span>
                    <span className="term-dot y"></span>
                    <span className="term-dot g"></span>
                  </div>
                  <span className="term-title">~/projects/hello — jolt</span>
                  <button 
                    className="term-copy"
                    onClick={() => handleCopy('home-term', 'jolt run hello.js')}
                  >
                    {copiedTextMap['home-term'] ? 'Copied!' : 'copy'}
                  </button>
                </div>
                <div className="term-body">
                  <pre>
                    <code>
                      <span className="sh-prompt">$</span>jolt run hello.js{"\n"}
                      <span className="sh-out">🚀 Hello from Jolt!{"\n"}</span>
                      <span className="sh-out">OS: android{"\n"}</span>
                      <span className="sh-out">Files: [ 'hello.js', 'package.json' ]</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <h2 className="section-title" id="kenapa">Kenapa Jolt?</h2>
            <div className="grid-container cols-3">
              <div className="grid-card">
                <div className="card-icon">⚡</div>
                <h3 className="card-title">Eksekusi Cepat</h3>
                <p className="card-desc">CommonJS dijalankan langsung lewat Goja, tanpa overhead V8 yang berat untuk perangkat mobile.</p>
              </div>
              <div className="grid-card">
                <div className="card-icon">📦</div>
                <h3 className="card-title">Package Manager Bawaan</h3>
                <p className="card-desc">Cukup gunakan perintah <code>jolt add &lt;package&gt;</code> — tidak memerlukan npm atau yarn terpisah.</p>
              </div>
              <div className="grid-card">
                <div className="card-icon">🔌</div>
                <h3 className="card-title">Module Bawaan</h3>
                <p className="card-desc">Modul core penting seperti <code>console</code>, <code>fs</code>, <code>net</code>, dan <code>os</code> sudah terintegrasi siap pakai.</p>
              </div>
              <div className="grid-card">
                <div className="card-icon">📁</div>
                <h3 className="card-title">Tanpa node_modules</h3>
                <p className="card-desc">Dependency disimpan rapi terpusat di <code>.jolt/packages</code>, membebaskan space proyek Anda.</p>
              </div>
              <div className="grid-card">
                <div className="card-icon">🔄</div>
                <h3 className="card-title">require() dengan Cache</h3>
                <p className="card-desc">Import package berulang tetap terasa ringan berkat mekanisme caching modul otomatis.</p>
              </div>
              <div className="grid-card">
                <div className="card-icon">🛠️</div>
                <h3 className="card-title">jolt init</h3>
                <p className="card-desc">Mulai proyek baru lengkap dengan package.json lewat satu instruksi CLI interaktif.</p>
              </div>
            </div>

            <h2 className="section-title" id="tanpa-beban">Tanpa Beban node_modules</h2>
            <p>Konsep pemetaan dependency Jolt dibanding package manager Node.js standar:</p>
            <div className="comparison-section">
              <div className="comp-box bad">
                <div className="comp-header">
                  <span>node_modules/ (NPM)</span>
                  <span>khas project npm</span>
                </div>
                <div className="comp-body">
                  <div className="comp-row">lodash <span className="comp-bar"><i style={{ width: '80%' }}></i></span></div>
                  <div className="comp-row">chalk <span className="comp-bar"><i style={{ width: '50%' }}></i></span></div>
                  <div className="comp-row">+ 240 dependencies <span className="comp-bar"><i style={{ width: '100%' }}></i></span></div>
                  <div className="comp-row">+ nested duplicate folders <span className="comp-bar"><i style={{ width: '90%' }}></i></span></div>
                </div>
              </div>
              <div className="comp-box good">
                <div className="comp-header">
                  <span>.jolt/packages/ (Jolt)</span>
                  <span>punya Jolt (global)</span>
                </div>
                <div className="comp-body">
                  <div className="comp-row">lodash <span className="comp-bar"><i style={{ width: '20%' }}></i></span></div>
                  <div className="comp-row">chalk <span className="comp-bar"><i style={{ width: '15%' }}></i></span></div>
                  <div className="comp-row" style={{ color: 'var(--secondary)' }}>Zero nested node_modules <span className="comp-bar"><i style={{ width: '0%', background: 'transparent' }}></i></span></div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '-10px' }}>
              *Ilustrasi konsep penyimpanan terpusat — menghemat waktu tulis I/O disk Android yang lambat.
            </p>

            <h2 className="section-title" id="mulai">Mulai dalam 3 Langkah</h2>
            <div className="grid-container cols-3">
              <div className="grid-card" style={{ textAlign: 'center' }}>
                <h3 className="card-title">1. Pasang Jolt</h3>
                <p className="card-desc" style={{ marginBottom: '14px' }}>Unduh binary rilis otomatis.</p>
                <a href="#installation" className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }}>Instalasi →</a>
              </div>
              <div className="grid-card" style={{ textAlign: 'center' }}>
                <h3 className="card-title">2. Init Proyek</h3>
                <p className="card-desc" style={{ marginBottom: '14px' }}><code>jolt init</code> untuk configurasi.</p>
                <a href="#usage" className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }}>Penggunaan →</a>
              </div>
              <div className="grid-card" style={{ textAlign: 'center' }}>
                <h3 className="card-title">3. Jalankan</h3>
                <p className="card-desc" style={{ marginBottom: '14px' }}><code>jolt run index.js</code>.</p>
                <a href="#usage" className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }}>Contoh →</a>
              </div>
            </div>
          </div>
        )

      case 'installation':
        return (
          <div className="doc">
            <h1 className="doc-title">Instalasi</h1>
            <p className="lede">Dua cara memasang Jolt di Termux: unduh binary rilis otomatis (direkomendasikan) atau compile sendiri dari source code.</p>

            <h2 className="section-title">Instalasi Otomatis (Rekomendasi)</h2>
            <p>Metode tercepat. Skrip instalasi di bawah akan mendeteksi arsitektur CPU Android Anda secara otomatis (ARM64, AMD64, atau ARMv7) dan mengunduh binary executable yang sesuai.</p>
            
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('inst-auto', 'curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/jolt/main/install.sh | bash')}
                >
                  {copiedTextMap['inst-auto'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-comment"># Jalankan perintah ini di aplikasi Termux Anda</span>{"\n"}
                    <span className="sh-prompt">$</span>curl -fsSL https://raw.githubusercontent.com/IHx-cmyk/jolt/main/install.sh | bash
                  </code>
                </pre>
              </div>
            </div>

            <h2 className="section-title">Build dari Source Code</h2>
            <p>Gunakan opsi ini jika Anda ingin mengompilasi versi pengembangan terbaru langsung dari branch repositori utama.</p>
            <p><strong>Persyaratan sistem:</strong></p>
            <ul>
              <li>Go Compiler versi 1.21 atau yang lebih baru (<code>pkg install golang</code>).</li>
              <li>Git terinstall di Termux (<code>pkg install git</code>).</li>
              <li>Akses internet aktif untuk resolve Go packages.</li>
            </ul>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('inst-source', 'git clone https://github.com/IHx-cmyk/jolt\ncd jolt\ngo build -o jolt ./cmd/jolt\nmv jolt $PREFIX/bin/')}
                >
                  {copiedTextMap['inst-source'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-comment"># Clone repositori resmi</span>{"\n"}
                    <span className="sh-prompt">$</span>git clone https://github.com/IHx-cmyk/jolt{"\n"}
                    <span className="sh-prompt">$</span>cd jolt{"\n\n"}
                    <span className="sh-comment"># Build source code ke binary</span>{"\n"}
                    <span className="sh-prompt">$</span>go build -o jolt ./cmd/jolt{"\n\n"}
                    <span className="sh-comment"># Pindahkan binary ke directory path Termux</span>{"\n"}
                    <span className="sh-prompt">$</span>mv jolt $PREFIX/bin/
                  </code>
                </pre>
              </div>
            </div>

            <h2 className="section-title">Verifikasi Instalasi</h2>
            <p>Ketik perintah versi berikut untuk menguji apakah command path Jolt sudah dikenali:</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('inst-ver', 'jolt --version')}
                >
                  {copiedTextMap['inst-ver'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt --version{"\n"}
                    <span className="sh-out">Jolt v0.2.0</span>
                  </code>
                </pre>
              </div>
            </div>

            <div className="callout-box warn">
              <div className="callout-tag">[!]</div>
              <div className="callout-text">
                Apabila muncul kendala <code>command not found</code>, mohon periksa apakah environment binary Termux Anda (<code>$PREFIX/bin</code>) sudah terdaftar di daftar <code>$PATH</code> shell Anda (seperti `.bashrc` atau `.zshrc`).
              </div>
            </div>
          </div>
        )

      case 'usage':
        return (
          <div className="doc">
            <h1 className="doc-title">Penggunaan & Contoh</h1>
            <p className="lede">Dari inisialisasi folder proyek baru hingga memanggil dependensi pustaka luar. Berikut panduan harian runtime Jolt.</p>

            <h2 className="section-title">Inisialisasi Proyek</h2>
            <p>Gunakan perintah <code>jolt init</code> untuk membuat struktur proyek standar. Perintah ini akan meluncurkan setup interaktif untuk menulis konfigurasi <code>package.json</code> serta memproduksi entry point <code>index.js</code>.</p>
            
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('usage-init', 'jolt init')}
                >
                  {copiedTextMap['usage-init'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt init{"\n"}
                    <span className="sh-out">? Nama proyek: hello-jolt{"\n"}</span>
                    <span className="sh-out">? Versi: 1.0.0{"\n"}</span>
                    <span className="sh-out">? Entry point: index.js{"\n"}</span>
                    <span className="sh-out">✔ package.json dibuat{"\n"}</span>
                    <span className="sh-out">✔ index.js dibuat</span>
                  </code>
                </pre>
              </div>
            </div>

            <h2 className="section-title">Menjalankan File JavaScript</h2>
            <p>Perintah <code>jolt run &lt;namafile.js&gt;</code> memuat file JavaScript Anda ke dalam mesin interpretasi Goja:</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('usage-run', 'jolt run index.js')}
                >
                  {copiedTextMap['usage-run'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt run index.js
                  </code>
                </pre>
              </div>
            </div>

            <h2 className="section-title">Mengunduh Package dari NPM</h2>
            <p>Dependency diunduh langsung dari registri npm resmi, tersimpan secara global, dan ditambahkan secara otomatis pada <code>dependencies</code> berkas <code>package.json</code> Anda.</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('usage-add', 'jolt add lodash')}
                >
                  {copiedTextMap['usage-add'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt add lodash
                  </code>
                </pre>
              </div>
            </div>

            <div className="callout-box">
              <div className="callout-tag">[info]</div>
              <div className="callout-text">
                Ingin mengunci versi tertentu? Tambahkan tanda <code>@</code> pada nama package, seperti: <code>jolt add lodash@4</code>
              </div>
            </div>

            <h2 className="section-title">Contoh Kode Lengkap</h2>
            <p>1. Tulis kode berikut di file <code>hello.js</code>:</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">hello.js</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('code-hello', 'console.log("🚀 Hello from Jolt!");\nconst fs = require(\'fs\');\nconst os = require(\'os\');\nconsole.log("OS:", os.getenv("OSTYPE") || "unknown");\nconsole.log("Files:", fs.readdirSync("."));')}
                >
                  {copiedTextMap['code-hello'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-keyword">const</span> fs = <span className="sh-func">require</span>(<span className="sh-string">'fs'</span>);{"\n"}
                    <span className="sh-keyword">const</span> os = <span className="sh-func">require</span>(<span className="sh-string">'os'</span>);{"\n\n"}
                    <span className="sh-func">console.log</span>(<span className="sh-string">"🚀 Hello from Jolt!"</span>);{"\n"}
                    <span className="sh-func">console.log</span>(<span className="sh-string">"OS:"</span>, os.getenv(<span className="sh-string">"OSTYPE"</span>) || <span className="sh-string">"unknown"</span>);{"\n"}
                    <span className="sh-func">console.log</span>(<span className="sh-string">"Files:"</span>, fs.readdirSync(<span className="sh-string">"."</span>));
                  </code>
                </pre>
              </div>
            </div>

            <p>2. Jalankan berkas menggunakan CLI runtime Jolt:</p>
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('code-run-hello', 'jolt run hello.js')}
                >
                  {copiedTextMap['code-run-hello'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt run hello.js
                  </code>
                </pre>
              </div>
            </div>

            <p>3. Contoh menggunakan dependensi npm <code>lodash</code> setelah diunduh (<code>jolt add lodash</code>):</p>
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">lodash_test.js</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('code-lodash', 'const _ = require(\'lodash\');\nconsole.log(_.chunk([1,2,3,4,5], 2));')}
                >
                  {copiedTextMap['code-lodash'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-keyword">const</span> _ = <span className="sh-func">require</span>(<span className="sh-string">'lodash'</span>);{"\n"}
                    <span className="sh-func">console.log</span>(_.chunk([1, 2, 3, 4, 5], 2));{"\n"}
                    <span className="sh-comment">// Output: [[1, 2], [3, 4], [5]]</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )

      case 'project':
        return (
          <div className="doc">
            <h1 className="doc-title">Struktur Proyek & Package Manager</h1>
            <p className="lede">Bagaimana repositori Jolt disusun, dan bagaimana dependency-nya dikelola di balik layar secara terpusat.</p>

            <h2 className="section-title">Struktur Folder Jolt</h2>
            <p>Berikut tata letak modul internal source code Jolt di GitHub. Ini berguna jika Anda berniat memodifikasi runtime Jolt:</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">jolt project tree</span>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    jolt/{"\n"}
                    ├── cmd/jolt/main.go          <span className="sh-comment"># Entry point CLI Go</span>{"\n"}
                    ├── internal/{"\n"}
                    │   ├── engine/                <span className="sh-comment"># Goja runtime & wrapper system require()</span>{"\n"}
                    │   ├── modules/                <span className="sh-comment"># Core module built-in (console, fs, net, os)</span>{"\n"}
                    │   ├── pkgmanager/              <span className="sh-comment"># CLI npm fetcher, zip parser & caching</span>{"\n"}
                    │   ├── init/                    <span className="sh-comment"># Setup perintah jolt init</span>{"\n"}
                    │   └── utils/                   <span className="sh-comment"># Spinner, progress bar & logging warna</span>{"\n"}
                    ├── examples/                    <span className="sh-comment"># Sampel javascript test</span>{"\n"}
                    ├── go.mod{"\n"}
                    └── README.md
                  </code>
                </pre>
              </div>
            </div>

            <h2 className="section-title">Bagaimana Package Manager Bekerja</h2>
            <p>Jika Node.js meletakkan ribuan file pustaka terduplikasi di setiap folder proyek, Jolt mengusung pendekatan modern:</p>
            <div className="grid-container cols-2">
              <div className="grid-card">
                <h3 className="card-title">package.json Kompatibel</h3>
                <p className="card-desc">Format berkas metadata package.json tetap standar. Memungkinkan pemindahan konfigurasi di kemudian hari.</p>
              </div>
              <div className="grid-card">
                <h3 className="card-title">Penyimpanan Terpusat</h3>
                <p className="card-desc">Semua dependency diinstal satu kali pada direktori global <code>~/.jolt/packages/</code>.</p>
              </div>
              <div className="grid-card">
                <h3 className="card-title">Intersepsi require()</h3>
                <p className="card-desc">Saat interpreter memuat require('module'), Jolt mendeteksi folder cache pusat dan memuatnya secara instan.</p>
              </div>
              <div className="grid-card">
                <h3 className="card-title">Efisiensi I/O Android</h3>
                <p className="card-desc">Meminimalkan jutaan operasi read/write pada filesystem Android/Termux, memperpanjang umur baterai dan hardware.</p>
              </div>
            </div>
          </div>
        )

      case 'modules':
        return (
          <div className="doc">
            <h1 className="doc-title">Module Bawaan & Testing</h1>
            <p className="lede">Daftar API inti built-in bawaan Jolt yang dapat langsung Anda panggil tanpa instalasi, serta panduan pengujian package.</p>

            <h2 className="section-title">Referensi API Core</h2>
            <p>Jolt menyediakan standard library internal untuk mengelola console, memproses file, melakukan koneksi internet, dan membaca shell.</p>

            <div className="table-wrapper">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Module / Method</th>
                    <th>Fungsi Utama</th>
                    <th>Contoh Singkat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>console.log(msg, [color])</code></td>
                    <td>Menulis log output. Opsi warna: <code>green, yellow, blue, red</code>.</td>
                    <td><code>console.log('OK', 'green')</code></td>
                  </tr>
                  <tr>
                    <td><code>console.error(msg)</code></td>
                    <td>Menulis log kesalahan ke stderr berwarna merah.</td>
                    <td><code>console.error('Crash!')</code></td>
                  </tr>
                  <tr>
                    <td><code>fs.readFileSync(path)</code></td>
                    <td>Membaca isi file string secara sinkron.</td>
                    <td><code>const data = fs.readFileSync('r.txt')</code></td>
                  </tr>
                  <tr>
                    <td><code>fs.writeFileSync(path, str)</code></td>
                    <td>Menulis file teks string secara sinkron.</td>
                    <td><code>fs.writeFileSync('w.txt', 'Jolt')</code></td>
                  </tr>
                  <tr>
                    <td><code>fs.readdirSync(dir)</code></td>
                    <td>Membaca daftar nama file dalam direktori.</td>
                    <td><code>const list = fs.readdirSync('.')</code></td>
                  </tr>
                  <tr>
                    <td><code>fs.existsSync(path)</code></td>
                    <td>Menguji keberadaan file/path.</td>
                    <td><code>if (fs.existsSync('c.json')) ...</code></td>
                  </tr>
                  <tr>
                    <td><code>net.fetch(url)</code></td>
                    <td>HTTP GET request sinkron, mengembalikan string.</td>
                    <td><code>const res = net.fetch('https://...')</code></td>
                  </tr>
                  <tr>
                    <td><code>os.getenv(key)</code></td>
                    <td>Mengambil string environment variable.</td>
                    <td><code>const user = os.getenv('USER')</code></td>
                  </tr>
                  <tr>
                    <td><code>os.args()</code></td>
                    <td>Mengembalikan array CLI parameters.</td>
                    <td><code>const params = os.args()</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="section-title">Pengujian Testing Dependensi</h2>
            <p>Untuk memastikan penanganan warna terminal berjalan lancar, Anda dapat mencoba memasang module warna terpopuler seperti <code>chalk</code>:</p>
            
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('mod-test-install', 'jolt add chalk')}
                >
                  {copiedTextMap['mod-test-install'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt add chalk
                  </code>
                </pre>
              </div>
            </div>

            <p>Tulis berkas JavaScript <code>test.js</code>:</p>
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">test.js</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('mod-test-code', 'const chalk = require(\'chalk\');\nconsole.log(chalk.green(\'✔ Jolt & Chalk berhasil bekerja dengan sempurna!\'));')}
                >
                  {copiedTextMap['mod-test-code'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-keyword">const</span> chalk = <span className="sh-func">require</span>(<span className="sh-string">'chalk'</span>);{"\n"}
                    <span className="sh-func">console.log</span>(chalk.green(<span className="sh-string">'✔ Jolt & Chalk berhasil bekerja dengan sempurna!'</span>));
                  </code>
                </pre>
              </div>
            </div>

            <p>Jalankan berkas menggunakan Jolt:</p>
            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('mod-test-run', 'jolt run test.js')}
                >
                  {copiedTextMap['mod-test-run'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-prompt">$</span>jolt run test.js{"\n"}
                    <span className="sh-out" style={{ color: 'var(--secondary)' }}>✔ Jolt & Chalk berhasil bekerja dengan sempurna!</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )

      case 'roadmap':
        return (
          <div className="doc">
            <h1 className="doc-title">Roadmap</h1>
            <p className="lede">Ke mana arah pengembangan Jolt selanjutnya. Penjelasan fitur pada setiap rencana rilis.</p>

            <div className="timeline-list">
              <div className="timeline-item done">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v0.1.0</span>
                    <span className="timeline-status done">Selesai</span>
                  </div>
                  <h4 className="timeline-title">Fase Fondasi</h4>
                  <p className="timeline-desc">Runtime interpreter CommonJS dasar, import resolver, download metadata zip npm, global packages cache path, dan modul inti bawaan (console, fs, net, os).</p>
                </div>
              </div>

              <div className="timeline-item done">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v0.2.0</span>
                    <span className="timeline-status done">Selesai</span>
                  </div>
                  <h4 className="timeline-title">Watch Mode & Environment</h4>
                  <p className="timeline-desc">Menyediakan file watcher auto reload (<code>--watch</code>) dan pemuatan parsing file environment variable <code>.env</code> secara otomatis pada startup.</p>
                </div>
              </div>

              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v0.3.0</span>
                    <span className="timeline-status active">Pengerjaan</span>
                  </div>
                  <h4 className="timeline-title">REPL Interaktif</h4>
                  <p className="timeline-desc">Menambahkan antarmuka interaktif Jolt console langsung di dalam shell Termux untuk pengujian ekspresi JavaScript secara langsung.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v0.4.0</span>
                    <span className="timeline-status planned">Rencana</span>
                  </div>
                  <h4 className="timeline-title">Built-In HTTP Server</h4>
                  <p className="timeline-desc">Implementasi HTTP server internal terintegrasi berkecepatan tinggi mirip dengan <code>Bun.serve</code>.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v0.5.0</span>
                    <span className="timeline-status planned">Rencana</span>
                  </div>
                  <h4 className="timeline-title">Dukungan TypeScript Instan</h4>
                  <p className="timeline-desc">Kompilasi dan eksekusi TypeScript langsung secara runtime menggunakan integrasi parser loader esbuild.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v1.0.0</span>
                    <span className="timeline-status planned">Rencana</span>
                  </div>
                  <h4 className="timeline-title">Rilis Stabil Utama</h4>
                  <p className="timeline-desc">Rilis versi stabil utama (production ready) dengan performa andal untuk eksekusi skrip harian.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v1.5.0</span>
                    <span className="timeline-status planned">Rencana</span>
                  </div>
                  <h4 className="timeline-title">Dukungan ES Modules</h4>
                  <p className="timeline-desc">Dukungan parser modern untuk sintaks ES Modules (<code>import</code> / <code>export</code>).</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-ver">v2.0.0</span>
                    <span className="timeline-status planned">Rencana</span>
                  </div>
                  <h4 className="timeline-title">Optimalisasi Performa Ekstrem</h4>
                  <p className="timeline-desc">Refactoring total arsitektur runtime Jolt untuk performa eksekusi dan efisiensi memori yang ekstrem.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contributing':
        return (
          <div className="doc">
            <h1 className="doc-title">Kontribusi & Lisensi</h1>
            <p className="lede">Mari berkolaborasi mematangkan Jolt sebagai runtime JavaScript teringan untuk Termux.</p>

            <h2 className="section-title">Cara Berkontribusi</h2>
            <p>Kami sangat menyukai kontribusi komunitas! Anda dapat berkontribusi melalui pelaporan bug, usulan fitur, perbaikan performa, maupun penyempurnaan modul. Ikuti langkah pengerjaan lokal berikut:</p>

            <div className="term-window">
              <div className="term-bar">
                <div className="term-dots">
                  <span className="term-dot r"></span>
                  <span className="term-dot y"></span>
                  <span className="term-dot g"></span>
                </div>
                <span className="term-title">bash terminal</span>
                <button 
                  className="term-copy"
                  onClick={() => handleCopy('contribute-cl', 'git clone https://github.com/IHx-cmyk/jolt\ncd jolt\ngo mod tidy\ngo build -o jolt ./cmd/jolt')}
                >
                  {copiedTextMap['contribute-cl'] ? 'Copied!' : 'copy'}
                </button>
              </div>
              <div className="term-body">
                <pre>
                  <code>
                    <span className="sh-comment"># Clone hasil fork repositori Anda</span>{"\n"}
                    <span className="sh-prompt">$</span>git clone https://github.com/IHx-cmyk/jolt{"\n"}
                    <span className="sh-prompt">$</span>cd jolt{"\n\n"}
                    <span className="sh-comment"># Tidy dependencies dan compile secara lokal</span>{"\n"}
                    <span className="sh-prompt">$</span>go mod tidy{"\n"}
                    <span className="sh-prompt">$</span>go build -o jolt ./cmd/jolt
                  </code>
                </pre>
              </div>
            </div>

            <div className="callout-box">
              <div className="callout-tag">[info]</div>
              <div className="callout-text">
                Kirimkan Pull Request (PR) ke branch <code>main</code>. Pastikan kode Anda sudah terformat rapi sesuai gaya bahasa Go (<code>go fmt</code>).
              </div>
            </div>

            <h2 className="section-title">Lisensi Perangkat Lunak</h2>
            <p>
              Proyek runtime Jolt dirilis di bawah lisensi terbuka <strong>MIT License</strong>. Anda bebas menggunakan, memodifikasi, mendistribusikan, dan melakukan komersialisasi perangkat lunak ini secara gratis, selama mencantumkan atribusi pembuat asli.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Background Blobs */}
      <div className="glow-blob glow-left"></div>
      <div className="glow-blob glow-right"></div>

      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#index" className="logo">
            <span className="logo-spark">⚡</span> jolt <span className="logo-badge">v0.2.0</span>
          </a>

          {/* Desktop nav links */}
          <ul className="nav-links">
            {pageOrder.map((page) => (
              <li key={page.key}>
                <a
                  href={`#${page.key}`}
                  className={`nav-link ${activePage === page.key ? 'active' : ''}`}
                >
                  {page.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/IHx-cmyk/jolt"
                target="_blank"
                rel="noreferrer"
                className="btn-github"
              >
                GitHub
              </a>
            </li>
          </ul>

          {/* Mobile hamburger menu */}
          <button
            className="menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {pageOrder.map((page) => (
          <a
            key={page.key}
            href={`#${page.key}`}
            className={`mobile-link ${activePage === page.key ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {page.title}
          </a>
        ))}
        <a
          href="https://github.com/IHx-cmyk/jolt"
          target="_blank"
          rel="noreferrer"
          className="mobile-link"
        >
          GitHub
        </a>
      </div>

      {/* Content wrapper */}
      <div className="shell">
        <main>
          <div className="content-container">
            {activePage !== 'index' && (
              <div className="eyebrow">
                <span className="eyebrow-prompt">$</span> cat docs/{activePage}.md
              </div>
            )}
            
            {/* Renders active React TSX Component */}
            {renderPageContent()}

            {/* Pagers */}
            {activePage !== 'index' && (
              <div className="doc-pager">
                {prevPage && (
                  <a href={`#${prevPage.key}`} className="pager-btn">
                    <span className="pager-dir">← sebelumnya</span>
                    <span className="pager-lbl">{prevPage.title}</span>
                  </a>
                )}
                {nextPage && (
                  <a href={`#${nextPage.key}`} className="pager-btn next">
                    <span className="pager-dir">selanjutnya →</span>
                    <span className="pager-lbl">{nextPage.title}</span>
                  </a>
                )}
              </div>
            )}

            {/* Footer */}
            <footer className="footer">
              <span>Dibuat seadanya. Modal sebatang rokok dan seglintir harapan user Termux</span>
              <span>MIT License © 2026 Jolt.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
