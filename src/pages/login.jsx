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
  const inputStyle = {
    background:   "var(--bg-surface)",
    border:       "1px solid var(--border-soft)",
    borderRadius: "12px",
    padding:      "10px 14px 10px 36px",
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

      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 mb-5"
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
        className="text-2xl font-bold mb-1"
        style={{
          background:           "var(--gradient-brand)",
          backgroundSize:       "250% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
        }}
      >
        Masuk
      </h2>
      <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>
        Buka jalan menuju masa depanmu
      </p>

      <form onSubmit={handleLogin} className="space-y-4">

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
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
              style={{ ...inputStyle }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Kata Sandi
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
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
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Lupa sandi */}
        <p
          className="text-xs text-right cursor-pointer transition"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-light)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}
        >
          Lupa kata sandi?
        </p>

        {/* Tombol masuk */}
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
          Masuk
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>atau masuk dengan</span>
        <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-60"
        style={{
          background:   "var(--bg-surface)",
          border:       "1px solid var(--border-soft)",
          color:        "var(--text-secondary)",
          borderRadius: "12px",
          cursor:       "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = "var(--bg-surface-md)";
          e.currentTarget.style.color       = "var(--text-primary)";
          e.currentTarget.style.borderColor = "var(--border-md)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = "var(--bg-surface)";
          e.currentTarget.style.color       = "var(--text-secondary)";
          e.currentTarget.style.borderColor = "var(--border-soft)";
        }}
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
        {loading ? "Memproses..." : "Lanjutkan dengan Google"}
      </button>

      {/* Separator */}
      <div className="my-5 h-px" style={{ background: "var(--border-soft)" }} />

      {/* Social proof */}
      <div className="flex items-center gap-3 mb-5">
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

      {/* Daftar link */}
      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        Belum punya akun?{" "}
        <span
          onClick={onGoRegister}
          className="font-medium cursor-pointer transition"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-light)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent)"}
        >
          Daftar di sini
        </span>
      </p>
    </div>
  );
}