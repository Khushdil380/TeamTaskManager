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

          {/* Social / Profile Links */}
          <div className="footer-links">
            {/* GitHub */}
            <a
              href="https://github.com/Khushdil380"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon-link"
              aria-label="GitHub profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.31 9.42 7.9 10.95.58.1.79-.25.79-.56v-2.03c-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.2 21.41 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* Portfolio */}
            <a
              href="https://khushdil-ansari-portfolio-frontend.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon-link"
              aria-label="Portfolio profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
              </svg>
              <span>Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
