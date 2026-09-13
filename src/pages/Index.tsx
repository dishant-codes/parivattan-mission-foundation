import React, { useEffect } from "react";
import Header from "../components/Header";
import WelcomeModal from "../components/WelcomeModal";

import Hero from "../components/Hero";
import Mission from "../components/Mission";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Donate from "../components/Donate";
import Testimonials from "../components/Testimonials";
import Volunteer from "../components/Volunteer";
import Footer from "../components/Footer";
import { logVisitor } from "@/lib/supabase-admin";

const Index = () => {
  useEffect(() => {
    // Log a visitor once per session
    const sessionKey = "parivattan_visitor_session";
    const existingSession = sessionStorage.getItem(sessionKey);
    const sessionId = existingSession || crypto.randomUUID();

    if (!existingSession) {
      sessionStorage.setItem(sessionKey, sessionId);
      logVisitor({
        session_id: sessionId,
        path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      }).catch((err) => console.error("Failed to log visitor", err));
    }

    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* <WelcomeModal /> */}
      <Header />
      <Hero />
      <Mission />
      <Donate />
      {/* <Services /> */}
      {/* <Testimonials /> */}
      {/* <Volunteer /> */}
      <Contact/>
      <Footer />
    </div>
  );
};

export default Index;
