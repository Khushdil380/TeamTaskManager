import "./Navbar.css";
import logo from "../../assets/logo.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand Name */}
        <div className="navbar-logo">
          <img src={logo} alt="Team Task Manager" className="navbar-logo-img" />
          <span className="navbar-brand">Team Task Manager</span>
        </div>

        {/* Right Side Navigation */}
        <div className="navbar-right">
          <a href="#help" className="navbar-link">
            Help
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
