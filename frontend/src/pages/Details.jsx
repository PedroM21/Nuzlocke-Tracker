import { useState } from "react";
import "../css/Details.css";
import { Link, useLocation } from "react-router-dom";

function Details() {
  const location = useLocation();
  const { runId, generation } = location.state || {};
  const [formData, setFormData] = useState({
    location: "",
    caught: false,
    name: "",
    nickname: "",
    isAlive: true,
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5400/runs/${runId}/details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Run details added successfully!");

        // reset form so they can add more if they wish
        setFormData({
          location: "",
          caught: false,
          name: "",
          nickname: "",
          isAlive: true,
        });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="details-page">
      <h1>Run Details</h1>
      <form className="details-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="caught">Caught</label>
          <input
            type="checkbox"
            name="caught"
            checked={formData.caught}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="name">Pokemon Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="isAlive">Alive</label>
          <input
            type="checkbox"
            name="isAlive"
            checked={formData.isAlive}
            onChange={handleChange}
          />
        </div>
        <div className="details-form-buttons">
          <input className="submit" type="submit" value="Submit" />
          <Link className="link-styling" to="/runs">
            <button className="to-runs-btn ">Runs</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Details;
