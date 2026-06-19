import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

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

    if (onSuccess) {
      onSuccess();
    } else {
      onGoLogin();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-zinc-800 mb-1">Buat akun baru</h2>
      <p className="text-sm text-zinc-400 mb-7">Siapkan dirimu menghadapi dunia kerja</p>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition placeholder-zinc-400 text-zinc-800"
            />
          </div>
        </div>

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

        {/* Password */}
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
              minLength={8}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition placeholder-zinc-400 text-zinc-800"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Konfirmasi Kata Sandi</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi kata sandi"
              required
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:border-[#A67C52]/60 focus:bg-white transition placeholder-zinc-400 text-zinc-800"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Agree */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 accent-[#A67C52]"
          />
          <span className="text-xs text-zinc-500 leading-relaxed">
            Saya setuju dengan{" "}
            <span className="text-[#A67C52] cursor-pointer">Syarat Penggunaan</span>
            {" "}dan{" "}
            <span className="text-[#A67C52] cursor-pointer">Kebijakan Privasi</span>
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-xl transition"
        >
          Daftar Sekarang
        </button>
      </form>

      {/* ✅ Link masuk di bawah form */}
      <p className="text-xs text-center text-zinc-400 mt-6">
        Sudah punya akun?{" "}
        <span
          onClick={onGoLogin}
          className="text-[#A67C52] font-medium cursor-pointer hover:text-[#6D4C41] transition"
        >
          Masuk di sini
        </span>
      </p>
    </div>
  );
}