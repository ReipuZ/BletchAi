import { useState, useCallback, useEffect, useRef } from "react";
import Reveal, { RevealGroup, revealItem } from "../components/Reveal.jsx";
import { motion } from "framer-motion";

import rpl from "./interview/rpl";
import desainGrafis from "./interview/desainGrafis";
import akuntansi from "./interview/akuntansi";
import multimedia from "./interview/multimedia";
import tataBoga from "./interview/tataBoga";
import teknikOtomotif from "./interview/teknikOtomotif";

const TIMER_SECONDS = 60;
const QUESTIONS_PER_SESSION = 15;
const STORAGE_KEY = "bletchai_stats";

const BIDANG_CONFIG = [
  {
    name: "Rekayasa Perangkat Lunak", data: rpl, color: "#3B82F6",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M5 7l-3 3 3 3M15 7l3 3-3 3M11 4l-2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    name: "Desain Grafis", data: desainGrafis, color: "#8B5CF6",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    name: "Akuntansi", data: akuntansi, color: "#06B6D4",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10h6M7 13h4M7 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    name: "Teknik Otomotif", data: teknikOtomotif, color: "#F59E0B",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    name: "Multimedia", data: multimedia, color: "#EC4899",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 7.5l5 2.5-5 2.5V7.5z" fill="currentColor"/></svg>,
  },
  {
    name: "Tata Boga", data: tataBoga, color: "#10B981",
    icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M10 2c0 0-5 3-5 7h10c0-4-5-7-5-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M5 9v7a2 2 0 002 2h6a2 2 0 002-2V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
];

/* ─── Pure logic helpers ─────────────────────────────────────── */
function pickRandom(arr, n) { return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length)); }
function loadStats() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } }
function saveStats(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} }
function getInitialStats() { return { totalSessions: 0, totalScore: 0, totalPossible: 0, topicCounts: {}, lastSession: null }; }
function calcAvgPct(s) { if (!s || s.totalPossible === 0) return 0; return Math.round((s.totalScore / s.totalPossible) * 100); }
function topTopic(s) {
  if (!s?.topicCounts) return "–";
  const e = Object.entries(s.topicCounts).sort((a, b) => b[1] - a[1]);
  if (!e.length) return "–";
  const name = e[0][0];
  if (name.length <= 10) return name;
  return name.split(" ").map(w => w[0]).join("").toUpperCase();
}
function getHRDFeedback(point, isTimeout) {
  const pool = {
    timeout: ["Waktu habis. Dalam wawancara nyata, kecepatan berpikir sangat dinilai. Pastikan Anda berlatih menjawab lebih spontan ya.", "Waktu Anda habis sebelum menjawab. Tidak apa-apa, ini adalah bagian dari proses belajar. Mari lanjutkan.", "Waktu habis. Latihan rutin akan membantu Anda menjawab lebih cepat dan percaya diri."],
    5: ["Jawaban yang luar biasa. Komprehensif, terstruktur, dan menunjukkan pemahaman mendalam. Ini persis yang kami cari.", "Sempurna. Anda menjawab dengan sangat baik — menghubungkan teori dengan konteks praktis. Sangat mengesankan.", "Excellent. Jawaban Anda mencerminkan kompetensi profesional yang tinggi. Saya terkesan."],
    4: ["Jawaban yang baik. Sudah mencakup poin utama dengan tepat. Sedikit elaborasi dengan contoh konkret akan membuatnya sempurna.", "Bagus. Pemahaman Anda sudah solid. Coba tambahkan konteks pengalaman pribadi untuk memperkuat jawaban.", "Baik sekali. Anda sudah di jalur yang benar. Perdalam sedikit lagi untuk jawaban yang lebih meyakinkan."],
    3: ["Cukup baik, namun masih ada ruang untuk berkembang. Coba pelajari topik ini lebih dalam untuk jawaban yang lebih meyakinkan.", "Dasar pemahaman Anda sudah ada. Tambahkan lebih banyak detail spesifik untuk meninggalkan kesan lebih kuat pada interviewer.", "Anda memahami konsep umumnya. Namun depth jawaban perlu ditingkatkan — berlatihlah menyampaikan dengan lebih terstruktur."],
    2: ["Jawaban Anda masih kurang lengkap. Di wawancara sesungguhnya, ini bisa menjadi kelemahan. Persiapkan topik ini lebih matang.", "Masih perlu banyak perbaikan. Pelajari topik ini lebih mendalam dan latih cara menyampaikannya dengan jelas.", "Belum cukup kuat untuk meyakinkan interviewer. Jadikan ini sebagai catatan untuk dipersiapkan lebih baik."],
    1: ["Jawaban ini perlu banyak perbaikan. Jangan khawatir — dari sini kita tahu area mana yang harus diprioritaskan untuk dipelajari.", "Ini belum menjawab pertanyaan dengan baik. Pelajari topik ini sebelum interview sesungguhnya.", "Perlu peningkatan signifikan. Jadikan ini motivasi untuk belajar lebih dalam sebelum wawancara nyata."],
  };
  const key = isTimeout ? "timeout" : Math.min(point, 5);
  const arr = pool[key] || pool[1];
  return arr[Math.floor(Math.random() * arr.length)];
}

function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

/* ─── Design tokens — adaptive light/dark ───────────────────── */
const glass = {
  card: {
    background: "var(--bg-surface)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid var(--border-strong)",
    // ✅ shadow adaptif
    boxShadow: "0 4px 24px var(--shadow-card), inset 0 1px 0 var(--card-inset)",
  },
  panel: {
    background: "var(--bg-card)",
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    border: "1px solid var(--border-md)",
    // ✅ shadow adaptif
    boxShadow: "0 20px 60px var(--shadow-card-lg), inset 0 1px 0 var(--card-inset)",
  },
};

/* ─── Icon set ───────────────────────────────────────────────── */
const IconBot    = () => <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7.5" cy="12" r="1" fill="currentColor"/><circle cx="12.5" cy="12" r="1" fill="currentColor"/></svg>;
const IconUser   = () => <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconBack   = () => <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconClock  = () => <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IconChart  = () => <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><rect x="2" y="10" width="3" height="4" rx="0.5" fill="currentColor"/><rect x="6.5" y="6" width="3" height="8" rx="0.5" fill="currentColor"/><rect x="11" y="2" width="3" height="12" rx="0.5" fill="currentColor"/></svg>;
const IconTrophy = () => <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M4 2h8v6a4 4 0 01-8 0V2z" stroke="currentColor" strokeWidth="1.4"/><path d="M2 3h2M12 3h2M8 12v2M6 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;

/* ─── TimerBar ───────────────────────────────────────────────── */
function TimerBar({ seconds, total }) {
  const pct    = (seconds / total) * 100;
  const isCrit = seconds <= 5;
  const isUrg  = seconds <= 15;
  const color  = isCrit ? "#EF4444" : isUrg ? "#F59E0B" : "#3B82F6";
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: isCrit ? "#EF4444" : isUrg ? "#F59E0B" : "var(--text-muted)" }}><IconClock /></span>
      <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "var(--bg-surface-md)" }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, background: color, boxShadow: isCrit ? `0 0 6px ${color}` : "none" }} />
      </div>
      <span className={`text-[11px] font-mono font-semibold w-7 text-right tabular-nums ${isCrit ? "text-red-400" : isUrg ? "text-amber-400" : ""}`}
        style={!isCrit && !isUrg ? { color: "var(--text-muted)" } : {}}>
        {seconds}s
      </span>
    </div>
  );
}

/* ─── AIChatBubble ───────────────────────────────────────────── */
function AIChatBubble({ children, typing = false }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="relative shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#3B82F6]"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)", boxShadow: "0 0 0 3px rgba(59,130,246,0.05)" }}>
          <IconBot />
        </div>
        {/* ✅ border-black → var(--avatar-border) supaya adaptif */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: "#22D47A", border: "1.5px solid var(--avatar-border)" }} />
      </div>
      <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]"
        style={{
          background: "var(--bg-surface-md)",
          border: "1px solid var(--border-md)",
          // ✅ inset highlight adaptif
          boxShadow: "inset 0 1px 0 var(--card-inset)",
        }}>
        {typing ? (
          <div className="flex gap-1 items-center py-0.5">
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ background: "var(--text-muted)", animationDelay: `${d}s`, animationDuration: "1s" }} />
            ))}
          </div>
        ) : (
          <p className="text-xs leading-[1.75]" style={{ color: "var(--text-secondary)" }}>{children}</p>
        )}
      </div>
    </div>
  );
}

/* ─── UserChatBubble ─────────────────────────────────────────── */
function UserChatBubble({ text, point, label }) {
  const pointColor =
    point >= 5 ? "#3B82F6" : point >= 4 ? "#06B6D4" : point >= 3 ? "#F59E0B" : point >= 2 ? "#F97316" : "#EF4444";
  return (
    <div className="flex items-start gap-2.5 justify-end">
      <div className="flex flex-col items-end gap-1 max-w-[85%]">
        <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5"
          style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.15)" }}>
          <span className="text-[11px] font-semibold block mb-0.5" style={{ color: "var(--accent-light)" }}>{label}</span>
          <p className="text-xs leading-[1.6]" style={{ color: "var(--text-primary)" }}>{text}</p>
        </div>
        <div className="flex items-center gap-1.5 pr-1">
          <span className="text-[10px] font-semibold" style={{ color: pointColor }}>+{point} poin</span>
          <span style={{ color: pointColor }}><IconCheck /></span>
        </div>
      </div>
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-muted)" }}>
        <IconUser />
      </div>
    </div>
  );
}

/* ─── AnswerOverlay ──────────────────────────────────────────── */
function AnswerOverlay({ answers, timer, onAnswer, onHeightChange }) {
  const overlayRef = useRef(null);
  const labels = ["A", "B", "C", "D", "E"];

  useEffect(() => {
    if (!overlayRef.current) return;
    const el = overlayRef.current;
    const measure = () => { if (onHeightChange) onHeightChange(el.offsetHeight); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightChange]);

  return (
    <div ref={overlayRef} className="absolute inset-x-0 bottom-0 flex flex-col justify-end rounded-b-2xl overflow-hidden" style={{ zIndex: 20 }}>
      {/* ✅ Gradient overlay adaptif: dark mode tetap sangat gelap, light mode pakai bg-card */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 55%, transparent 100%)" }} />
      <div className="relative z-10 px-3 pb-3 pt-8 flex flex-col gap-1.5">
        <div className="px-1 pb-2">
          <TimerBar seconds={timer} total={TIMER_SECONDS} />
        </div>
        {answers.map((ans, i) => (
          <button key={i} onClick={() => onAnswer(i)}
            className="w-full text-left flex items-start gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 group"
            // ✅ Ganti hardcode rgba(12,12,20,0.85) → bg-surface adaptif
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--accent-bg)";
              e.currentTarget.style.borderColor = "var(--accent-border)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.15)";
            }}
            onMouseLeave={e => {
              // ✅ Kembali ke bg-surface bukan hardcode dark color
              e.currentTarget.style.background = "var(--bg-surface)";
              e.currentTarget.style.borderColor = "var(--border-md)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            <span className="text-[10px] font-bold rounded-md w-5 h-5 flex items-center justify-center shrink-0 mt-px"
              style={{ background: "var(--bg-surface-md)", color: "var(--text-muted)", border: "1px solid var(--border-md)" }}>
              {labels[i]}
            </span>
            <span className="text-xs leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{ans.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── IdlePanel ──────────────────────────────────────────────── */
function IdlePanel({ bidangList, activeBidang, onSelectBidang, onStart }) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden relative" style={{ ...glass.panel, height: "520px" }}>
      <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />

      <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#3B82F6] shrink-0"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)" }}>
          <IconBot />
          {/* ✅ border adaptif */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ background: "#22D47A", border: "1.5px solid var(--avatar-border)" }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Anty AI</p>
          <div className="flex items-center gap-1.5 mt-px">
            <span className="w-[5px] h-[5px] rounded-full bg-[#22D47A]" />
            {/* ✅ text-faint → text-muted supaya terbaca di light */}
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Online · HRD Evaluator</span>
          </div>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
            Simulasi
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
        <AIChatBubble>Halo! Saya Anty, asisten virtual BletchAI. Saya akan memandu sesi simulasi wawancara HRD kamu.</AIChatBubble>
        <AIChatBubble>
          Pilih bidang keahlian kamu di bawah ini, lalu kita mulai{" "}
          <strong style={{ color: "var(--accent-light)" }}>15 pertanyaan acak</strong> dengan timer 60 detik per soal.
        </AIChatBubble>

        <div className="grid grid-cols-2 gap-2 mt-1">
          {bidangList.map((b) => {
            const isActive = activeBidang === b.name;
            const rgb = hexToRgb(b.color);
            return (
              <button key={b.name} onClick={() => onSelectBidang(b.name)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all duration-150 relative overflow-hidden"
                style={isActive
                  ? { background: `rgba(${rgb},0.10)`, border: `1px solid rgba(${rgb},0.28)`, boxShadow: `inset 0 1px 0 rgba(${rgb},0.15)` }
                  : { background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface-md)"; e.currentTarget.style.borderColor = "var(--border-strong)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border-soft)"; } }}>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl" style={{ background: b.color }} />}
                <span style={{ color: isActive ? b.color : "var(--text-muted)" }}>{b.icon}</span>
                <span className="text-[11px] font-medium leading-[1.3]"
                  style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-4 pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <button onClick={onStart} disabled={!activeBidang}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200"
          style={activeBidang
            ? { background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent-light)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.20), 0 0 16px rgba(59,130,246,0.06)" }
            : { background: "var(--bg-surface)", border: "1px solid var(--border-soft)", color: "var(--text-muted)", cursor: "not-allowed" }}
          onMouseEnter={e => { if (activeBidang) { e.currentTarget.style.background = "rgba(59,130,246,0.24)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 20px rgba(59,130,246,0.12)"; } }}
          onMouseLeave={e => { if (activeBidang) { e.currentTarget.style.background = "var(--accent-bg)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.20), 0 0 16px rgba(59,130,246,0.06)"; } }}>
          {activeBidang ? `Mulai Interview · ${activeBidang.split(" ")[0]}` : "Pilih bidang dulu"}
          {activeBidang && <IconArrow />}
        </button>
      </div>
    </div>
  );
}

/* ─── ActivePanel ────────────────────────────────────────────── */
function ActivePanel({ question, answers, currentIdx, totalQ, timer, chatHistory, isAnswered, isTyping, score, onAnswer, onNext, onBack }) {
  const chatFeedRef   = useRef(null);
  const [overlayHeight, setOverlayHeight] = useState(0);
  const isLast = currentIdx === totalQ - 1;

  useEffect(() => { setOverlayHeight(0); }, [currentIdx]);
  useEffect(() => {
    if (chatFeedRef.current) chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
  }, [chatHistory, isTyping, overlayHeight]);

  const progressPct = ((currentIdx + (isAnswered ? 1 : 0)) / totalQ) * 100;

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden relative" style={{ ...glass.panel, height: "520px" }}>
      <div className="absolute inset-x-0 top-0 h-[2px] z-30">
        <div className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%`, background: "linear-gradient(to right, #3B82F6, #8B5CF6)" }} />
      </div>

      <div className="flex items-center justify-between px-4 py-3 shrink-0 mt-[2px]"
        style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full flex items-center justify-center text-[#3B82F6] shrink-0"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)" }}>
            <IconBot />
            {/* ✅ border adaptif */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "#22D47A", border: "1.5px solid var(--avatar-border)" }} />
          </div>
          <div>
            <p className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>Anty AI — Pewawancara</p>
            {/* ✅ text-faint → text-muted */}
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Sesi aktif</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-[#3B82F6]">{score} poin</p>
            {/* ✅ text-faint → text-muted */}
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{currentIdx + 1}/{totalQ}</p>
          </div>
          <svg viewBox="0 0 32 32" className="w-7 h-7 -rotate-90">
            <circle cx="16" cy="16" r="13" fill="none" stroke="var(--bg-surface-md)" strokeWidth="3"/>
            <circle cx="16" cy="16" r="13" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 13}`}
              strokeDashoffset={`${2 * Math.PI * 13 * (1 - progressPct / 100)}`}
              style={{ transition: "stroke-dashoffset 0.5s ease" }} />
          </svg>
        </div>
      </div>

      <div ref={chatFeedRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0"
        style={{ paddingBottom: !isAnswered && overlayHeight > 0 ? `${overlayHeight + 8}px` : "12px" }}>
        {chatHistory.map((msg, i) =>
          msg.role === "ai"
            ? <AIChatBubble key={i}>{msg.text}</AIChatBubble>
            : <UserChatBubble key={i} text={msg.text} point={msg.point} label={msg.label} />
        )}
        {isTyping && <AIChatBubble typing />}
      </div>

      {!isAnswered && (
        <AnswerOverlay answers={answers} timer={timer} onAnswer={onAnswer} onHeightChange={setOverlayHeight} />
      )}

      {isAnswered && (
        <div className="shrink-0 flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid var(--border-soft)" }}>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[11px] transition-colors"
            // ✅ text-faint → text-muted
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
            <IconBack /> Keluar sesi
          </button>
          <button onClick={onNext}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent-light)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.18)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.24)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.25), 0 0 14px rgba(59,130,246,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-bg)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(59,130,246,0.18)"; }}>
            {isLast ? "Lihat Hasil" : "Lanjut"} <IconArrow />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── ResultPanel ────────────────────────────────────────────── */
function ResultPanel({ score, maxScore, bidang, totalQ, onRetry, onHome }) {
  const pct   = Math.round((score / maxScore) * 100);
  const grade =
    pct >= 85 ? { label: "Excellent",      color: "#3B82F6"  } :
    pct >= 70 ? { label: "Bagus",          color: "#06B6D4"  } :
    pct >= 55 ? { label: "Cukup",          color: "#F59E0B"  } :
                { label: "Perlu Latihan",  color: "#F97316"  };

  return (
    <div className="flex flex-col rounded-2xl overflow-y-auto p-5 gap-5 relative" style={{ ...glass.panel, height: "520px" }}>
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-[0.10] blur-[80px]"
        style={{ background: `radial-gradient(circle, ${grade.color}, transparent 70%)` }} />

      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" r="38" fill="none" stroke="var(--bg-surface-md)" strokeWidth="7"/>
            <circle cx="48" cy="48" r="38" fill="none" stroke={grade.color} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
              style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${grade.color}55)` }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{pct}%</span>
            {/* ✅ text-faint → text-muted */}
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>skor</span>
          </div>
        </div>

        <span className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ background: `rgba(${hexToRgb(grade.color)},0.12)`, color: grade.color, border: `1px solid rgba(${hexToRgb(grade.color)},0.25)` }}>
          {grade.label}
        </span>
        {/* ✅ text-faint → text-muted */}
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Sesi {bidang} selesai</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { val: score,    label: "Poin",  color: "#3B82F6" },
          { val: maxScore, label: "Maks",  color: "var(--text-muted)" },
          { val: totalQ,   label: "Soal",  color: "#06B6D4" },
        ].map(({ val, label, color }) => (
          <div key={label} className="rounded-xl p-3 text-center"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
            <p className="text-lg font-black" style={{ color }}>{val}</p>
            {/* ✅ text-faint → text-muted */}
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <AIChatBubble>
        {pct >= 85
          ? "Performa luar biasa! Anda sangat siap untuk wawancara nyata. Pertahankan kualitas jawaban ini."
          : pct >= 70
          ? "Hasil yang baik. Ada beberapa area yang bisa diperdalam lagi. Terus berlatih dan Anda pasti akan semakin siap."
          : pct >= 55
          ? "Hasil cukup. Pelajari kembali topik yang terasa sulit dan lakukan sesi latihan lebih rutin."
          : "Masih banyak ruang untuk berkembang. Jangan menyerah — setiap latihan membuat Anda semakin siap."}
      </AIChatBubble>

      <div className="flex gap-2 mt-auto">
        <button onClick={onRetry} className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200"
          style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent-light)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.18)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.24)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-bg)"; }}>
          Coba Lagi
        </button>
        <button onClick={onHome} className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-muted)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface-md)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          Ganti Bidang
        </button>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export default function InterviewSection({ openStatsRef }) {
  const [isStatsOpen,   setIsStatsOpen]   = useState(false);
  const [activeBidang,  setActiveBidang]  = useState("Rekayasa Perangkat Lunak");
  const [sessionState,  setSessionState]  = useState("idle");
  const [questions,     setQuestions]     = useState([]);
  const [currentIdx,    setCurrentIdx]    = useState(0);
  const [isAnswered,    setIsAnswered]    = useState(false);
  const [isTimeout,     setIsTimeout]     = useState(false);
  const [isTyping,      setIsTyping]      = useState(false);
  const [score,         setScore]         = useState(0);
  const [timer,         setTimer]         = useState(TIMER_SECONDS);
  const [chatHistory,   setChatHistory]   = useState([]);
  const [stats,         setStats]         = useState(() => loadStats() ?? getInitialStats());
  const timerRef           = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // FIXED: daftarkan fungsi "buka statistik" ke openStatsRef supaya bisa
  // dipanggil dari komponen luar (Navbar / FooterSection) lewat openStatsRef.current()
  useEffect(() => {
    if (openStatsRef) {
      openStatsRef.current = () => setIsStatsOpen(true);
    }
    return () => {
      if (openStatsRef) openStatsRef.current = null;
    };
  }, [openStatsRef]);

  const clearTimer    = useCallback(() => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }, []);
  const clearFeedback = useCallback(() => { if (feedbackTimeoutRef.current) { clearTimeout(feedbackTimeoutRef.current); feedbackTimeoutRef.current = null; } }, []);
  const startTimer    = useCallback(() => {
    clearTimer(); setTimer(TIMER_SECONDS);
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0; } return t - 1; }), 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (sessionState === "active" && timer === 0 && !isAnswered) {
      clearTimer(); setIsTimeout(true); setIsAnswered(true); setIsTyping(true);
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        setIsTyping(false);
        setChatHistory(h => [...h, { role: "ai", text: getHRDFeedback(0, true) }]);
      }, 1200);
    }
  }, [timer, isAnswered, sessionState, clearTimer]);

  useEffect(() => () => { clearTimer(); clearFeedback(); }, [clearTimer, clearFeedback]);

  const handleStart = useCallback(() => {
    if (!activeBidang) return;
    const cfg = BIDANG_CONFIG.find(b => b.name === activeBidang);
    if (!cfg) return;
    clearFeedback();
    const picked = pickRandom(cfg.data, QUESTIONS_PER_SESSION);
    setQuestions(picked); setCurrentIdx(0); setIsAnswered(false); setIsTimeout(false);
    setIsTyping(false); setScore(0);
    setChatHistory([{ role: "ai", text: picked[0].question }]);
    setSessionState("active"); startTimer();
  }, [activeBidang, startTimer, clearFeedback]);

  const handleAnswer = useCallback((idx) => {
    if (isAnswered) return;
    clearTimer();
    const q = questions[currentIdx];
    const ans = q.answers[idx];
    const labels = ["A", "B", "C", "D", "E"];
    const earned = ans.point;
    setScore(s => s + earned); setIsAnswered(true); setIsTimeout(false);
    setChatHistory(h => [...h, { role: "user", text: ans.text, point: earned, label: labels[idx] }]);
    setIsTyping(true);
    feedbackTimeoutRef.current = setTimeout(() => {
      feedbackTimeoutRef.current = null;
      setIsTyping(false);
      setChatHistory(h => [...h, { role: "ai", text: getHRDFeedback(earned, false) }]);
    }, 900 + Math.random() * 400);
  }, [isAnswered, questions, currentIdx, clearTimer]);

  const handleNext = useCallback(() => {
    clearFeedback(); setIsTyping(false);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      const maxS = questions.length * 5;
      const newStats = {
        ...stats,
        totalSessions: stats.totalSessions + 1,
        totalScore: stats.totalScore + score,
        totalPossible: stats.totalPossible + maxS,
        topicCounts: { ...stats.topicCounts, [activeBidang]: (stats.topicCounts[activeBidang] ?? 0) + 1 },
        lastSession: { bidang: activeBidang, score, maxScore: maxS, pct: Math.round((score / maxS) * 100), date: new Date().toISOString() },
      };
      setStats(newStats); saveStats(newStats); clearTimer(); setSessionState("result");
    } else {
      setCurrentIdx(nextIdx); setIsAnswered(false); setIsTimeout(false);
      setChatHistory(h => [...h, { role: "ai", text: questions[nextIdx].question }]); startTimer();
    }
  }, [currentIdx, questions, score, stats, activeBidang, clearTimer, clearFeedback, startTimer]);

  const handleBack  = useCallback(() => { clearTimer(); clearFeedback(); setIsTyping(false); setSessionState("idle"); setChatHistory([]); }, [clearTimer, clearFeedback]);
  const handleRetry = useCallback(() => handleStart(), [handleStart]);

  const avgPct   = calcAvgPct(stats);
  const statCards = [
    { label: "Sesi selesai",  val: stats.totalSessions,                                   color: "#3B82F6", icon: <IconTrophy /> },
    { label: "Rata-rata",     val: `${avgPct}%`,                                           color: "#06B6D4", icon: <IconChart />  },
    { label: "Skor terakhir", val: stats.lastSession ? `${stats.lastSession.pct}%` : "–", color: "#8B5CF6", icon: <IconChart />  },
    { label: "Topik favorit", val: topTopic(stats),                                        color: "#F59E0B", icon: <IconTrophy /> },
  ];
  const SESSION_TARGET = 20;
  const skillBars = [
    { name: "Sesi diselesaikan", pct: Math.min((stats.totalSessions / SESSION_TARGET) * 100, 100), label: `${stats.totalSessions} sesi`, color: "#3B82F6" },
    { name: "Rata-rata skor",    pct: avgPct,                                                       label: `${avgPct}%`,                  color: "#06B6D4" },
    { name: "Skor terakhir",     pct: stats.lastSession?.pct ?? 0, label: stats.lastSession ? `${stats.lastSession.pct}%` : "–",          color: "#8B5CF6" },
  ];
  const maxScoreResult = questions.length * 5;
  const currentQ       = questions[currentIdx];

  return (
    <section id="interview" className="relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--border-soft) 30%, var(--border-soft) 70%, transparent)" }} />

      <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[400px] rounded-full opacity-[0.055] blur-[160px]"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />
      <div className="pointer-events-none absolute top-20 right-0 w-[350px] h-[300px] rounded-full opacity-[0.04] blur-[130px]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-32 left-1/3 w-[300px] h-[250px] rounded-full opacity-[0.035] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

      <div className="pointer-events-none absolute inset-0 opacity-[0.016]"
        style={{
          backgroundImage: "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-12 py-12 md:py-16">
        <div className="w-full max-w-[1100px]">

          <Reveal>
            <div className="flex items-center gap-3 mb-8 md:mb-10">
              <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "var(--border-strong)" }}>Simulasi</p>
              <div className="h-px flex-1 max-w-[40px]" style={{ background: "var(--border-soft)" }} />
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)", boxShadow: "inset 0 1px 0 rgba(59,130,246,0.12)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" style={{ boxShadow: "0 0 4px #3B82F6" }} />
                Interview AI
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start">

            {/* LEFT — info card */}
            <Reveal>
              <motion.div className="rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden"
                style={glass.card}
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}>
                <div className="absolute inset-x-0 top-0 h-[1.5px]"
                  style={{ background: "linear-gradient(to right, #3B82F6, rgba(139,92,246,0.5) 50%, transparent)" }} />
                <div className="pointer-events-none absolute -top-24 -left-12 w-60 h-60 rounded-full opacity-[0.06] blur-[90px]"
                  style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />

                <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em] mb-3"
                  style={{ color: "var(--border-strong)" }}>Tingkatkan Keahlian</p>

                <h1 className="text-[38px] sm:text-[44px] md:text-[52px] font-extrabold leading-[1.05] tracking-[-0.03em] mb-4"
                  style={{ color: "var(--text-primary)" }}>
                  interview{" "}
                  <span className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>mu!</span>
                </h1>

                <p className="text-sm leading-[1.7] mb-7 max-w-[400px]" style={{ color: "var(--text-muted)" }}>
                  Berlatih wawancara bersama{" "}
                  <strong className="font-medium" style={{ color: "var(--text-secondary)" }}>Anty</strong>, asisten virtual BletchAI.
                  Pilih jurusanmu, jawab pertanyaan, dan dapatkan evaluasi real-time dari AI.
                </p>

                <div className="flex gap-2.5 mb-5">
                  {[
                    { val: stats.totalSessions, label: "Sesi selesai",   color: "var(--text-primary)" },
                    { val: `${avgPct}%`,         label: "Rata-rata skor", color: "#06B6D4" },
                    { val: topTopic(stats),      label: "Topik favorit",  color: "#8B5CF6" },
                  ].map(({ val, label, color }) => (
                    <div key={label} className="rounded-xl px-3 py-3 flex-1 min-w-0 relative overflow-hidden"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
                      <span className="block text-lg font-bold leading-[1.1] truncate" style={{ color }}>{val}</span>
                      {/* ✅ text-faint → text-muted */}
                      <span className="block text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap mb-7">
                  {[
                    { dot: "#F59E0B", text: "4.9 Rating"     },
                    { dot: "#3B82F6", text: "~10 menit"       },
                    { dot: "#3B82F6", text: "60 detik / soal" },
                    { dot: "#06B6D4", text: "15 soal random"  },
                  ].map(({ dot, text }) => (
                    <span key={text} className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-xs"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)", color: "var(--text-muted)" }}>
                      <span className="w-[5px] h-[5px] rounded-full" style={{ background: dot }} />
                      {text}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setIsStatsOpen(p => !p)}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] transition-all duration-200"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: isStatsOpen ? "var(--text-secondary)" : "var(--text-muted)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface-md)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = isStatsOpen ? "var(--text-secondary)" : "var(--text-muted)"; }}>
                    <IconChart />
                    <span>{isStatsOpen ? "Sembunyikan statistik" : "Lihat statistik"}</span>
                    <svg viewBox="0 0 12 12" fill="none" className={`w-3 h-3 transition-transform duration-300 ${isStatsOpen ? "rotate-180" : ""}`}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div className={`overflow-hidden transition-all duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isStatsOpen ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}>
                  <div style={{ borderTop: "1px solid var(--border-soft)" }} className="pt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {statCards.map((s) => (
                        <div key={s.label} className="rounded-xl p-3 min-w-0 relative overflow-hidden"
                          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
                          <div className="absolute inset-x-0 top-0 h-[1.5px]"
                            style={{ background: `linear-gradient(to right, ${s.color}, transparent 70%)` }} />
                          <div className="mb-1.5" style={{ color: s.color }}>{s.icon}</div>
                          <div className="text-base font-bold leading-[1.1] mb-1 truncate" style={{ color: s.color }}>{s.val}</div>
                          {/* ✅ text-faint → text-muted */}
                          <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl px-4 py-4"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}>
                      <p className="text-[10px] font-medium uppercase tracking-[0.10em] mb-4"
                        style={{ color: "var(--text-muted)" }}>
                        Progress kamu
                      </p>
                      {skillBars.map((s) => (
                        <div key={s.name} className="mb-3 last:mb-0">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.name}</span>
                            <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label ?? `${s.pct}%`}</span>
                          </div>
                          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "var(--bg-surface-md)" }}>
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* RIGHT — interactive panel */}
            <motion.div style={{ height: "520px" }}
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}>
              {sessionState === "idle" && (
                <IdlePanel bidangList={BIDANG_CONFIG} activeBidang={activeBidang} onSelectBidang={setActiveBidang} onStart={handleStart} />
              )}
              {sessionState === "active" && currentQ && (
                <ActivePanel question={currentQ.question} answers={currentQ.answers} currentIdx={currentIdx}
                  totalQ={questions.length} timer={timer} chatHistory={chatHistory} isAnswered={isAnswered}
                  isTimeout={isTimeout} isTyping={isTyping} score={score}
                  onAnswer={handleAnswer} onNext={handleNext} onBack={handleBack} />
              )}
              {sessionState === "result" && (
                <ResultPanel score={score} maxScore={maxScoreResult} bidang={activeBidang}
                  totalQ={questions.length} onRetry={handleRetry} onHome={handleBack} />
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}