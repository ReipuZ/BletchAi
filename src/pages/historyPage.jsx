import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search, Trash2, MessageSquare,
  Send, ArrowLeft, History as HistoryIcon, MessageCirclePlus,
} from "lucide-react";
import {
  listSessions,
  deleteSession,
  formatRelativeTime,
  groupSessionsByDate,
} from "../components/chatHistoryStore";

// NEW: helper untuk membuat sinyal navigasi ke beranda yang SEKALI PAKAI.
// navId unik dipakai HomeSection untuk membedakan "klik baru" vs "replay
// state lama lewat tombol back/forward browser" — ini yang memperbaiki bug
// overlay chat muncul tiba-tiba tanpa diminta.
function makeOpenChatSignal(extra = {}) {
  return {
    openChat: true,
    navId: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...extra,
  };
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const data = await listSessions();
    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === sessionId) || null,
    [sessions, sessionId]
  );

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.text?.toLowerCase().includes(q))
    );
  }, [sessions, search]);

  const groups = useMemo(() => groupSessionsByDate(filteredSessions), [filteredSessions]);

  const handleSelect = (id) => navigate(`/history/${id}`);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    await deleteSession(id);
    setConfirmDeleteId(null);
    if (sessionId === id) navigate("/history");
    loadSessions();
  };

  // NEW: mulai chat kosong dari beranda (overlay terbuka tanpa riwayat)
  const handleStartNewChat = () => {
    navigate("/", { state: makeOpenChatSignal() });
  };

  // FIX: tombol "kembali" hanya kembali ke beranda biasa, TANPA membuka
  // chat overlay. Sebelumnya tombol ini memakai handleStartNewChat yang
  // membawa sinyal openChat, sehingga overlay ikut muncul tiap kali user
  // menekan tombol kembali — sekarang dipisah agar navigasinya bersih.
  const handleBack = () => {
    navigate("/");
  };

  // NEW: lanjutkan percakapan yang sedang dibuka di detail view — overlay
  // dibuka dengan riwayat pesan sesi ini, dan ChatOverlay akan UPDATE sesi
  // yang sama (bukan membuat sesi baru) saat ditutup nanti.
  const handleContinueChat = () => {
    if (!activeSession) return;
    navigate("/", {
      state: makeOpenChatSignal({
        continueSession: true,
        sessionId: activeSession.id,
        sessionMessages: activeSession.messages,
      }),
    });
  };

  // ============================================================
  // DETAIL VIEW (full screen, satu percakapan)
  // ============================================================
  if (activeSession) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--bg-base, #000000)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 md:px-8 py-4 shrink-0 sticky top-0 z-10"
          style={{ background: "var(--bg-base, #000000)", borderBottom: "1px solid var(--border-soft)" }}
        >
          <button
            onClick={() => navigate("/history")}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-md)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
          >
            <ArrowLeft size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm md:text-base font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {activeSession.title}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {new Date(activeSession.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* NEW: dua tombol berdampingan — "Lanjutkan chat" (melanjutkan
              percakapan ini) dan "Mulai chat baru" (percakapan kosong) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={handleContinueChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
            >
              <MessageCirclePlus size={11} />
              Lanjutkan chat
            </button>
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
              style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent-light)" }}
            >
              <Send size={11} />
              Mulai chat baru
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 [&::-webkit-scrollbar]:hidden">
          <div className="max-w-[760px] mx-auto space-y-3">
            {activeSession.messages.map((msg, i) =>
              msg.text ? (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div
                      className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                    >
                      <Search size={11} style={{ color: "var(--accent-light)" }} />
                    </div>
                  )}
                  <div
                    className="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.role === "user"
                        ? {
                            background: "var(--accent-bg)",
                            border: "1px solid var(--accent-border)",
                            color: "var(--accent-light)",
                            borderBottomRightRadius: "6px",
                          }
                        : {
                            background: "var(--bg-surface-md)",
                            border: "1px solid var(--border-soft)",
                            color: "var(--text-secondary)",
                            borderBottomLeftRadius: "6px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Footer mobile — NEW: dua tombol juga di versi mobile */}
        <div
          className="sm:hidden px-4 py-3 shrink-0 flex items-center gap-2"
          style={{ borderTop: "1px solid var(--border-soft)" }}
        >
          <button
            onClick={handleContinueChat}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-all duration-200"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)", color: "var(--text-secondary)" }}
          >
            <MessageCirclePlus size={11} />
            Lanjutkan chat
          </button>
          <button
            onClick={handleStartNewChat}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-all duration-200"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)", color: "var(--accent-light)" }}
          >
            <Send size={11} />
            Chat baru
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // LIST VIEW (full screen, daftar riwayat — mirip Claude)
  // ============================================================
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-base, #000000)" }}
    >
      <div className="max-w-[860px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-md)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
          >
            <ArrowLeft size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
            >
              <HistoryIcon size={14} style={{ color: "var(--accent-light)" }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                Riwayat Chat
              </h1>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                {sessions.length} percakapan tersimpan
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div
          className="relative flex items-center rounded-xl px-3.5 py-2.5 mb-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} className="shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari riwayat..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm ml-2.5"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl animate-pulse"
                style={{ background: "var(--bg-surface)" }}
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-24">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
            >
              <MessageSquare size={20} style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {search.trim() ? "Tidak ditemukan" : "Belum ada riwayat"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {search.trim()
                ? "Coba kata kunci lain"
                : "Percakapan kamu dengan BLETCH AI akan muncul di sini"}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-6">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest px-1 py-2"
                style={{ color: "var(--text-label)", letterSpacing: "0.07em" }}
              >
                {group.label}
              </p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--border-soft)" }}
              >
                {group.sessions.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className="group relative w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150"
                    style={{
                      background: "var(--bg-card)",
                      borderTop: idx === 0 ? "none" : "1px solid var(--border-soft)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-card)"; }}
                  >
                    <MessageSquare
                      size={14}
                      className="shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {s.title}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {s.messages.length} pesan
                      </p>
                    </div>
                    <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>
                      {formatRelativeTime(s.updatedAt)}
                    </span>

                    {/* Tombol hapus */}
                    <span
                      onClick={(e) => handleDelete(s.id, e)}
                      role="button"
                      tabIndex={-1}
                      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{
                        background: confirmDeleteId === s.id ? "rgba(239,68,68,0.14)" : "var(--bg-surface)",
                        border: confirmDeleteId === s.id ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border-soft)",
                      }}
                    >
                      <Trash2
                        size={12}
                        style={{ color: confirmDeleteId === s.id ? "#F87171" : "var(--text-muted)" }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}