import { useNavigate } from "react-router-dom";
import "../css/NewRun.css";
import { useState } from "react";
import NavBar from "../components/NavBar";

function NewRun() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    runName: "",
    generation: "",
    game: "",
    type: "",
    attempt: 1,
  });

  const token = localStorage.getItem("token");

  // Displays success or error messages
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5400/runs/new-run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Created run successfully!");

        // redirect to runs
        navigate("/runs/details", {
          state: { runId: data.runId, generation: data.generation },
        });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setMessage("Failed to connect to the server.");
    }
  };

  const pokemonGames = [
    { gen: 1, name: "Red" },
    { gen: 1, name: "Blue" },
    { gen: 1, name: "Yellow" },
    { gen: 2, name: "Gold" },
    { gen: 2, name: "Silver" },
    { gen: 2, name: "Crystal" },
    { gen: 3, name: "Ruby" },
    { gen: 3, name: "Sapphire" },
    { gen: 3, name: "FireRed" },
    { gen: 3, name: "LeafGreen" },
    { gen: 3, name: "Emerald" },
    { gen: 4, name: "Diamond" },
    { gen: 4, name: "Pearl" },
    { gen: 4, name: "Platinum" },
    { gen: 4, name: "HeartGold" },
    { gen: 4, name: "SoulSilver" },
    { gen: 5, name: "Black" },
    { gen: 5, name: "White" },
    { gen: 5, name: "Black 2" },
    { gen: 5, name: "White 2" },
    { gen: 6, name: "X" },
    { gen: 6, name: "Y" },
    { gen: 6, name: "Omega Ruby" },
    { gen: 6, name: "Alpha Sapphire" },
    { gen: 7, name: "Sun" },
    { gen: 7, name: "Moon" },
    { gen: 7, name: "Ultra Sun" },
    { gen: 7, name: "Ultra Moon" },
    { gen: 8, name: "Sword" },
    { gen: 8, name: "Shield" },
    { gen: 8, name: "Brilliant Diamond" },
    { gen: 8, name: "Shining Pearl" },
    { gen: 9, name: "Scarlet" },
    { gen: 9, name: "Violet" },
  ];

  const filteredGames = pokemonGames.filter(
    (game) => game.gen == formData.generation
  );

  return (
    <div className="new-run-page">
      <h1>New Run</h1>
      <form className="new-run-form" onSubmit={handleSubmit}>
        <div className="run-name-field">
          <label htmlFor="runName">Name</label>
          <input
            type="text"
            name="runName"
            className="run-form-field"
            value={formData.runName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="generation-field">
          <label htmlFor="generation">Generation</label>
          <select
            name="generation"
            className="run-form-field custom-select"
            value={formData.generation}
            onChange={handleChange}
            required
          >
            <option value="">Select a Generation</option>
            <option value="1">Gen 1</option>
            <option value="2">Gen 2</option>
            <option value="3">Gen 3</option>
            <option value="4">Gen 4</option>
            <option value="5">Gen 5</option>
            <option value="6">Gen 6</option>
            <option value="7">Gen 7</option>
            <option value="8">Gen 8</option>
            <option value="9">Gen 9</option>
          </select>
        </div>
        <div className="game-field">
          <label htmlFor="game">Game</label>
          <select
            name="game"
            className="run-form-field custom-select"
            value={formData.game}
            onChange={handleChange}
            required
            disabled={!formData.generation}
          >
            <option value="">Select a Game</option>
            {filteredGames.map((game) => (
              <option key={game.name} value={game.name}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
        <div className="type-field">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            name="type"
            className="run-form-field"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        <div className="attempt-field">
          <label htmlFor="attempt">Attempts</label>
          <input
            type="number"
            name="attempt"
            className="run-form-field"
            value={formData.attempt}
            onChange={(e) =>
              setFormData({
                ...formData,
                attempt: Math.max(1, parseInt(e.target.value) || 1),
              })
            }
            required
          />
        </div>
        <input className="submit" type="submit" value="Create" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default NewRun;
