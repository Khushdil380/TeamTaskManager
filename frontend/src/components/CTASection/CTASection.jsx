import "./CTASection.css";

const CTASection = ({ onOpenAuth }) => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Transform Your Team?</h2>
        <p className="cta-subtitle">
          Join hundreds of teams already managing tasks smarter with Team Task
          Manager.
        </p>
        <button className="cta-button" onClick={onOpenAuth}>
          Start Your Free Trial Today
        </button>
      </div>
    </section>
  );
};

export default CTASection;
