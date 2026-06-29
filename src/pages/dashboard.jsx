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

      {/* pt-20 diganti: mobile pakai pt-0 (navbar sudah punya spacer sendiri), desktop tetap pt-20 */}
      <main className="pt-0 md:pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <HomeSection />
        <KursusSection />
        <InterviewSection />
        <FaqSection />
        <AboutSection />
      </main>
    </div>
  );
}