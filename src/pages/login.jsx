import { useState } from "react";
import { signInWithGoogle } from "../firebase";
import { Eye, EyeOff, Mail, Lock, Star } from "lucide-react";

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && email === user.email && password === user.password) {
      localStorage.setItem("isLogin", "true");
      if (onLogin) onLogin();
    } else {
      alert("Email atau kata sandi salah");
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user   = result.user;
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("user", JSON.stringify({
        name:  user.displayName,
        email: user.email,
        photo: user.photoURL,
      }));
      if (onLogin) onLogin();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input style ── */
  const inputClass = [
    "w-full text-sm border rounded-xl bg-transparent",
    "focus:outline-none transition placeholder-[#333]",
    "text-[#E2E8F0]",
  ].join(" ");

  const inputStyle = {
    background:    "rgba(255,255,255,0.04)",
    border:        "1px solid rgba(255,255,255,0.08)",
    borderRadius:  "12px",
    padding:       "10px 14px 10px 36px",
    fontSize:      "13px",
    color:         "#E2E8F0",
    outline:       "none",
    width:         "100%",
    boxSizing:     "border-box",
    transition:    "border-color .2s, background .2s, box-shadow .2s",
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor  = "rgba(59,130,246,0.40)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(59,130,246,0.06)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.06)";
  };
  const handleBlur = (e) => {
    e.currentTarget.style.borderColor  = "rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow   = "none";
    e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
  };

  return (
    <div className="w-full max-w-sm mx-auto">

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 mb-5"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "999px", padding: "3px 10px" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
        <span className="text-[10px] font-medium" style={{ color: "#888" }}>Sosialisasi &amp; Edukasi Karier</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-1"
        style={{
          background:             "linear-gradient(to right,#ffffff 0%,#ffffff 35%,#DBEAFE 44%,#93C5FD 50%,#DBEAFE 56%,#ffffff 65%,#ffffff 100%)",
          backgroundSize:         "250% 100%",
          WebkitBackgroundClip:   "text",
          WebkitTextFillColor:    "transparent",
        }}>
        Masuk
      </h2>
      <p className="text-sm mb-7" style={{ color: "#3A3A3A" }}>Buka jalan menuju masa depanmu</p>

      <form onSubmit={handleLogin} className="space-y-4">

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
              style={{ ...inputStyle }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#555" }}>Kata Sandi</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#333" }} />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              style={{ ...inputStyle, paddingRight: "40px" }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition"
              style={{ color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Lupa sandi */}
        <p className="text-xs text-right cursor-pointer transition"
          style={{ color: "#3B82F6" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#93C5FD"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#3B82F6"}>
          Lupa kata sandi?
        </p>

        {/* Tombol masuk */}
        <button
          type="submit"
          className="w-full text-sm font-medium py-2.5 rounded-xl transition"
          style={{
            background:   "rgba(20,20,28,0.95)",
            border:       "1px solid rgba(255,255,255,0.10)",
            color:        "#E2E8F0",
            borderRadius: "12px",
            cursor:       "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background    = "rgba(40,40,55,0.95)";
            e.currentTarget.style.borderColor   = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background    = "rgba(20,20,28,0.95)";
            e.currentTarget.style.borderColor   = "rgba(255,255,255,0.10)";
          }}
        >
          Masuk
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="text-xs" style={{ color: "#2A2A2A" }}>atau masuk dengan</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        style={{
          background:   "rgba(255,255,255,0.04)",
          border:       "1px solid rgba(255,255,255,0.09)",
          color:        "#777",
          borderRadius: "12px",
          cursor:       "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color       = "#CCCCCC";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color       = "#777";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
        }}
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
        {loading ? "Memproses..." : "Lanjutkan dengan Google"}
      </button>

      {/* Separator */}
      <div className="my-5 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

      {/* Social proof */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex -space-x-2">
          {[["R", "#0d1b35", "#93C5FD"], ["P", "#0f1238", "#C4B5FD"], ["L", "#160b30", "#A78BFA"]].map(([letter, bg, color]) => (
            <div
              key={letter}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
              style={{ backgroundColor: bg, borderColor: "rgba(6,6,10,0.97)", color, boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: "#CCCCCC" }}>2.500+ Peserta Aktif</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={9} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span className="text-[10px]" style={{ color: "#444" }}>4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Daftar link */}
      <p className="text-xs text-center" style={{ color: "#2E2E2E" }}>
        Belum punya akun?{" "}
        <span
          onClick={onGoRegister}
          className="font-medium cursor-pointer transition"
          style={{ color: "#3B82F6" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#93C5FD"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#3B82F6"}
        >
          Daftar di sini
        </span>
      </p>
    </div>
  );
}