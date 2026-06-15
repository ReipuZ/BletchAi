import { useState, useEffect } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

export default function App() {
  const [page, setPage] = useState("login");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLogin");
    if (status === "true") {
      setIsLogin(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
    setPage("login");
  };

  if (isLogin) {
    return <Dashboard onLogout={logout} />;
  }

  if (page === "register") {
    return (
      <Register
        onGoLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      onLogin={() => setIsLogin(true)}
      onGoRegister={() => setPage("register")}
    />
  );
}