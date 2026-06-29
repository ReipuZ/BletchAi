import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Search } from "lucide-react";

export default function ChatOverlay({ show, onClose, initialMessage = "" }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const didSendInitial = useRef(false);

  // Auto-scroll ke bawah tiap ada pesan baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Kirim initialMessage otomatis saat overlay pertama dibuka
  useEffect(() => {
    if (show && initialMessage && !didSendInitial.current) {
      didSendInitial.current = true;
      sendMessage(initialMessage);
    }
    if (!show) {
      didSendInitial.current = false;
      setMessages([]);
      setInputValue("");
    }
  }, [show, initialMessage]);

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
        body: JSON.stringify({ message: msg }),
      });

      const data = await response.json();

      // Guard: pastikan reply ada dan bukan string kosong
      const reply =
        typeof data.reply === "string" && data.reply.trim() !== ""
          ? data.reply.trim()
          : data.error || "Hmm, aku nggak dapet jawabannya nih. Coba tanya lagi ya 😅";

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Waduh, gagal konek ke server nih 😓 Pastiin backend sudah berjalan ya!",
        },
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0"
            style={{
              zIndex: 9998,
              background: "rgba(0,0,0,0.60)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={onClose}
          />

          {/* Panel — slide up dari bawah */}
          <motion.div
            key="overlay-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 flex flex-col"
            style={{
              zIndex: 9999,
              height: "clamp(500px, 78vh, 720px)",
              background: "rgba(8,8,8,0.97)",
              borderTop: "1px solid rgba(255,255,255,0.10)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -24px 80px rgba(0,0,0,0.80), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.30)" }}
                >
                  <Search size={13} style={{ color: "#93C5FD" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#E0E0E0] leading-none">BLETCH AI</p>
                  <p className="text-[10px] text-[#444444] mt-0.5">Asisten karier kamu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              >
                <X size={14} style={{ color: "#666666" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-3 [&::-webkit-scrollbar]:hidden">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.20)" }}
                  >
                    <Search size={20} style={{ color: "#3B82F6" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#888888]">Tanyakan apa saja</p>
                    <p className="text-xs text-[#444444] mt-1">CV, tips interview, info jurusan, atau peluang karier</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                // Guard: skip render kalau text kosong / undefined
                msg.text ? (
                  <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div
                        className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
                      >
                        <Search size={11} style={{ color: "#93C5FD" }} />
                      </div>
                    )}
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed whitespace-pre-wrap"
                      style={
                        msg.role === "user"
                          ? { background: "rgba(59,130,246,0.20)", border: "1px solid rgba(59,130,246,0.28)", color: "#BFDBFE", borderBottomRightRadius: "6px" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#CCCCCC", borderBottomLeftRadius: "6px" }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ) : null
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div
                    className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
                  >
                    <Search size={11} style={{ color: "#93C5FD" }} />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: "6px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 md:px-8 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ketik pertanyaanmu..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-[#E2E8F0] placeholder:text-[#333333]"
                  onFocus={(e) => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "rgba(59,130,246,0.40)";
                    w.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.06)";
                  }}
                  onBlur={(e) => {
                    const w = e.currentTarget.parentElement;
                    w.style.borderColor = "rgba(255,255,255,0.08)";
                    w.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "rgba(59,130,246,0.22)", border: "1px solid rgba(59,130,246,0.32)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.38)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.22)"; }}
                >
                  <Send size={13} style={{ color: "#93C5FD" }} />
                </button>
              </div>
              <p className="text-[9px] text-[#252525] text-center mt-2">
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