import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: "📋",
      title: "Smart Task Management",
      description: "Organize, prioritize, and track tasks with intelligent categorization.",
    },
    {
      icon: "🤝",
      title: "Real-Time Collaboration",
      description: "Work together seamlessly with instant updates and live notifications.",
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Track productivity with detailed analytics and performance metrics.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Get notified instantly about important updates and deadlines.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with optimized workflows.",
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level security to keep your data safe and protected.",
    },
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to manage projects like a pro
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
