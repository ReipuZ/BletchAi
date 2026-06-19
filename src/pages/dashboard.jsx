import { useState } from "react";
import SidebarLeft from "../components/sidebarLeft";
import TopBar from "../components/topBar";

import HomeSection from "../sections/homeSection";
import KursusSection from "../sections/kursusSection";
import InterviewSection from "../sections/interviewSection";
import StatsSection from "../sections/statsSection";
import FaqSection from "../sections/faqSection";
import AboutSection from "../sections/aboutSection";

export default function Dashboard({ onLogout, onLogin, localUser, isLogin }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F4]">
      <TopBar
        onLogout={onLogout}
        onLogin={onLogin}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        localUser={localUser}
        isLogin={isLogin}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft collapsed={collapsed} />
        <main className="flex-1 h-[calc(100vh-56px)] overflow-y-auto scroll-smooth">
          <HomeSection />
          <KursusSection />
          <InterviewSection />
          <StatsSection />
          <FaqSection />
          <AboutSection />
        </main>
      </div>
    </div>
  );
}