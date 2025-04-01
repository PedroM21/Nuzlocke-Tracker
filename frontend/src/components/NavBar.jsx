import { Link } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "/log-in"; // Redirect to login page
  };

  return (
    <div className="navbar">
      <div className="log-out" onClick={handleLogout}>
        <span>Log out</span>
      </div>
      <div className="runs-link">
        <Link className="link-style" to="/runs">
          <span>Runs</span>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
