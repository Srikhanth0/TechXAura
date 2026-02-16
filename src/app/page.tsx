import React from "react";
import Link from "next/link";
import PillNav from "@/components/ui/pill-nav";
import { LandingCard } from "@/components/ui/landing-card";
import { Calendar, Mail, MapPin, Phone, Trophy, User } from "lucide-react";
import { eventsData } from "@/data/events";
import { HomeWrapper } from "@/components/home/HomeWrapper";
import { HeroSection } from "@/components/home/HeroSection";
import BackgroundVideo from "@/components/home/BackgroundVideo";

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

      {/* Contact */}
      <section id="contact" className="px-4 sm:px-6 pb-4 w-full pt-12">
        <div className="max-w-6xl mx-auto rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-center font-audiowide text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 tracking-[0.1em] mb-4">
            ABOUT US
          </h2>
          <p className="text-center text-white/70 max-w-3xl mx-auto mb-8">
            Sriram Engineering College is dedicated to fostering innovation, technical excellence, and a vibrant
            student community. TECHXAURA 2K26 brings together talent from across the region to compete, learn, and celebrate
            creativity in technology and beyond.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Address Column */}
            <a
              href="https://maps.app.goo.gl/W1XBfMWKg4xkxNp99?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-black/40 p-4 flex items-start gap-3 h-full hover:bg-white/5 hover:border-white/20 transition-all group cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-purple-400 mt-0.5 group-hover:text-purple-300 transition-colors" />
              <div>
                <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">Address</div>
                <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                  Sriram Engineering College<br />
                  Kottamedu Rd, Veppampattu,<br />
                  Perumalpattu, Tiruvallur - 602024
                </div>
              </div>
            </a>

            {/* Contact Info Column */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-2 flex items-start gap-2 flex-1">
                <Mail className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="text-white/80 text-sm font-medium">Email</div>
                  <a href="mailto:1126srec2k25@gmail.com" className="text-white/60 text-sm hover:text-white transition-colors">1126srec2k25@gmail.com</a>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-2 flex items-start gap-3 flex-1">
                <Phone className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-white/80 text-sm font-medium">Phone</div>
                  <div className="text-white/60 text-sm">
                    +91 72000 12857<br />
                    +91 86102 83706<br />
                    +91 73736 28589
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
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
