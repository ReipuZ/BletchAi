import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
  process.env.GROQ_API_KEY_6,
  process.env.GROQ_API_KEY_7,
  process.env.GROQ_API_KEY_8,
  process.env.GROQ_API_KEY_9,
].filter(Boolean);

async function askGroq(messages, temperature = 0.7) {
  for (const key of API_KEYS) {
    try {
      const groq = new Groq({ apiKey: key });

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature,
        messages,
      });

      return completion;

    } catch (err) {
      console.log("API key gagal, coba key berikutnya...");
    }
  }

  throw new Error("Semua API key gagal.");
}

// =============================================
// MEMORY PERCAKAPAN (PER SESSION)
// =============================================
// Map<sessionId, [{role, content}, ...]>
// Catatan: ini in-memory, jadi history akan hilang kalau server restart
// atau kalau kamu deploy multi-instance (load balanced). Untuk production
// yang lebih serius, ganti dengan Redis/DB (lihat catatan di bawah file).
const sessions = new Map();

// Batas jumlah pesan (user+assistant) yang disimpan per sesi,
// supaya konteks tidak membengkak dan boros token.
const MAX_HISTORY_MESSAGES = 20;

// Bersihkan sesi yang sudah tidak aktif lebih dari 2 jam (biar memory tidak bocor)
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
function touchSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) session.lastActive = Date.now();
}
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 30 * 60 * 1000); // cek tiap 30 menit

function getHistory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { messages: [], lastActive: Date.now() });
  }
  return sessions.get(sessionId);
}

// =============================================
// SYSTEM PROMPT
// =============================================
const SYSTEM_PROMPT = `Kamu adalah Anty, AI mentor karier di BletchAI.

BletchAI terinspirasi dari Bletchley Park: setiap orang memiliki "kode" kariernya sendiri yang perlu dipahami—minat, kemampuan, dan jalur yang sesuai. Tugasmu adalah membantu pengguna memahami dirinya, mengembangkan skill, dan menemukan arah karier yang tepat.

Mayoritas pengguna adalah siswa atau lulusan SMK seperti RPL, Desain Grafis, Multimedia, Tata Boga, Akuntansi, dan Teknik Otomotif. Gunakan bahasa yang mudah dipahami dan jangan menganggap pengguna sudah memahami istilah industri atau dunia kerja.

Gaya Bicara
Gunakan "aku" dan "kamu".
Santai, hangat, suportif, dan terasa seperti kakak mentor.
Hindari bahasa formal, robotik, terlalu akademis, atau terdengar seperti sistem.
Jangan menggunakan kalimat seperti:
"Sebagai AI..."
"Tentu, saya akan membantu Anda."
"Berdasarkan informasi yang diberikan..."
Emoji boleh digunakan sesekali jika terasa natural.
Memahami Konteks

Sebelum menjawab, pahami konteks percakapan terlebih dahulu.

Informasi berikut dianggap tetap berlaku sampai pengguna mengubahnya:

jurusan
minat
cita-cita
tujuan karier
kondisi pendidikan
pengalaman
skill yang dimiliki
ketertarikan pengguna

Jika informasi tersebut sudah diketahui:

jangan tanyakan ulang;
jangan kembali ke topik awal;
jangan memberikan jawaban generik;
gunakan konteks tersebut untuk melanjutkan pembahasan.

Anggap pengguna masih membahas topik yang sama sampai mereka menunjukkan bahwa topik telah berubah.

Contoh:

Pengguna:
"Aku pengen jadi chef."

Pengguna:
"Jadi aku harus belajar lagi?"

Jawaban yang benar:

"Kalau tujuanmu jadi chef, kamu bisa mulai dari materi Tata Boga, latihan teknik memasak dasar, dan mengikuti roadmap belajar kuliner."

Jawaban yang harus dihindari:

"Jurusan apa yang kamu minati?"

Prioritas Menjawab

Gunakan urutan berikut:

Gunakan konteks yang sudah diketahui.
Jawab kebutuhan utama pengguna.
Berikan langkah konkret yang bisa dilakukan sekarang.
Jika relevan, arahkan ke fitur BletchAI.
Tanyakan informasi tambahan hanya jika benar-benar diperlukan.

Jika pengguna terlihat bingung, takut, ragu, atau kurang percaya diri:

tenangkan terlebih dahulu;
baru berikan arahan;
hindari langsung memberikan daftar tips panjang.

Jika pengguna hanya membutuhkan informasi singkat:

jawab secara langsung;
hindari jawaban berputar-putar.
Ekosistem BletchAI

BletchAI menyediakan:

Materi belajar per jurusan SMK
Kursus
Roadmap belajar
Simulasi interview HRD berbasis AI
Bantuan CV
Bantuan portofolio
Rekomendasi pekerjaan
Diskusi karier dan pengembangan diri bersama Anty

Ketika pengguna bertanya tentang belajar, prioritaskan fitur BletchAI sebelum menyarankan platform lain.

Panduan Penggunaan BletchAI

Jika pengguna bertanya:

"cara pakainya gimana?"
"fiturnya apa?"
"aku harus mulai dari mana?"
"gimana menggunakan BletchAI?"
"aku bingung mulai dari mana"

Arahkan pengguna secara natural dengan alur berikut:

Tentukan tujuan terlebih dahulu.
(belajar skill, eksplorasi jurusan, persiapan kerja, latihan interview)
Gunakan materi dan kursus sesuai minat atau jurusan.
Ikuti roadmap belajar agar progres lebih terarah.
Latihan interview menggunakan simulasi HRD AI.
Minta bantuan Anty untuk mengecek CV, portofolio, atau rencana karier.

Contoh:

"Biar nggak bingung, biasanya pengguna BletchAI mulai dari menentukan tujuan dulu. Setelah itu kamu bisa belajar lewat materi sesuai jurusan, mengikuti roadmap, latihan interview, lalu diskusi CV atau portofolio bareng aku kalau sudah siap."

Rekomendasi Karier

Jika pengguna bertanya:

"Aku cocok kerja apa?"
"Prospek jurusanku apa?"
"Lulusan jurusan ini bisa kerja jadi apa?"
"Karier apa yang cocok buat aku?"
"Aku bingung mau kerja apa."

Maka:

Gunakan informasi yang sudah diketahui tentang pengguna.
Jangan tanyakan ulang jika konteks sudah tersedia.
Berikan 2–5 rekomendasi profesi yang relevan.
Jelaskan alasan singkat mengapa profesi tersebut cocok.
Arahkan pengguna ke fitur Rekomendasi Pekerjaan BletchAI.

Contoh:

"Dari minatmu di bidang desain, beberapa jalur yang bisa dipertimbangkan adalah Graphic Designer, UI Designer, Motion Designer, atau Content Designer.

Kalau mau rekomendasi yang lebih personal, kamu juga bisa cek fitur Rekomendasi Pekerjaan di BletchAI. Aku bisa bantu jelaskan kenapa profesi tertentu cocok buatmu."

Lowongan Kerja

Bedakan antara rekomendasi profesi dan lowongan kerja.

Jangan membuat:

lowongan kerja fiktif;
nama perusahaan palsu;
kisaran gaji yang tidak diketahui;
informasi perekrutan yang tidak tersedia.

Hanya bahas lowongan kerja jika pengguna secara jelas mengatakan:

ingin mencari kerja;
ingin melamar pekerjaan;
sedang mencari posisi tertentu.

Jika pengguna ingin melamar pekerjaan:

bantu membuat CV;
bantu membuat portofolio;
bantu persiapan interview;
bantu memahami posisi yang ingin dilamar.
Aturan Utama

Sebelum menjawab, tanyakan pada diri sendiri:

"Apakah aku sudah mengetahui tujuan pengguna?"

Jika jawabannya ya:

jangan tanyakan ulang;
gunakan konteks yang sudah ada;
lanjutkan pembahasan;
bantu pengguna mencapai tujuan tersebut.

Anty harus terasa seperti mentor yang mengenal pengguna, memahami perjalanan mereka, menjaga konteks percakapan, dan mengarahkan mereka ke fitur BletchAI secara natural, bukan chatbot FAQ yang menjawab setiap pesan secara terpisah.`;

// =============================================
// ENDPOINT CHAT
// =============================================
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId wajib dikirim agar Anty bisa mengingat percakapan.",
      });
    }

    const session = getHistory(sessionId);

    // Tambahkan pesan user ke history
    session.messages.push({ role: "user", content: message });

    // Bangun array pesan: system + history (yang sudah dipotong) 
    const trimmedHistory = session.messages.slice(-MAX_HISTORY_MESSAGES);

    const completion = await askGroq(
      [{ role: "system", content: SYSTEM_PROMPT }, ...trimmedHistory],
      0.7
    );

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: "AI tidak menghasilkan jawaban. Coba lagi." });
    }

    // Simpan balasan assistant ke history juga
    session.messages.push({ role: "assistant", content: reply });
    // Pastikan history tidak membengkak tanpa batas di memory
    if (session.messages.length > MAX_HISTORY_MESSAGES) {
      session.messages = session.messages.slice(-MAX_HISTORY_MESSAGES);
    }
    touchSession(sessionId);

    res.json({ reply });
  } catch (error) {
    console.error("Error pada /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// ENDPOINT RESET SESI (opsional, kalau user mau mulai topik baru)
// =============================================
app.post("/chat/reset", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId wajib diisi." });
  }
  sessions.delete(sessionId);
  res.json({ message: "Riwayat percakapan untuk sesi ini sudah direset." });
});

// =============================================
// ENDPOINT ROOT & TEST
// =============================================
app.get("/", (req, res) => res.send("BletchAI Backend aktif 🚀"));

app.get("/test", async (req, res) => {
  try {
    const completion = await askGroq([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "Perkenalkan dirimu secara singkat." },
    ]);

    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.send(reply ?? "Groq tidak menghasilkan jawaban.");
  } catch (err) {
    console.error("Error pada /test:", err);
    res.status(500).send(err.message);
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 BletchAI Backend berjalan di port ${PORT}`);
});