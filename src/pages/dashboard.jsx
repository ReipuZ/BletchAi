import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    onLogout(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Dashboard</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-6">

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