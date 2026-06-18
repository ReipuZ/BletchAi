import SidebarLeft from "../components/sidebarLeft";
import SidebarRight from "../components/sidebarRight";

import HomeSection from "../sections/homeSection";
import InterviewSection from "../sections/interviewSection";
import StatsSection from "../sections/statsSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      {/* Sidebar Kiri */}
      <SidebarLeft />

      {/* Main Content */}
      <main
        className="
          flex-1
          h-screen
          overflow-y-auto
          scroll-smooth
        "
      >
        <HomeSection />

        <InterviewSection />

        <StatsSection />

        <FaqSection />

        <AboutSection />
      </main>

      {/* Sidebar Kanan */}
      <SidebarRight />
    </div>
  );
}