// src/pages/Dashboard.jsx
import Navbar from "../components/Navbar";
import HomeSection from "../sections/homeSection";
import KursusSection from "../sections/kursusSection";
import InterviewSection from "../sections/interviewSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";
import FloatingMascot from "../components/floatingMascot.jsx";

export default function Dashboard({ onLogout, onLogin, localUser, isLogin }) {
  return (
    /* ✦ Background utama — hitam solid */
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <Navbar
        onLogout={onLogout}
        onLogin={onLogin}
        localUser={localUser}
        isLogin={isLogin}
      />

      <main className="pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <HomeSection />
        <KursusSection />
        <InterviewSection />
        <FaqSection />
        <AboutSection />
      </main>

      
    </div>
  );
}