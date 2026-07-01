import { useRef, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import HomeSection from "../sections/homeSection";
import KursusSection from "../sections/kursusSection";
import InterviewSection from "../sections/interviewSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";
import FloatingMascot from "../components/floatingMascot";

export default function Dashboard({ onLogout, onLogin, localUser, isLogin }) {
  const interviewRef = useRef(null);
  const [isInterviewVisible, setIsInterviewVisible] = useState(false);

  // FIXED: ref ini SEBELUMNYA TIDAK PERNAH DIBUAT sama sekali di Dashboard,
  // padahal Navbar dan InterviewSection sama-sama butuh openStatsRef supaya
  // bisa "ngobrol" satu sama lain (Navbar manggil openStatsRef.current(),
  // InterviewSection yang mendaftarkan fungsinya ke openStatsRef.current).
  // Karena Navbar dipanggil TANPA prop openStatsRef, openStatsRef di dalam
  // Navbar selalu undefined -> openStatsRef?.current() tidak pernah jalan.
  // Ini akar masalah kenapa tombol "Lihat Statistik" tidak pernah membuka apa-apa.
  const openStatsRef = useRef(null);

  const handleGoToInterview = () => {
    interviewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Maskot otomatis hilang (animasi genie) saat InterviewSection terlihat
  // di viewport, dan muncul lagi begitu user keluar dari section tsb.
  useEffect(() => {
    const el = interviewRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInterviewVisible(entry.isIntersecting);
      },
      { threshold: 0.25 } // dianggap "masuk" interview saat 25% section terlihat
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base, #000000)" }}>
      <Navbar
        onLogout={onLogout}
        onLogin={onLogin}
        localUser={localUser}
        isLogin={isLogin}
        openStatsRef={openStatsRef}
      />

      <main className="pt-[56px] md:pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <HomeSection />
        <KursusSection />
        <div ref={interviewRef}>
          <InterviewSection openStatsRef={openStatsRef} />
        </div>
        <FaqSection />
        <AboutSection />
      </main>

      <FloatingMascot
        onGoToInterview={handleGoToInterview}
        position="bottom-right"
        hidden={isInterviewVisible}
      />
    </div>
  );
}