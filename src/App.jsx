import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthModal from "./components/AuthModal";
import Dashboard from "./pages/dashboard";
import HistoryPage from "./pages/historyPage";
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