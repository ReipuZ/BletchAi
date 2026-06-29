import Navbar from "../components/navbar";
import HomeSection from "../sections/homeSection";
import KursusSection from "../sections/kursusSection";
import InterviewSection from "../sections/interviewSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";
import FloatingMascot from "../components/floatingMascot.jsx";

export default function Dashboard({ onLogout, onLogin, localUser, isLogin }) {
  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <Navbar
        onLogout={onLogout}
        onLogin={onLogin}
        localUser={localUser}
        isLogin={isLogin}
      />

      {/* 
        Mobile: pt-[56px] = tepat setinggi navbar mobile (48px navbar + 8px marginTop)
        Desktop: pt-20 = sama seperti sebelumnya
      */}
      <main className="pt-[56px] md:pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <HomeSection />
        <KursusSection />
        <InterviewSection />
        <FaqSection />
        <AboutSection />
      </main>
    </div>
  );
}