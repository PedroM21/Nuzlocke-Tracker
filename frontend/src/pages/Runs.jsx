import { Link } from "react-router-dom";
import MobileNavbar from "../components/MobileNavbar";
import Sidebar from "../components/NavBar";
import "../css/Runs.css";
import { useEffect, useState } from "react";

function Runs() {
  const [runs, setRuns] = useState({});
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await fetch("http://localhost:5400/runs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch runs");
        }

        const runData = await response.json();

        // Sort runs to place active one at the top of list
        const sortedRuns = runData.sort((a, b) => b.isActive - a.isActive);
        setRuns(sortedRuns);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRuns();
  }, [token]);

  const handleOnClick = async (e, runId, action) => {
    e.preventDefault();

    let formData;
    if (action === "complete") {
      formData = { completed: !runs.find((run) => run.id === runId).completed };
    } else if (action === "isActive") {
      // deactive the currently active run to only allow of 1 active run at a time
      const activeRun = runs.find((run) => run.isActive);
      if (activeRun) {
        await fetch(`http://localhost:5400/runs/${activeRun.id}`, {
          method: "PUT",
          header: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: false }),
        });
      }
      formData = { isActive: true };
    }

    try {
      const response = await fetch(`http://localhost:5400/runs/${runId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Run updated successfully!");

        // update the runs state to reflect changes
        setRuns((prevRuns) =>
          prevRuns.map((run) =>
            run.id === runId
              ? {
                  ...run,
                  ...formData,
                }
              : run
          )
        );
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("Error: ", err);
      setMessage("Failed to connect to the server.");
    }
  };

  const handleDelete = async (e, runId) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5400/runs/${runId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the run");
      }

      // Update the runs state to remove the deleted run
      setRuns((prevRuns) => prevRuns.filter((run) => run.id !== runId));
      setMessage("Run deleted successfully.");
    } catch (err) {
      console.log(err);
      setMessage("Failed to delete run.");
    }
  };

  return (
    <div className="runs-page">
      <div className="mobile">
        <MobileNavbar />
      </div>
      <div className="laptop">
        <Sidebar />
      </div>
      <div className="runs-header">
        <h1>Runs</h1>
        <Link to="/new-run">
          <button className="run-button">Create Run</button>
        </Link>
      </div>
      <div className="runs-page-content">
        {runs.length > 0 ? (
          runs.map((run) => (
            <>
              <div key={run.id} className="runs-card">
                <div className="runs-card-header">
                  <Link className="link-style" to={`/runs/${run.id}/overview`}>
                    <h2 className={run.isActive ? "active-run" : ""}>
                      {run.runName}
                    </h2>
                  </Link>
                </div>
                <div className="game-name">
                  <span>Game: {run.game}</span>
                </div>
                <div className="option-buttons">
                  <button
                    className="complete"
                    onClick={(e) => handleOnClick(e, run.id, "complete")}
                  >
                    Complete
                  </button>
                  <button
                    className="set-active"
                    onClick={(e) => handleOnClick(e, run.id, "isActive")}
                  >
                    Set Active
                  </button>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(e, run.id)}
                >
                  X
                </button>
              </div>
            </>
          ))
        ) : (
          <p>No runs found.</p>
        )}
      </div>
    </div>
  );
}

export default Runs;
