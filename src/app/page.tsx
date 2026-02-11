import React from "react";
import Link from "next/link";
import PillNav from "@/components/ui/pill-nav";
import { LandingCard } from "@/components/ui/landing-card";
import { Calendar, Trophy, User } from "lucide-react";
import { eventsData } from "@/data/events";
import { HomeWrapper } from "@/components/home/HomeWrapper";
import { HeroSection } from "@/components/home/HeroSection";
import BackgroundVideo from "@/components/home/BackgroundVideo";
import { Footer } from "@/components/ui/footer-section";

const getEventIcon = (category: string) => {
  switch (category) {
    case "Technical":
      return <Trophy className="w-10 h-10 text-white mb-4" />;
    case "Non-Technical":
      return <User className="w-10 h-10 text-white mb-4" />;
    case "Breakout":
      return <Calendar className="w-10 h-10 text-white mb-4" />;
    default:
      return <Trophy className="w-10 h-10 text-white mb-4" />;
  }
};

export default function MasterPage() {
  const eventCards = eventsData.map((event) => (
    <Link href={`/dashboard?event=${event.id}`} key={event.id} className="block h-full group">
      <LandingCard
        category={event.category}
        image={event.image}
        icon={getEventIcon(event.category)}
        title={event.name}
        description={event.description}
        timing={event.timing}
        teamSize={
          event.id === "mindsparkx" ? "Solo Participation" :
            event.id === "designomania" ? "Solo Participation" :
              event.id === "businessbattle" ? "2-3 Members Team" :
                event.id === "fixtheglitch" ? "Solo Participation" :
                  event.id === "paperpresentation" ? "3-4 Members Team" :
                    event.id === "startmusic" ? "2 Members Team" :
                      event.id === "carrom" ? "2 Members Per Team" :
                        `${event.teamSizeMin}-${event.teamSizeMax} Members`
        }
      />
    </Link>
  ));

  return (
    <HomeWrapper>
      <BackgroundVideo />
      {/* Hero */}
      <HeroSection />

      {/* Events */}
      <section id="events" className="relative px-4 sm:px-6 pt-0 pb-0 overflow-hidden w-full max-w-7xl mx-auto" style={{ contentVisibility: "auto", contain: "paint" }}>
        {/* Welcome Text */}
        <p className="text-center font-audiowide text-sm sm:text-base md:text-lg tracking-[0.2em] text-purple-200/80 mb-0 relative z-20 -mt-16">
          SRIRAM ENGINEERING COLLEGE WELCOMES YOU!!
        </p>

        <div className="relative z-10 mx-auto mt-52">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 font-audiowide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-white tracking-wider">
            ALL EVENTS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {eventCards}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <Footer />
      <PillNav
        className="top-4 md:top-8 bg-white/10 border-white/30 shadow-[0_0_35px_rgba(255,255,255,0.35)] shadow-[0_0_55px_rgba(168,85,247,0.55)]"
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "#events" },
          { label: "Organizers", href: "/auth/admin-login" },
        ]}
        activeHref="/"
      />
    </HomeWrapper>
  );
}
