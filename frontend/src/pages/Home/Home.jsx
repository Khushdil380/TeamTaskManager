import Navbar from "../Navbar/Navbar";
import BackgroundAnimation from "../BackgroundAnimation/BackgroundAnimation";
import Hero from "../Hero/Hero";
import AboutSection from "../AboutSection/AboutSection";
import Features from "../Features/Features";
import HowItWorks from "../HowItWorks/HowItWorks";
import Testimonials from "../Testimonials/Testimonials";
import CTASection from "../CTASection/CTASection";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <>
      <BackgroundAnimation />
      <Navbar />
      <Hero />
      <AboutSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
