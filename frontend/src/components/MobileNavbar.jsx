import "../css/MobileNavbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function MobileNavbar() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };
  return (
    <nav>
      <div className={`off-screen-menu ${menuActive ? "active" : ""}`}>
        <ul>
          <Link to="/runs" style={{ textDecoration: "none", color: "#050609" }}>
            <li>Runs</li>
          </Link>
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "#050609" }}
          >
            <li>Dashboard</li>
          </Link>
          <Link to="/" style={{ textDecoration: "none", color: "#050609" }}>
            <li>Statistics</li>
          </Link>
        </ul>
      </div>
      <div
        className={`hamburger ${menuActive ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default MobileNavbar;
