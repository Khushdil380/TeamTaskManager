import "./Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Team Task Manager transformed how we manage projects. Our productivity increased by 40% in just one month!",
      author: "Sarah Johnson",
      role: "Project Manager",
      avatar: "SJ",
    },
    {
      quote:
        "The best task management tool I've used. Simple, powerful, and exactly what our team needed.",
      author: "Alex Chen",
      role: "Tech Lead",
      avatar: "AC",
    },
    {
      quote:
        "Excellent collaboration features. Our remote team feels more connected than ever.",
      author: "Maya Patel",
      role: "Product Designer",
      avatar: "MP",
    },
  ];

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <div className="section-header">
          <h2 className="section-title">What Teams Say</h2>
          <p className="section-subtitle">
            Trusted by teams and organizations worldwide
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-quote">"{testimonial.quote}"</div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.author}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
