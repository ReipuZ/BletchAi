import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaQuestionCircle,
  FaGraduationCap,
} from "react-icons/fa";

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    onLogout(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-[#252424] border-r p-4">
       <h1 className="text-xl font-bold mb-6 font-">BLETCHAI</h1>
        <ul className="space-y-3 text-gray-700">

          <li className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            Dashboard
          </li>

          <li className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            Pembelajaran
          </li>

          <li className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            Chatbot
          </li>

          <li className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            Interview
          </li>

        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">

        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">

          <img
            src={user?.photo}
            className="w-14 h-14 rounded-full"
          />

          <div>
            <h2 className="text-xl font-semibold">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>

        </div>

      </div>

      {/* RIGHT SIDEBAR (SMALL) */}
      <aside className="w-20 bg-white border-l flex flex-col items-center py-6 gap-6">

        {/* PROFILE */}
        <div className="relative">

          <FaUserCircle
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-3xl text-gray-600 cursor-pointer"
          />

          {profileOpen && (
            <div className="absolute right-10 top-0 bg-white border shadow rounded-lg w-32">

              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                Ganti Akun
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600"
              >
                Logout
              </button>

            </div>
          )}

        </div>

        {/* HELP ICON (FAQ) */}
        <FaQuestionCircle
          className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500"
          title="FAQ"
        />

        {/* GRADUATION ICON */}
        <FaGraduationCap
          className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500"
          title="Learning"
        />

      </aside>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[300px] text-center">

            <h2 className="font-semibold mb-2">
              Yakin ingin keluar akun?
            </h2>

            <div className="flex gap-3 justify-center mt-4">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}