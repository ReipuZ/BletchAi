// chatHistoryStore.js
//
// Lapisan penyimpanan riwayat chat BLETCH AI.
//
// Saat ini implementasinya pakai localStorage (frontend-only), tapi semua
// fungsi di sini sengaja dibuat `async` dan punya bentuk return yang sama
// dengan yang nanti dikembalikan REST API. Tujuannya: kalau backend sudah
// siap, kamu tinggal ganti isi fungsi-fungsi di bawah ini jadi `fetch(...)`
// ke endpoint kamu — kode yang MEMANGGIL (HistoryPage, ChatOverlay) tidak
// perlu diubah sama sekali.
//
// Bentuk satu "session" (sesi chat):
// {
//   id: string,            // uuid
//   title: string,         // diambil dari pesan pertama user
//   createdAt: number,     // epoch ms, kapan sesi dimulai
//   updatedAt: number,     // epoch ms, kapan pesan terakhir ditambahkan
//   messages: [{ role: "user" | "ai", text: string }]
// }

const STORAGE_KEY = "bletch_chat_history_v1";

// ───────────────────────────────────────────────────────────
// Helpers internal
// ───────────────────────────────────────────────────────────

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Gagal membaca riwayat chat dari localStorage:", err);
    return [];
  }
}

function writeRaw(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return true;
  } catch (err) {
    // Bisa gagal kalau quota localStorage penuh, atau private browsing mode
    console.error("Gagal menyimpan riwayat chat ke localStorage:", err);
    return false;
  }
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback sederhana kalau crypto.randomUUID tidak tersedia
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function deriveTitle(messages) {
  const firstUserMsg = messages.find((m) => m.role === "user" && m.text?.trim());
  if (!firstUserMsg) return "Percakapan baru";
  const text = firstUserMsg.text.trim();
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
}

// ───────────────────────────────────────────────────────────
// API publik
// ───────────────────────────────────────────────────────────

/**
 * Ambil semua sesi chat, diurutkan dari yang paling baru diupdate.
 * @returns {Promise<Array>} daftar session
 */
export async function listSessions() {
  const sessions = readRaw();
  return [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Ambil satu sesi berdasarkan id.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getSession(id) {
  const sessions = readRaw();
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Simpan sesi baru dari array messages. Dipanggil saat overlay chat
 * ditutup dan ada percakapan yang terjadi (chat dimulai dari nol, bukan
 * lanjutan dari sesi lama).
 * @param {Array<{role: string, text: string}>} messages
 * @returns {Promise<Object>} session yang baru dibuat
 */
export async function saveSession(messages) {
  if (!messages || messages.length === 0) return null;

  const sessions = readRaw();
  const now = Date.now();
  const newSession = {
    id: makeId(),
    title: deriveTitle(messages),
    createdAt: now,
    updatedAt: now,
    messages,
  };

  sessions.push(newSession);
  writeRaw(sessions);
  return newSession;
}

// NEW: dipakai saat user melanjutkan sesi lama (tombol "Lanjutkan chat" di
// HistoryPage). Overlay dibuka dengan riwayat pesan sesi tsb + sessionId-nya.
// Saat overlay ditutup, alih-alih membuat sesi baru (yang akan menduplikasi
// riwayat), kita UPDATE sesi yang sama supaya percakapan menyambung, bukan
// pecah jadi entri terpisah di daftar riwayat.
/**
 * Update sesi yang sudah ada dengan array messages terbaru (replace penuh).
 * Kalau id tidak ditemukan, fallback membuat sesi baru — supaya tidak ada
 * data yang hilang meski terjadi race/edge-case (misal sesi sempat dihapus
 * dari tab lain).
 * @param {string} id
 * @param {Array<{role: string, text: string}>} messages
 * @returns {Promise<Object|null>} session yang sudah diupdate
 */
export async function updateSession(id, messages) {
  if (!messages || messages.length === 0) return null;

  const sessions = readRaw();
  const idx = sessions.findIndex((s) => s.id === id);
  const now = Date.now();

  if (idx === -1) {
    // Sesi lama sudah tidak ada lagi — buat baru saja sebagai fallback aman.
    const fallback = {
      id: makeId(),
      title: deriveTitle(messages),
      createdAt: now,
      updatedAt: now,
      messages,
    };
    sessions.push(fallback);
    writeRaw(sessions);
    return fallback;
  }

  const updated = {
    ...sessions[idx],
    messages,
    updatedAt: now,
  };
  sessions[idx] = updated;
  writeRaw(sessions);
  return updated;
}

/**
 * Hapus satu sesi berdasarkan id.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteSession(id) {
  const sessions = readRaw();
  const next = sessions.filter((s) => s.id !== id);
  return writeRaw(next);
}

/**
 * Hapus semua riwayat chat.
 * @returns {Promise<boolean>}
 */
export async function clearAllSessions() {
  return writeRaw([]);
}

/**
 * Format angka epoch ms jadi label waktu relatif singkat ala "2 jam lalu".
 * Dipakai di list sidebar.
 * @param {number} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return "Kemarin";
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Kelompokkan daftar session ke dalam bucket waktu: Hari ini, Kemarin,
 * 7 hari terakhir, 30 hari terakhir, Lebih lama. Persis pola yang dipakai
 * Claude di sidebar history-nya.
 * @param {Array} sessions - sudah harus terurut dari terbaru
 * @returns {Array<{label: string, sessions: Array}>}
 */
export function groupSessionsByDate(sessions) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const sevenDaysAgo = startOfToday - 7 * 86400000;
  const thirtyDaysAgo = startOfToday - 30 * 86400000;

  const buckets = {
    "Hari ini": [],
    Kemarin: [],
    "7 hari terakhir": [],
    "30 hari terakhir": [],
    "Lebih lama": [],
  };

  for (const session of sessions) {
    const t = session.updatedAt;
    if (t >= startOfToday) buckets["Hari ini"].push(session);
    else if (t >= startOfYesterday) buckets["Kemarin"].push(session);
    else if (t >= sevenDaysAgo) buckets["7 hari terakhir"].push(session);
    else if (t >= thirtyDaysAgo) buckets["30 hari terakhir"].push(session);
    else buckets["Lebih lama"].push(session);
  }

  return Object.entries(buckets)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, sessions: list }));
}