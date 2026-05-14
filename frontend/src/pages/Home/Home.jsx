import Navbar from "../../components/Navbar/Navbar";
import BackgroundAnimation from "../../components/BackgroundAnimation/BackgroundAnimation";
import Hero from "../../components/Hero/Hero";
import AboutSection from "../../components/AboutSection/AboutSection";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import CTASection from "../../components/CTASection/CTASection";
import Footer from "../../components/Footer/Footer";

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
