import { useState } from "react";
import { signInWithGoogle } from "../firebase";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const user = result.user;
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
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

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-zinc-800 mb-1">Masuk</h2>
      <p className="text-sm text-zinc-400 mb-7">
        Buka jalan menuju masa depanmu
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: email@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition placeholder-zinc-400 text-zinc-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Kata Sandi</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition placeholder-zinc-400 text-zinc-800"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#A67C52] cursor-pointer hover:text-[#6D4C41] transition text-right">
          Lupa kata sandi?
        </p>

        <button
          type="submit"
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-xl transition"
        >
          Masuk
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-xs text-zinc-400">atau masuk dengan</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-60"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
        {loading ? "Memproses..." : "Lanjutkan dengan Google"}
      </button>

      <p className="text-xs text-center text-zinc-400 mt-6">
        Belum punya akun?{" "}
        <span
          onClick={onGoRegister}
          className="text-[#A67C52] font-medium cursor-pointer hover:text-[#6D4C41] transition"
        >
          Daftar di sini
        </span>
      </p>
    </div>
  );
}