import { useState } from "react";

export default function Register({ onGoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({ email, password })
    );

    alert("Akun berhasil dibuat!");
    onGoLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef]">

      <div className="w-[380px] bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-2xl font-semibold text-center mb-1">
          Daftar
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Mulai gunakan BletchAI untuk membangun masa depanmu
        </p>

        <form onSubmit={handleRegister} className="space-y-3">

          <input
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kata sandi (minimal 6 karakter)"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-[#0a66c2] text-white p-3 rounded-full font-medium hover:bg-[#004182] transition">
            Buat Akun
          </button>

        </form>

        <p
          onClick={() => onGoLogin(false)}
          className="text-sm text-center mt-6 text-gray-600 cursor-pointer"
        >
          Sudah punya akun? <span className="text-blue-600">Masuk</span>
        </p>

      </div>

    </div>
  );
}