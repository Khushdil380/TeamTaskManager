import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} Team Task Manager. Built with passion for teams
            everywhere.
          </p>
          <p className="footer-credit">
            Created by <span className="credit-highlight">Khushdil Ansari</span>{" "}
            for{" "}
            <span className="credit-highlight">
              Software Engineer Recruitment Process
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
