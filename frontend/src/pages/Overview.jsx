import { useEffect, useState } from "react";
import EncountersCard from "../components/EncountersCard";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../css/Overview.css";
import NavBar from "../components/NavBar";

function Overview() {
  const { runId } = useParams();
  const [details, setDetails] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5400/runs/${runId}/overview`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch details");
        }

        const runDetails = await response.json();

        // sort by id
        const sortedRunDetails = {
          ...runDetails,
          rundetail: runDetails.rundetail.sort((a, b) => a.id - b.id),
        };

        setDetails(runDetails);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDetails();
  }, [runId, token]);

  if (!details) {
    return <p>Loading...</p>;
  }

  const handleAdd = async (e) => {
    e.preventDefault();

    navigate("/runs/details", {
      state: { runId: details.id },
    });
  };

  return (
    <div className="overview-page">
      <NavBar />
      <div className="run-details-section">
        <h1 className="completed-header">
          Completed: {details?.completed ? "Yes" : "No"}
        </h1>
        <div className="encounters-section">
          <EncountersCard
            details={details}
            setDetails={setDetails}
            runId={runId}
          />
        </div>
        <div className="overview-buttons">
          <Link className="link-styling" to="/runs">
            <button className="runs-button">Runs</button>
          </Link>
          <button className="add-button" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overview;
