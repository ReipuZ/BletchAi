import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthModal from "./components/AuthModal";
import Dashboard from "./pages/dashboard";
import HistoryPage from "./pages/historyPage";
import KursusPreviewPage from "./sections/kursus/kursusPreviewPage";
import KursusPaymentPage from "./sections/kursus/kursusPaymentPage";
import RplPage from "./sections/kursus/rplPage";
import OtomotifPage from "./sections/kursus/otomotifPage";
import DesainPage from "./sections/kursus/desainPage";
import AkuntansiPage from "./sections/kursus/akuntansiPage";
import TataBogaPage from "./sections/kursus/tataBogaPage";
import MultimediaPage from "./sections/kursus/multimediaPage";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const status = localStorage.getItem("isLogin") === "true";
    setIsLogin(status);

    if (status) {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setLocalUser(u);
    }
  }, []);

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isLogin", "true");
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setLocalUser(u);
    setIsLogin(true);
    setAuthOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("user");
    setLocalUser(null);
    setIsLogin(false);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              onLogout={logout}
              onLogin={handleOpenAuth}
              localUser={isLogin ? localUser : null}
              isLogin={isLogin}
            />
          }
        />
        <Route path="/history/:sessionId?" element={<HistoryPage />} />
        <Route path="/kursus/:id" element={<KursusPreviewPage />} />
        <Route path="/kursus/:id/payment" element={<KursusPaymentPage />} />

        {/* Roadmap belajar per jurusan — id-nya harus sama dengan `id` di components/jurusan.js */}
        <Route path="/jurusan/rpl" element={<RplPage />} />
        <Route path="/jurusan/otomotif" element={<OtomotifPage />} />
        <Route path="/jurusan/desain" element={<DesainPage />} />
        <Route path="/jurusan/akuntansi" element={<AkuntansiPage />} />
        <Route path="/jurusan/tataboga" element={<TataBogaPage />} />
        <Route path="/jurusan/multimedia" element={<MultimediaPage />} />
      </Routes>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onSuccess={handleLoginSuccess}
      />

      <LoadingScreen />
    </>
  );
}