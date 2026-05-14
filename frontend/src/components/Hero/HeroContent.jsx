import "./HeroContent.css";

const HeroContent = ({ onOpenAuth }) => {
  return (
    <div className="hero-content">
      <h1 className="hero-title">
        Manage Your Tasks,
        <span className="gradient-text"> Master Your Projects</span>
      </h1>

      <p className="hero-subtitle">
        Streamline your team's workflow with intelligent task management and
        real-time collaboration. Keep everyone aligned, deadlines met, and
        projects on track.
      </p>

      <button className="hero-cta-button" onClick={onOpenAuth}>
        <span className="button-text">Get Started</span>
        <span className="button-arrow">→</span>
      </button>

      <p className="hero-trust-text">
        Join teams of developers, designers, and managers building remarkable
        products.
      </p>
    </div>
  );
};

export default HeroContent;
