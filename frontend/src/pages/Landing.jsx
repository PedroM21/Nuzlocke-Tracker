import "../css/Landing.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <h1>Pokemon Nuzlocke Tracker</h1>
      <p>Click the button below to get started.</p>
      <div className="account-buttons">
        <Link to="/log-in">
          <button className="auth-buttons">Login</button>
        </Link>
        <Link to="/sign-up">
          <button className="auth-buttons">Signup</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
