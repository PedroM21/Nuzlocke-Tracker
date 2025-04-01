import "../css/Signup.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      const response = await fetch("http://localhost:5400/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully!");

        // Redirect to runs
        window.location.href = "/log-in";
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="sign-up-page">
      <h1>Sign Up</h1>
      <form className="sign-up-form" onSubmit={handleSubmit}>
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
        <div className="email-field">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            className="form-field"
            value={formData.email}
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
        <input className="submit" type="submit" value="Sign up" />
        <span className="span">
          Already have an account? <Link to="/log-in">Login</Link>
        </span>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
