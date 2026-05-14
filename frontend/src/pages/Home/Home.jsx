import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import BackgroundAnimation from "../../components/BackgroundAnimation/BackgroundAnimation";
import Hero from "../../components/Hero/Hero";
import AboutSection from "../../components/AboutSection/AboutSection";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import CTASection from "../../components/CTASection/CTASection";
import Footer from "../../components/Footer/Footer";
import AuthModal from "../../components/Auth/AuthModal";
import { isAuthenticated } from "../../utils/auth";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Already logged in? Redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleOpenAuthModal = () => setIsAuthModalOpen(true);
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <BackgroundAnimation />
      <Navbar />
      <Hero onOpenAuth={handleOpenAuthModal} />
      <AboutSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection onOpenAuth={handleOpenAuthModal} />
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Home;
