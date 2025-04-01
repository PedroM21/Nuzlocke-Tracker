import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Displays success or error messages
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5400/auth/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to local storage
        localStorage.setItem("token", data.token);
        setMessage("Logged in successfully!");

        // redirect to runs
        window.location.href = "/runs";
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="log-in-page">
      <h1>Log In</h1>
      <form className="log-in-form" onSubmit={handleSubmit}>
        <div className="username-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            className="form-field"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="password-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="form-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <span className="span">
          <a href="#">Forgot password?</a>
        </span>
        <input className="submit" type="submit" value="Log in" />
        <span className="span">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </span>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
