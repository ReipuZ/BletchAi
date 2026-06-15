import { useState } from "react";
import { signInWithGoogle } from "../firebase";

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && email === user.email && password === user.password) {
      localStorage.setItem("isLogin", "true");
      onLogin(true);
    } else {
      alert("Login gagal");
    }
  };

  const handleGoogle = async () => {
    const result = await signInWithGoogle();
    const user = result.user;

    localStorage.setItem("isLogin", "true");
    localStorage.setItem("user", JSON.stringify({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL
    }));

    onLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef]">

      <div className="w-[380px] bg-white p-8 rounded-xl shadow-md">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-center mb-1">
          Masuk
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Buka jalan menuju masa depanmu
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-3">

          <input
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email or phone"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-[#0a66c2] text-white p-3 rounded-full font-medium hover:bg-[#004182] transition">
            Masuk
          </button>

        </form>

        {/* FORGOT */}
        <p className="text-sm text-center text-blue-600 mt-4 cursor-pointer">
          Lupa kata sandi akun anda?
        </p>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border p-3 rounded-full hover:bg-gray-50 transition"
        >

          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
          />

          <span className="font-medium text-sm">
            Lanjutkan dengan Google
          </span>

        </button>

        {/* REGISTER */}
        <p
          onClick={() => onGoRegister(true)}
          className="text-sm text-center mt-6 text-gray-600 cursor-pointer"
        >
          Belum memiliki akun? <span className="text-blue-600">Daftar disini!</span>
        </p>

      </div>

    </div>
  );
}