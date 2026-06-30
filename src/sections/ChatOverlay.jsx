import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Search } from "lucide-react";
import { saveSession, updateSession } from "../components/chatHistoryStore";

// CHANGED: ChatOverlay sekarang menerima dua prop baru:
// - initialMessages: riwayat pesan lama, dipakai saat user menekan
//   "Lanjutkan chat" dari HistoryPage. Kalau kosong/undefined, overlay
//   mulai dari percakapan kosong seperti biasa.
// - sessionId: id sesi yang sedang dilanjutkan. Kalau ada, saat overlay
//   ditutup kita UPDATE sesi itu (updateSession) supaya percakapan
//   menyambung di entri yang sama, bukan membuat duplikat baru.
export default function ChatOverlay({
  show,
  onClose,
  initialMessage = "",
  initialMessages = null,
  sessionId = null,
}) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const didSendInitial = useRef(false);
  // NEW: simpan sessionId yang sedang aktif di overlay ini. Dipisah dari
  // prop supaya tidak berubah di tengah sesi kalau parent re-render dengan
  // prop sessionId yang berbeda sebelum overlay sempat ditutup.
  // ID ini juga yang dikirim ke backend (/chat) supaya Anty bisa mengingat
  // riwayat percakapan dari pesan ke pesan, bukan cuma riwayat lokal di
  // chatHistoryStore.
  const activeSessionIdRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (show) {
      // CHANGED: saat overlay dibuka, tentukan dulu apakah ini melanjutkan
      // sesi lama (initialMessages diisi) atau chat baru.
      if (!didSendInitial.current) {
        if (initialMessages && initialMessages.length > 0) {
          setMessages(initialMessages);
          activeSessionIdRef.current = sessionId || null;
        }

        // NEW: kalau belum ada sessionId aktif (chat baru, bukan lanjutan
        // dari history lama), generate satu sessionId baru. Ini dikirim ke
        // backend supaya Anty mengingat konteks percakapan selama overlay
        // ini terbuka, terlepas dari sessionId riwayat lokal di
        // chatHistoryStore (dua hal yang berbeda, kebetulan bisa sama).
        if (!activeSessionIdRef.current) {
          activeSessionIdRef.current = crypto.randomUUID();
        }

        didSendInitial.current = true;

        if (initialMessage) {
          sendMessage(initialMessage);
        }
      }
    }

    if (!show) {
      didSendInitial.current = false;

      // CHANGED: sebelum messages direset ke kosong, simpan/update dulu
      // sesi ini ke riwayat (kalau ada isinya).
      // - Kalau activeSessionIdRef terisi (sedang melanjutkan sesi lama),
      //   pakai updateSession supaya menyambung di entri yang sama.
      // - Kalau tidak, pakai saveSession seperti biasa (sesi baru).
      if (messages.length > 0) {
        if (sessionId) {
          updateSession(activeSessionIdRef.current, messages);
        } else {
          saveSession(messages);
        }
      }

      activeSessionIdRef.current = null;
      setMessages([]);
      setInputValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, initialMessage, initialMessages, sessionId]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || isLoading) return;
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsLoading(true);
    try {
      const response = await fetch("https://bletchai-production.up.railway.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NEW: kirim sessionId supaya backend tahu ini lanjutan percakapan
        // mana, dan bisa menyertakan riwayat sebelumnya saat tanya ke Groq.
        body: JSON.stringify({ message: msg, sessionId: activeSessionIdRef.current }),
      });
      const data = await response.json();
      const reply =
        typeof data.reply === "string" && data.reply.trim() !== ""
          ? data.reply.trim()
          : data.error || "Hmm, aku nggak dapet jawabannya nih. Coba tanya lagi ya 😅";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Waduh, gagal konek ke server nih 😓 Pastiin backend sudah berjalan ya!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);

  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="overlay-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0"
            style={{ zIndex: 9998, background: "var(--overlay)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="overlay-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 flex flex-col"
            style={{
              zIndex: 9999,
              height: "clamp(500px, 78vh, 720px)",
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border-md)",
              borderLeft: "1px solid var(--border-soft)",
              borderRight: "1px solid var(--border-soft)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -24px 80px rgba(0,0,0,0.30), inset 0 1px 0 var(--border-soft)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-strong)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                >
                  <Search size={13} style={{ color: "var(--accent-light)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                    BLETCH AI
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Asisten karier kamu
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-md)"; e.currentTarget.style.borderColor = "var(--border-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border-soft)"; }}
              >
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-3 [&::-webkit-scrollbar]:hidden">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                  >
                    <Search size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      Tanyakan apa saja
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      CV, tips interview, info jurusan, atau peluang karier
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) =>
                msg.text ? (
                  <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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

              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div
                    className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                  >
                    <Search size={11} style={{ color: "var(--accent-light)" }} />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: "var(--bg-surface-md)", border: "1px solid var(--border-soft)", borderBottomLeftRadius: "6px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: "var(--accent)", animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 md:px-8 py-3 shrink-0" style={{ borderTop: "1px solid var(--border-soft)" }}>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-md)" }}
              >
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ketik pertanyaanmu..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text-primary)" }}
                  onFocus={(e) => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "var(--accent-border)";
                    w.style.boxShadow = "0 0 0 3px var(--accent-bg)";
                  }}
                  onBlur={(e) => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "var(--border-md)";
                    w.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-border)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-bg)"; }}
                >
                  <Send size={13} style={{ color: "var(--accent-light)" }} />
                </button>
              </div>
              <p className="text-[9px] text-center mt-2" style={{ color: "var(--text-faint)" }}>
                Jawaban berdasarkan informasi yang tersedia · BLETCH AI
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}