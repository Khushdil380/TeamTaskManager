import { useEffect, useRef } from "react";
import "./Hero.css";
import HeroContent from "./HeroContent";
import DashboardMockup from "./DashboardMockup";

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-content-wrapper">
        <HeroContent />
      </div>
      <div className="hero-mockup-wrapper">
        <DashboardMockup />
      </div>
    </section>
  );
};

export default Hero;
