import { Code2, Wrench, Palette, Calculator, ChefHat, Camera } from "lucide-react";

/**
 * Setiap jurusan punya:
 * - identitas (id, title, shortTitle, tagline, desc, accent, accentRgb, icon)
 * - stats ringkas untuk hero
 * - roadmap: array tahap belajar, tiap tahap punya daftar modul/materi
 *
 * Tambah jurusan baru cukup push object baru ke array ini —
 * JurusanPage.jsx akan otomatis render dengan warna & data masing-masing.
 */
export const jurusanList = [
  {
    id: "rpl",
    // categoryMatch = harus sama persis dengan course.category di kursus.js,
    // dipakai untuk menyambungkan halaman pembayaran -> roadmap jurusan yang tepat.
    categoryMatch: "Rekayasa Perangkat Lunak",
    title: "Rekayasa Perangkat Lunak",
    shortTitle: "RPL",
    tagline: "Bangun aplikasi & website dari nol hingga siap kerja.",
    desc: "Jurusan Rekayasa Perangkat Lunak membekali kamu dengan kemampuan membangun aplikasi web dan software, mulai dari logika pemrograman dasar sampai siap mengerjakan proyek nyata untuk portofolio kerja.",
    accent: "#3B82F6",
    accentRgb: "59,130,246",
    icon: Code2,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Pemrograman",
        duration: "4 minggu",
        desc: "Membangun fondasi logika dan dasar pemrograman web.",
        modules: [
          { title: "HTML & CSS Dasar", duration: "45 menit", type: "Video" },
          { title: "Logika & Algoritma Pemrograman", duration: "1 jam", type: "Video" },
          { title: "Pengenalan JavaScript", duration: "50 menit", type: "Video" },
          { title: "Praktik: Membuat Halaman Web Statis", duration: "2 jam", type: "Praktik" },
        ],
      },
      {
        title: "Pengembangan Web",
        duration: "5 minggu",
        desc: "Mulai membangun aplikasi web interaktif dengan React.",
        modules: [
          { title: "JavaScript Lanjutan (ES6+)", duration: "1 jam", type: "Video" },
          { title: "Fundamental React.js", duration: "1.5 jam", type: "Video" },
          { title: "Menghubungkan API & Database", duration: "1 jam", type: "Video" },
          { title: "Praktik: Membangun To-Do App", duration: "3 jam", type: "Praktik" },
        ],
      },
      {
        title: "Pengembangan Lanjutan",
        duration: "4 minggu",
        desc: "Memperdalam backend, keamanan, dan pengujian aplikasi.",
        modules: [
          { title: "Backend dengan Node.js & Express", duration: "1.5 jam", type: "Video" },
          { title: "Autentikasi & Keamanan Aplikasi", duration: "1 jam", type: "Video" },
          { title: "State Management (Redux/Context)", duration: "1 jam", type: "Video" },
          { title: "Testing & Debugging Aplikasi", duration: "50 menit", type: "Praktik" },
        ],
      },
      {
        title: "Proyek Akhir & Karier",
        duration: "3 minggu",
        desc: "Menyusun portofolio dan bersiap masuk dunia kerja.",
        modules: [
          { title: "Membangun Proyek Akhir Web App", duration: "5 jam", type: "Project" },
          { title: "Code Review & Best Practice", duration: "45 menit", type: "Video" },
          { title: "Deployment & DevOps Dasar", duration: "1 jam", type: "Praktik" },
          { title: "Persiapan Interview Teknis", duration: "40 menit", type: "Kuis" },
        ],
      },
    ],
  },
  {
    id: "otomotif",
    categoryMatch: "Teknik Otomotif",
    title: "Teknik Otomotif",
    shortTitle: "Otomotif",
    tagline: "Pahami mesin, kelistrikan, dan teknologi kendaraan modern.",
    desc: "Jurusan Teknik Otomotif mengajarkan dasar mesin, sistem kelistrikan, hingga teknologi kendaraan modern seperti EFI dan kendaraan listrik, lengkap dengan praktik langsung di bengkel.",
    accent: "#F97316",
    accentRgb: "249,115,22",
    icon: Wrench,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Otomotif",
        duration: "4 minggu",
        desc: "Mengenal komponen mesin dan keselamatan kerja bengkel.",
        modules: [
          { title: "Pengenalan Komponen Mesin", duration: "50 menit", type: "Video" },
          { title: "K3 & Keselamatan Kerja Bengkel", duration: "40 menit", type: "Video" },
          { title: "Alat & Perkakas Dasar Otomotif", duration: "45 menit", type: "Video" },
          { title: "Praktik: Identifikasi Komponen Kendaraan", duration: "2 jam", type: "Praktik" },
        ],
      },
      {
        title: "Perawatan Kendaraan",
        duration: "5 minggu",
        desc: "Mempelajari servis berkala dan sistem utama kendaraan.",
        modules: [
          { title: "Sistem Kelistrikan Dasar", duration: "1 jam", type: "Video" },
          { title: "Servis Berkala & Ganti Oli", duration: "1 jam", type: "Praktik" },
          { title: "Sistem Pengereman", duration: "50 menit", type: "Video" },
          { title: "Sistem Suspensi & Kemudi", duration: "50 menit", type: "Video" },
        ],
      },
      {
        title: "Teknologi Lanjutan",
        duration: "4 minggu",
        desc: "Masuk ke teknologi kendaraan modern dan diagnosis.",
        modules: [
          { title: "Sistem Injeksi & EFI", duration: "1.5 jam", type: "Video" },
          { title: "Pengenalan Kendaraan Listrik & Hybrid", duration: "1 jam", type: "Video" },
          { title: "Sistem Transmisi Otomatis", duration: "1 jam", type: "Video" },
          { title: "Praktik: Scan Tool & Diagnosis OBD", duration: "2 jam", type: "Praktik" },
        ],
      },
      {
        title: "Praktik & Sertifikasi",
        duration: "3 minggu",
        desc: "Magang dan uji kompetensi sebelum lulus.",
        modules: [
          { title: "Studi Kasus Troubleshooting Mesin", duration: "1.5 jam", type: "Project" },
          { title: "Magang di Bengkel Mitra", duration: "4 minggu", type: "Praktik" },
          { title: "Persiapan Uji Kompetensi", duration: "1 jam", type: "Kuis" },
          { title: "Simulasi Sertifikasi Industri", duration: "1 jam", type: "Kuis" },
        ],
      },
    ],
  },
  {
    id: "desain",
    categoryMatch: "Desain Grafis",
    title: "Desain Grafis",
    shortTitle: "Desain Grafis",
    tagline: "Ubah ide jadi visual yang menjual.",
    desc: "Jurusan Desain Grafis melatih kepekaan visual, tipografi, dan branding, dari dasar software desain sampai membangun portofolio yang siap dipakai melamar kerja atau freelance.",
    accent: "#EC4899",
    accentRgb: "236,72,153",
    icon: Palette,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Desain",
        duration: "4 minggu",
        desc: "Membangun fondasi visual: warna, tipografi, dan layout.",
        modules: [
          { title: "Teori Warna & Tipografi", duration: "50 menit", type: "Video" },
          { title: "Prinsip Layout & Komposisi", duration: "45 menit", type: "Video" },
          { title: "Pengenalan Adobe Illustrator", duration: "1 jam", type: "Video" },
          { title: "Pengenalan Adobe Photoshop", duration: "1 jam", type: "Video" },
        ],
      },
      {
        title: "Desain Digital",
        duration: "5 minggu",
        desc: "Mulai membuat desain untuk kebutuhan digital dan cetak.",
        modules: [
          { title: "Desain Konten Media Sosial", duration: "1 jam", type: "Praktik" },
          { title: "Branding & Logo Design", duration: "1.5 jam", type: "Video" },
          { title: "Dasar UI Design", duration: "1 jam", type: "Video" },
          { title: "Praktik: Desain Poster & Brosur", duration: "2 jam", type: "Praktik" },
        ],
      },
      {
        title: "Skill Lanjutan",
        duration: "4 minggu",
        desc: "Mengasah skill visual yang lebih kompleks.",
        modules: [
          { title: "Motion Graphic Dasar", duration: "1.5 jam", type: "Video" },
          { title: "Layout Majalah dengan Adobe InDesign", duration: "1 jam", type: "Video" },
          { title: "Photo Manipulation", duration: "1 jam", type: "Praktik" },
          { title: "Desain Kemasan Produk", duration: "1 jam", type: "Praktik" },
        ],
      },
      {
        title: "Portofolio & Karier",
        duration: "3 minggu",
        desc: "Menyiapkan portofolio dan langkah memasuki industri kreatif.",
        modules: [
          { title: "Membangun Portofolio Desain", duration: "3 jam", type: "Project" },
          { title: "Memahami Client Brief & Revisi", duration: "40 menit", type: "Video" },
          { title: "Freelance & Personal Branding", duration: "45 menit", type: "Video" },
          { title: "Studi Kasus Proyek Nyata", duration: "2 jam", type: "Project" },
        ],
      },
    ],
  },
  {
    id: "akuntansi",
    categoryMatch: "Akuntansi",
    title: "Akuntansi",
    shortTitle: "Akuntansi",
    tagline: "Kuasai pembukuan hingga laporan keuangan profesional.",
    desc: "Jurusan Akuntansi membekali kamu memahami siklus akuntansi, menyusun laporan keuangan, hingga praktik pembukuan menggunakan software akuntansi yang dipakai dunia kerja.",
    accent: "#10B981",
    accentRgb: "16,185,129",
    icon: Calculator,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Akuntansi",
        duration: "4 minggu",
        desc: "Memahami konsep dan siklus dasar akuntansi.",
        modules: [
          { title: "Konsep Dasar Akuntansi", duration: "45 menit", type: "Video" },
          { title: "Persamaan Dasar Akuntansi", duration: "50 menit", type: "Video" },
          { title: "Jurnal Umum & Buku Besar", duration: "1 jam", type: "Video" },
          { title: "Praktik: Menyusun Siklus Akuntansi", duration: "2 jam", type: "Praktik" },
        ],
      },
      {
        title: "Laporan Keuangan",
        duration: "5 minggu",
        desc: "Belajar menyusun laporan keuangan yang akurat.",
        modules: [
          { title: "Neraca Saldo", duration: "50 menit", type: "Video" },
          { title: "Laporan Laba Rugi", duration: "1 jam", type: "Video" },
          { title: "Laporan Posisi Keuangan", duration: "1 jam", type: "Video" },
          { title: "Penyesuaian Akhir Periode", duration: "50 menit", type: "Praktik" },
        ],
      },
      {
        title: "Akuntansi Lanjutan",
        duration: "4 minggu",
        desc: "Akuntansi untuk perusahaan dagang dan perpajakan.",
        modules: [
          { title: "Akuntansi Perusahaan Dagang", duration: "1.5 jam", type: "Video" },
          { title: "Dasar Perpajakan", duration: "1 jam", type: "Video" },
          { title: "Software Akuntansi (MYOB/Accurate)", duration: "1.5 jam", type: "Praktik" },
          { title: "Analisis Laporan Keuangan", duration: "1 jam", type: "Video" },
        ],
      },
      {
        title: "Praktik & Sertifikasi",
        duration: "3 minggu",
        desc: "Praktik nyata dan persiapan uji kompetensi.",
        modules: [
          { title: "Studi Kasus Pembukuan UMKM", duration: "2 jam", type: "Project" },
          { title: "Simulasi Audit Sederhana", duration: "1 jam", type: "Praktik" },
          { title: "Magang Industri", duration: "4 minggu", type: "Praktik" },
          { title: "Persiapan Uji Kompetensi", duration: "1 jam", type: "Kuis" },
        ],
      },
    ],
  },
  {
    id: "tataboga",
    categoryMatch: "Tata Boga",
    title: "Tata Boga",
    shortTitle: "Tata Boga",
    tagline: "Dari dapur sekolah ke dapur industri.",
    desc: "Jurusan Tata Boga mengasah keterampilan memasak, plating, dan manajemen dapur, dari teknik dasar hingga siap magang di hotel, restoran, atau membangun usaha kuliner sendiri.",
    accent: "#F59E0B",
    accentRgb: "245,158,11",
    icon: ChefHat,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Tata Boga",
        duration: "4 minggu",
        desc: "Membangun fondasi keterampilan dapur dan keamanan pangan.",
        modules: [
          { title: "Sanitasi & Hygiene Dapur", duration: "40 menit", type: "Video" },
          { title: "Pengenalan Bahan Pangan", duration: "45 menit", type: "Video" },
          { title: "Teknik Memotong Dasar", duration: "1 jam", type: "Praktik" },
          { title: "Teknik Memasak Dasar", duration: "1 jam", type: "Praktik" },
        ],
      },
      {
        title: "Masakan & Pastry",
        duration: "5 minggu",
        desc: "Mempraktikkan masakan Nusantara hingga dasar pastry.",
        modules: [
          { title: "Masakan Indonesia", duration: "1.5 jam", type: "Praktik" },
          { title: "Masakan Kontinental", duration: "1.5 jam", type: "Praktik" },
          { title: "Dasar Pastry & Bakery", duration: "1.5 jam", type: "Praktik" },
          { title: "Plating & Food Presentation", duration: "1 jam", type: "Video" },
        ],
      },
      {
        title: "Manajemen Kuliner",
        duration: "4 minggu",
        desc: "Memahami sisi bisnis dan manajemen dapur.",
        modules: [
          { title: "Food Costing & Menu Planning", duration: "1 jam", type: "Video" },
          { title: "Manajemen Dapur (Kitchen Management)", duration: "1 jam", type: "Video" },
          { title: "Keamanan Pangan (HACCP)", duration: "50 menit", type: "Video" },
          { title: "Pengembangan Resep", duration: "1 jam", type: "Praktik" },
        ],
      },
      {
        title: "Praktik & Karier",
        duration: "3 minggu",
        desc: "Pengalaman kerja nyata dan persiapan karier kuliner.",
        modules: [
          { title: "Magang di Hotel/Restoran", duration: "4 minggu", type: "Praktik" },
          { title: "Event Catering Project", duration: "3 jam", type: "Project" },
          { title: "Persiapan Uji Kompetensi", duration: "1 jam", type: "Kuis" },
          { title: "Dasar Membangun Usaha Kuliner", duration: "1 jam", type: "Video" },
        ],
      },
    ],
  },
  {
    id: "multimedia",
    categoryMatch: "Multimedia",
    title: "Multimedia",
    shortTitle: "Multimedia",
    tagline: "Ciptakan konten visual yang bercerita.",
    desc: "Jurusan Multimedia melatih kemampuan fotografi, videografi, dan editing konten, dari dasar produksi sampai membangun portofolio kreator yang siap kerja di industri kreatif.",
    accent: "#6366F1",
    accentRgb: "99,102,241",
    icon: Camera,
    stats: { duration: "± 4 bulan" },
    roadmap: [
      {
        title: "Dasar Multimedia",
        duration: "4 minggu",
        desc: "Mengenal dasar visual, foto, dan video.",
        modules: [
          { title: "Konsep Dasar Multimedia", duration: "40 menit", type: "Video" },
          { title: "Fotografi Dasar", duration: "1 jam", type: "Video" },
          { title: "Videografi Dasar", duration: "1 jam", type: "Video" },
          { title: "Editing Audio Dasar", duration: "50 menit", type: "Praktik" },
        ],
      },
      {
        title: "Produksi Konten",
        duration: "5 minggu",
        desc: "Mulai memproduksi konten visual yang siap publish.",
        modules: [
          { title: "Editing Video dengan Premiere/Capcut", duration: "1.5 jam", type: "Praktik" },
          { title: "Motion Graphic Dasar", duration: "1 jam", type: "Video" },
          { title: "Storytelling Visual", duration: "1 jam", type: "Video" },
          { title: "Desain Thumbnail & Cover", duration: "50 menit", type: "Praktik" },
        ],
      },
      {
        title: "Skill Lanjutan",
        duration: "4 minggu",
        desc: "Mengasah kualitas produksi konten lebih profesional.",
        modules: [
          { title: "Color Grading", duration: "1 jam", type: "Video" },
          { title: "Sound Design & Scoring", duration: "1 jam", type: "Video" },
          { title: "Animasi 2D Dasar", duration: "1.5 jam", type: "Praktik" },
          { title: "Produksi Konten Media Sosial", duration: "1 jam", type: "Praktik" },
        ],
      },
      {
        title: "Portofolio & Karier",
        duration: "3 minggu",
        desc: "Menyiapkan portofolio dan karier di industri kreatif.",
        modules: [
          { title: "Membangun Channel/Portofolio", duration: "2 jam", type: "Project" },
          { title: "Kolaborasi Proyek Tim", duration: "2 jam", type: "Project" },
          { title: "Studi Kasus Brand Campaign", duration: "1.5 jam", type: "Project" },
          { title: "Persiapan Karier Kreator/Editor", duration: "45 menit", type: "Kuis" },
        ],
      },
    ],
  },
];

export function getJurusanById(id) {
  return jurusanList.find((j) => j.id === id);
}

export function getJurusanByCategory(category) {
  return jurusanList.find((j) => j.categoryMatch === category);
}