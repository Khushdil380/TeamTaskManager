import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-content">
            <h2 className="about-title">What is Team Task Manager?</h2>
            <p className="about-text">
              Team Task Manager is a modern, intuitive task management platform
              designed for teams of all sizes. Whether you're a startup, agency,
              or enterprise, our platform helps you organize work, collaborate
              seamlessly, and deliver projects on time.
            </p>
            <p className="about-text">
              We believe that great teamwork comes from clarity, communication,
              and the right tools. Team Task Manager combines powerful features
              with a clean, user-friendly interface to help your team focus on
              what matters most.
            </p>

            <div className="about-stats">
              <div className="stat">
                <div className="stat-value">10K+</div>
                <div className="stat-name">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-value">500+</div>
                <div className="stat-name">Teams</div>
              </div>
              <div className="stat">
                <div className="stat-value">99.9%</div>
                <div className="stat-name">Uptime</div>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="visual-box">
              <div className="visual-content">
                <div className="visual-item item-1">Organize</div>
                <div className="visual-item item-2">Collaborate</div>
                <div className="visual-item item-3">Deliver</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
