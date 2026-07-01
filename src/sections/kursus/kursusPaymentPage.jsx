import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Wallet,
  Building2,
  QrCode,
  CreditCard,
  Check,
  Clock,
  ShieldCheck,
  Copy,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "../../components/Reveal.jsx";
import { getCourseById } from "../../components/kursus.js";
import { getJurusanByCategory } from "../../components/jurusan.js";
import { markCoursePurchased } from "./kursusPurchased.js";

const METHODS = [
  {
    group: "E-Wallet",
    icon: Wallet,
    items: [
      { id: "dana", name: "DANA", note: "Bayar pakai saldo DANA" },
      { id: "ovo", name: "OVO", note: "Bayar pakai saldo OVO" },
      { id: "gopay", name: "GoPay", note: "Bayar pakai saldo GoPay" },
      { id: "shopeepay", name: "ShopeePay", note: "Bayar pakai saldo ShopeePay" },
    ],
  },
  {
    group: "QRIS",
    icon: QrCode,
    items: [{ id: "qris", name: "QRIS", note: "Scan pakai e-wallet atau m-banking apa saja" }],
  },
  {
    group: "Transfer Bank",
    icon: Building2,
    items: [
      { id: "bca", name: "Bank BCA", note: "Virtual Account" },
      { id: "bni", name: "Bank BNI", note: "Virtual Account" },
      { id: "mandiri", name: "Bank Mandiri", note: "Virtual Account" },
    ],
  },
  {
    group: "Kartu",
    icon: CreditCard,
    items: [{ id: "card", name: "Kartu Kredit/Debit", note: "Visa, Mastercard, JCB" }],
  },
];

function initialsBadge(id) {
  const map = { dana: "DANA", ovo: "OVO", gopay: "GoPay", shopeepay: "SPay", qris: "QRIS", bca: "BCA", bni: "BNI", mandiri: "MDR", card: "CARD" };
  return map[id] || id.slice(0, 4).toUpperCase();
}

function Countdown({ seconds }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const m = Math.floor(left / 60).toString().padStart(2, "0");
  const s = (left % 60).toString().padStart(2, "0");
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{m}:{s}</span>;
}

function QRPattern({ size = 168 }) {
  const cells = 21;
  const cellSize = size / cells;
  const seedRand = (x, y) => {
    const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const isFinder = (x, y) => (x < 7 && y < 7) || (x > cells - 8 && y < 7) || (x < 7 && y > cells - 8);
  const finderPattern = (ox, oy) => (
    <g key={`f-${ox}-${oy}`}>
      <rect x={ox} y={oy} width={7 * cellSize} height={7 * cellSize} fill="#0B0B10" />
      <rect x={ox + cellSize} y={oy + cellSize} width={5 * cellSize} height={5 * cellSize} fill="#fff" />
      <rect x={ox + 2 * cellSize} y={oy + 2 * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#0B0B10" />
    </g>
  );
  const dots = [];
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (isFinder(x, y)) continue;
      if (seedRand(x, y) > 0.56) {
        dots.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill="#0B0B10" />);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="#fff" />
      {dots}
      {finderPattern(0, 0)}
      {finderPattern((cells - 7) * cellSize, 0)}
      {finderPattern(0, (cells - 7) * cellSize)}
    </svg>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: muted ? "var(--text-muted)" : "var(--text-primary)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function KursusPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id);

  const [step, setStep] = useState("select"); // select | waiting | success
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const vaNumber = "8808 1234 5678 9012";

  // ADDED: begitu step masuk "success", catat kursus ini sebagai sudah dibeli
  // supaya di halaman lain (carousel, detail, modal) tombolnya berubah jadi
  // "Lanjutkan Belajar" dan tidak mengarahkan ke pembayaran lagi.
  useEffect(() => {
    if (step === "success" && course) {
      markCoursePurchased(course.id);
    }
  }, [step, course]);

  if (!course) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-base)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Kursus tidak ditemukan.</p>
        <button
          onClick={() => navigate("/")}
          className="text-[12px] font-medium px-4 py-2 rounded-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}
        >
          Kembali ke beranda
        </button>
      </section>
    );
  }

  const method = METHODS.flatMap((g) => g.items).find((m) => m.id === selected);
  const jurusanMatch = getJurusanByCategory(course.category);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <style>{`
        @keyframes kursus-ambient-drift {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(24%, -22%) scale(1.12); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        .kursus-ambient-drift { animation: kursus-ambient-drift 10s ease-in-out infinite; }

        @keyframes kursus-pulse-glow {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.85; }
        }
        .kursus-pulse-glow { animation: kursus-pulse-glow 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .kursus-ambient-drift, .kursus-pulse-glow { animation: none; }
        }
      `}</style>

      {/* ── Ambient background blobs — diwarnai dari aksen kursus, sama seperti home page ── */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[380px] rounded-full opacity-[0.07] blur-[150px]"
        style={{ background: `radial-gradient(circle, ${course.accent}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -right-20 w-[320px] h-[280px] rounded-full opacity-[0.045] blur-[130px]"
        style={{ background: `radial-gradient(circle, ${course.accent}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[220px] rounded-full opacity-[0.035] blur-[120px]"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <button
          onClick={() => (step === "select" ? navigate(`/kursus/${course.id}`) : setStep("select"))}
          className="flex items-center gap-1.5 text-[12px] font-medium mb-6 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ChevronLeft size={15} />
          {step === "select" ? "Kembali ke detail kursus" : "Ganti metode pembayaran"}
        </button>

        {step === "select" && (
          <Reveal>
            <div className="grid sm:grid-cols-[1fr_1.4fr] gap-6">
              {/* Order summary */}
              <div>
                <div
                  className="rounded-2xl p-5 sticky top-6 relative overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    backdropFilter: "blur(28px)",
                    WebkitBackdropFilter: "blur(28px)",
                    border: "1px solid var(--border-md)",
                    boxShadow: `0 8px 40px var(--shadow-card-lg), 0 0 0 1px rgba(${course.accentRgb},0.12), inset 0 1px 0 var(--card-inset)`,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-[1.5px]"
                    style={{ background: `linear-gradient(to right, ${course.accent}, rgba(${course.accentRgb},0.1) 60%, transparent)` }} />

                  {/* Ambient drift blob di dalam card */}
                  <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
                    <div
                      className="absolute w-[130%] h-[130%] -left-1/4 -bottom-1/3 kursus-ambient-drift"
                      style={{ background: `radial-gradient(circle, rgba(${course.accentRgb},0.05) 0%, transparent 70%)` }} />
                  </div>

                  <span
                    className="inline-block text-[10px] font-semibold px-2.5 py-[3px] rounded-full mb-3"
                    style={{ background: `rgba(${course.accentRgb},0.14)`, color: course.accent, border: `1px solid rgba(${course.accentRgb},0.25)` }}
                  >
                    {course.category}
                  </span>
                  <h1 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{course.title}</h1>
                  <p className="text-[12px] mb-1" style={{ color: "var(--text-secondary)" }}>oleh {course.mentor}</p>
                  <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>
                    {course.duration} · {course.sessions} · {course.ageRange}
                  </p>

                  <div className="pt-4 flex flex-col gap-2.5" style={{ borderTop: "1px solid var(--border-soft)" }}>
                    <Row label="Harga kursus" value={course.price} />
                    <Row label="Biaya layanan" value="Gratis" muted />
                    <div className="pt-3 mt-1 flex justify-between" style={{ borderTop: "1px solid var(--border-soft)" }}>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Total bayar</span>
                      <span className="text-[17px] font-bold" style={{ color: course.accent }}>{course.price}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 items-start text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <ShieldCheck size={14} className="flex-shrink-0 mt-[1px]" />
                    <span>Pembayaran aman dan terenksripsi.</span>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div>
                <h2 className="text-[14px] font-semibold mb-3.5" style={{ color: "var(--text-primary)" }}>Pilih metode pembayaran</h2>
                <div className="flex flex-col gap-4">
                  {METHODS.map((group) => (
                    <div key={group.group}>
                      <div className="flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        <group.icon size={12} />
                        {group.group}
                      </div>
                      <div className="flex flex-col gap-2">
                        {group.items.map((item) => {
                          const active = selected === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setSelected(item.id)}
                              className="flex items-center justify-between w-full text-left rounded-xl px-3.5 py-3 transition-all duration-200"
                              style={{
                                background: active ? `rgba(${course.accentRgb},0.10)` : "var(--bg-surface)",
                                border: `1px solid ${active ? course.accent : "var(--border-md)"}`,
                                boxShadow: active
                                  ? `inset 0 1px 0 rgba(${course.accentRgb},0.18), 0 4px 16px rgba(${course.accentRgb},0.12)`
                                  : `inset 0 1px 0 var(--card-inset)`,
                              }}
                              onMouseEnter={(e) => {
                                if (!active) {
                                  e.currentTarget.style.background = "var(--bg-surface-md)";
                                  e.currentTarget.style.borderColor = "var(--border-strong)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!active) {
                                  e.currentTarget.style.background = "var(--bg-surface)";
                                  e.currentTarget.style.borderColor = "var(--border-md)";
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                  style={{
                                    background: active ? `rgba(${course.accentRgb},0.16)` : "var(--bg-surface-md)",
                                    border: `1px solid ${active ? `rgba(${course.accentRgb},0.3)` : "var(--border-md)"}`,
                                    color: active ? course.accent : "var(--text-secondary)",
                                  }}
                                >
                                  {initialsBadge(item.id)}
                                </div>
                                <div>
                                  <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.note}</div>
                                </div>
                              </div>
                              <div
                                className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ border: `2px solid ${active ? course.accent : "var(--border-strong)"}` }}
                              >
                                {active && <div className="w-[9px] h-[9px] rounded-full" style={{ background: course.accent }} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => selected && setStep("waiting")}
                  disabled={!selected}
                  className="w-full mt-6 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200"
                  style={{
                    background: selected ? course.accent : "var(--bg-surface)",
                    color: selected ? "#fff" : "var(--text-muted)",
                    cursor: selected ? "pointer" : "not-allowed",
                    boxShadow: selected
                      ? `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selected) e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 22px rgba(${course.accentRgb},0.48)`;
                  }}
                  onMouseLeave={(e) => {
                    if (selected) e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`;
                  }}
                >
                  {selected ? `Bayar ${course.price}` : "Pilih metode pembayaran"}
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {step === "waiting" && method && (
          <Reveal>
            <div className="max-w-[420px] mx-auto mt-4">
              <div
                className="rounded-2xl p-7 text-center relative overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1px solid var(--border-md)",
                  boxShadow: `0 8px 40px var(--shadow-card-lg), 0 0 0 1px rgba(${course.accentRgb},0.12), inset 0 1px 0 var(--card-inset)`,
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1.5px]"
                  style={{ background: `linear-gradient(to right, ${course.accent}, rgba(${course.accentRgb},0.1) 60%, transparent)` }} />

                <p className="text-[12px] mb-1" style={{ color: "var(--text-secondary)" }}>Menunggu pembayaran via</p>
                <h2 className="text-[17px] font-semibold mb-5" style={{ color: "var(--text-primary)" }}>{method.name}</h2>

                {(method.id === "qris" || ["dana", "ovo", "gopay", "shopeepay"].includes(method.id)) && (
                  <>
                    <div className="inline-block p-3 rounded-xl mb-4"
                      style={{ background: "#fff", boxShadow: `0 0 0 1px rgba(${course.accentRgb},0.18), 0 8px 24px rgba(${course.accentRgb},0.12)` }}>
                      <QRPattern size={176} />
                    </div>
                    <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
                      Buka aplikasi {method.name === "QRIS" ? "e-wallet atau m-banking" : method.name}, lalu pindai kode di atas.
                    </p>
                  </>
                )}

                {["bca", "bni", "mandiri"].includes(method.id) && (
                  <div className="mb-4">
                    <p className="text-[11px] mb-2" style={{ color: "var(--text-muted)" }}>Nomor Virtual Account</p>
                    <div
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 cursor-pointer text-[15px] font-semibold tracking-wide transition-all duration-200"
                      style={{
                        background: "var(--bg-surface)",
                        border: `1px solid ${copied ? course.accent : "var(--border-strong)"}`,
                        color: "var(--text-primary)",
                        boxShadow: copied ? `inset 0 1px 0 rgba(${course.accentRgb},0.18), 0 0 14px rgba(${course.accentRgb},0.14)` : `inset 0 1px 0 var(--card-inset)`,
                      }}
                    >
                      {vaNumber}
                      <Copy size={13} style={{ color: copied ? course.accent : "var(--text-muted)" }} />
                    </div>
                    <p className="text-[10px] mt-1.5 min-h-[14px]" style={{ color: copied ? course.accent : "var(--text-muted)" }}>
                      {copied ? "Tersalin" : "Ketuk untuk menyalin"}
                    </p>
                  </div>
                )}

                {method.id === "card" && (
                  <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
                    Mengarahkan ke halaman input kartu yang aman...
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-secondary)" }}>
                  <Clock size={13} />
                  Selesaikan dalam <Countdown seconds={15 * 60} />
                </div>

                <div className="pt-4 text-[13px] font-semibold" style={{ borderTop: "1px solid var(--border-soft)", color: "var(--text-primary)" }}>
                  Total: <span style={{ color: course.accent }}>{course.price}</span>
                </div>

                <button
                  onClick={() => setStep("success")}
                  className="w-full mt-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: course.accent,
                    color: "#fff",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 22px rgba(${course.accentRgb},0.48)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`; }}
                >
                  Selesaikan pembayaran
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {step === "success" && (
          <Reveal>
            <div className="max-w-[420px] mx-auto mt-8 text-center">
              {/* Check icon — ring berlapis + animasi masuk */}
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div
                  className="absolute inset-0 rounded-full kursus-pulse-glow"
                  style={{ boxShadow: `0 0 0 8px rgba(${course.accentRgb},0.06)` }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `rgba(${course.accentRgb},0.12)`, border: `1px solid rgba(${course.accentRgb},0.28)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={28} strokeWidth={2.5} style={{ color: course.accent }} />
                </div>
              </div>

              <h2 className="text-[18px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                Pembayaran berhasil
              </h2>
              <p className="text-[12px] mb-6 px-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Kamu sekarang punya akses ke <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>"{course.title}"</span>.
              </p>

              {/* Receipt card */}
              <div
                className="rounded-2xl text-left mb-6 relative overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-md)",
                  boxShadow: `0 8px 32px rgba(${course.accentRgb},0.08), inset 0 1px 0 var(--card-inset)`,
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1.5px]"
                  style={{ background: `linear-gradient(to right, ${course.accent}, rgba(${course.accentRgb},0.1) 60%, transparent)` }} />

                <div className="px-5 pt-5 pb-4 flex flex-col gap-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>Kursus</span>
                    <span className="text-[12px] font-medium text-right" style={{ color: "var(--text-primary)" }}>{course.title}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>Metode</span>
                    <span className="text-[12px] font-medium text-right" style={{ color: "var(--text-primary)" }}>{method ? method.name : "-"}</span>
                  </div>
                </div>

                {/* Garis putus-putus gaya struk */}
                <div className="relative px-5">
                  <div
                    className="h-px w-full"
                    style={{
                      backgroundImage: `repeating-linear-gradient(to right, var(--border-strong) 0 6px, transparent 6px 12px)`,
                    }}
                  />
                </div>

                <div className="px-5 py-4 flex justify-between items-center">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Total dibayar</span>
                  <span className="text-[16px] font-bold" style={{ color: course.accent }}>{course.price}</span>
                </div>
              </div>

              {jurusanMatch && (
                <button
                  onClick={() => navigate(`/jurusan/${jurusanMatch.id}`)}
                  className="w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 mb-2.5"
                  style={{
                    background: course.accent,
                    color: "#fff",
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 22px rgba(${course.accentRgb},0.48)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px rgba(${course.accentRgb},0.35)`; }}
                >
                  Mulai Belajar <ArrowUpRight size={13} />
                </button>
              )}
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-xl text-[13px] font-medium transition-colors duration-200"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
              >
                Kembali ke beranda
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}