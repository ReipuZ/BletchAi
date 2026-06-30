import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Star } from "lucide-react";

export default function Register({ onGoLogin, onSuccess }) {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [name, setName]           = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree]         = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Kata sandi tidak cocok");
      return;
    }
    if (!agree) {
      alert("Setujui syarat dan ketentuan terlebih dahulu");
      return;
    }
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    localStorage.setItem("isLogin", "true");
    if (onSuccess) onSuccess();
    else onGoLogin();
  };

  const inputStyle = {
    background:   "var(--bg-surface)",
    border:       "1px solid var(--border-soft)",
    borderRadius: "12px",
    padding:      "9px 14px 9px 36px",
    fontSize:     "13px",
    color:        "var(--text-primary)",
    outline:      "none",
    width:        "100%",
    boxSizing:    "border-box",
    transition:   "border-color .2s, background .2s, box-shadow .2s",
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = "var(--accent-border)";
    e.currentTarget.style.boxShadow  = "0 0 0 3px var(--accent-bg)";
    e.currentTarget.style.background = "var(--bg-surface-md)";
  };
  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = "var(--border-soft)";
    e.currentTarget.style.boxShadow  = "none";
    e.currentTarget.style.background = "var(--bg-surface)";
  };

  return (
    <div className="w-full max-w-sm mx-auto">

      {/* Badge — disembunyikan di mobile */}
      <div
        className="hidden sm:inline-flex items-center gap-1.5 mb-5"
        style={{
          background:   "var(--bg-surface)",
          border:       "1px solid var(--border-md)",
          borderRadius: "999px",
          padding:      "3px 10px",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
        <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
          Sosialisasi &amp; Edukasi Karier
        </span>
      </div>

      {/* Heading */}
      <h2
        className="text-xl sm:text-2xl font-bold mb-1"
        style={{
          background:           "var(--gradient-brand)",
          backgroundSize:       "250% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
        }}
      >
        Buat akun baru
      </h2>
      <p className="text-xs sm:text-sm mb-3 sm:mb-6" style={{ color: "var(--text-muted)" }}>
        Siapkan dirimu menghadapi dunia kerja
      </p>

      <form onSubmit={handleRegister} className="space-y-2 sm:space-y-3">

        {/* Nama */}
        <div>
          <label className="block text-xs font-medium mb-1 sm:mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Nama Lengkap
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1 sm:mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Email
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: email@example.com"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Password row — 2 kolom sejajar */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 sm:mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 karakter"
                required
                minLength={8}
                style={{ ...inputStyle, paddingRight: "36px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 sm:mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Konfirmasi
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi sandi"
                required
                style={{ ...inputStyle, paddingRight: "36px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 accent-[#3B82F6]"
          />
          <span className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Saya setuju dengan{" "}
            <span
              className="cursor-pointer transition"
              style={{ color: "var(--accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-light)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}
            >
              Syarat Penggunaan
            </span>{" "}dan{" "}
            <span
              className="cursor-pointer transition"
              style={{ color: "var(--accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-light)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}
            >
              Kebijakan Privasi
            </span>
          </span>
        </label>

        {/* Tombol */}
        <button
          type="submit"
          className="w-full text-sm font-medium py-2.5 rounded-xl transition"
          style={{
            background:   "var(--bg-surface-md)",
            border:       "1px solid var(--border-md)",
            color:        "var(--text-primary)",
            borderRadius: "12px",
            cursor:       "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = "var(--accent-bg)";
            e.currentTarget.style.borderColor = "var(--accent-border)";
            e.currentTarget.style.color       = "var(--accent-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = "var(--bg-surface-md)";
            e.currentTarget.style.borderColor = "var(--border-md)";
            e.currentTarget.style.color       = "var(--text-primary)";
          }}
        >
          Daftar Sekarang
        </button>
      </form>

      {/* Divider — disembunyikan di mobile */}
      <div className="hidden sm:flex items-center gap-3 my-4">
        <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>atau</span>
        <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
      </div>

      {/* Social proof — disembunyikan di mobile */}
      <div className="hidden sm:flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {[
            ["R", "var(--avatar-bg-1)", "var(--accent-light)"],
            ["P", "var(--avatar-bg-2)", "#C4B5FD"],
            ["L", "var(--avatar-bg-3)", "#A78BFA"],
          ].map(([letter, bg, color]) => (
            <div
              key={letter}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
              style={{
                backgroundColor: bg,
                borderColor:     "var(--avatar-border)",
                color,
                boxShadow:       "0 0 0 1px var(--border-soft)",
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            2.500+ Peserta Aktif
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={9} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-center mt-3 sm:mt-0" style={{ color: "var(--text-muted)" }}>
        Sudah punya akun?{" "}
        <span
          onClick={onGoLogin}
          className="font-medium cursor-pointer transition"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-light)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}
        >
          Masuk di sini
        </span>
      </p>
    </div>
  );
}