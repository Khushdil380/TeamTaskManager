import "./HowItWorks.css";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Projects",
      description: "Set up your projects and define team members with specific roles.",
    },
    {
      number: "02",
      title: "Add Tasks",
      description: "Break down projects into actionable tasks with deadlines.",
    },
    {
      number: "03",
      title: "Collaborate",
      description: "Team members update progress and communicate in real-time.",
    },
    {
      number: "04",
      title: "Track & Analyze",
      description: "Monitor progress with analytics and identify bottlenecks.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Four simple steps to streamline your workflow
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
