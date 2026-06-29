import Navbar from "../components/navbar";
import HomeSection from "../sections/homeSection";
import KursusSection from "../sections/kursusSection";
import InterviewSection from "../sections/interviewSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";
import ThemeToggle from "../components/Themetoggle";

export default function Dashboard({ onLogout, onLogin, localUser, isLogin }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base, #000000)" }}>
      <Navbar
        onLogout={onLogout}
        onLogin={onLogin}
        localUser={localUser}
        isLogin={isLogin}
      />

      <main className="pt-[56px] md:pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <HomeSection />
        <KursusSection />
        <InterviewSection />
        <FaqSection />
        <AboutSection />
      </main>

      {/* Floating dark/light toggle */}
      <ThemeToggle />
    </div>
  );
}