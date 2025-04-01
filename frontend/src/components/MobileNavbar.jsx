import "../css/MobileNavbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function MobileNavbar() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "/log-in"; // Redirect to login page
  };

  return (
    <nav>
      <div className={`off-screen-menu ${menuActive ? "active" : ""}`}>
        <ul>
          <Link to="/runs" style={{ textDecoration: "none", color: "#050609" }}>
            <li>Runs</li>
          </Link>
          <li onClick={handleLogout}>Log out</li>
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
