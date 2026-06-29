import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Star } from "lucide-react";

export default function Register({ onGoLogin, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

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
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "10px 14px 10px 36px",
    fontSize: "13px",
    color: "#E2E8F0",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s, background .2s, box-shadow .2s",
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.06)";
    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
  };
  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
  };

  return (
    <div className="w-full max-w-sm mx-auto">

      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 mb-5"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "999px",
          padding: "3px 10px",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
        <span className="text-[10px] font-medium" style={{ color: "#888" }}>
          Sosialisasi &amp; Edukasi Karier
        </span>
      </div>

      {/* Heading */}
      <h2
        className="text-2xl font-bold mb-1"
        style={{
          background: "linear-gradient(to right,#ffffff 0%,#ffffff 35%,#DBEAFE 44%,#93C5FD 50%,#DBEAFE 56%,#ffffff 65%,#ffffff 100%)",
          backgroundSize: "250% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Buat akun baru
      </h2>
      <p className="text-sm mb-6" style={{ color: "#3A3A3A" }}>
        Siapkan dirimu menghadapi dunia kerja
      </p>

      <form onSubmit={handleRegister} className="space-y-3">

        {/* Nama */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#555" }}>Nama Lengkap</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
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
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#555" }}>Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#555" }}>Kata Sandi</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
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
                style={{ color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#555" }}>Konfirmasi</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
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
                style={{ color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
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
          <span className="text-xs leading-relaxed" style={{ color: "#555" }}>
            Saya setuju dengan{" "}
            <span style={{ color: "#3B82F6" }} className="cursor-pointer hover:text-[#93C5FD] transition">
              Syarat Penggunaan
            </span>{" "}dan{" "}
            <span style={{ color: "#3B82F6" }} className="cursor-pointer hover:text-[#93C5FD] transition">
              Kebijakan Privasi
            </span>
          </span>
        </label>

        {/* Tombol */}
        <button
          type="submit"
          className="w-full text-sm font-medium py-2.5 rounded-xl transition"
          style={{
            background: "rgba(20,20,28,0.95)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "#E2E8F0",
            borderRadius: "12px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(40,40,55,0.95)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(20,20,28,0.95)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
          }}
        >
          Daftar Sekarang
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="text-xs" style={{ color: "#2A2A2A" }}>atau</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {[["R", "#0d1b35", "#93C5FD"], ["P", "#0f1238", "#C4B5FD"], ["L", "#160b30", "#A78BFA"]].map(
            ([letter, bg, color]) => (
              <div
                key={letter}
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
                style={{ backgroundColor: bg, borderColor: "rgba(6,6,10,0.97)", color, boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
              >
                {letter}
              </div>
            )
          )}
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: "#CCCCCC" }}>2.500+ Peserta Aktif</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={9} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span className="text-[10px]" style={{ color: "#444" }}>4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-center" style={{ color: "#2E2E2E" }}>
        Sudah punya akun?{" "}
        <span
          onClick={onGoLogin}
          className="font-medium cursor-pointer transition"
          style={{ color: "#3B82F6" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#93C5FD")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#3B82F6")}
        >
          Masuk di sini
        </span>
      </p>
    </div>
  );
}