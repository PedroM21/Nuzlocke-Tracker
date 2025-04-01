import "../css/EncountersCard.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function EncountersCard({ details, setDetails }) {
  const location = useLocation();
  const { runId } = location.state || {};
  const [editingId, setEditingId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const token = localStorage.getItem("token");

  const handleEditClick = (detail) => {
    setEditingId(detail.id);
    setEditedDetails(detail);
  };

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (value === "true") value = true;
    if (value === "false") value = false;
    setEditedDetails({ ...editedDetails, [field]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:5400/runs/${runId}/overview/${editedDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedDetails),
        }
      );

      // console.log("Edited Details ID:", editedDetails.id);
      if (response.ok) {
        const updatedDetail = await response.json();
        const updatedDetails = details.rundetail.map((detail) =>
          detail.id === updatedDetail.id ? updatedDetail : detail
        );

        // Sort the updated details by id to maintain order
        updatedDetails.sort((a, b) => a.id - b.id);

        // Assuming 'setDetails' is the state setter function for 'details'
        setDetails((prevDetails) => ({
          ...prevDetails,
          rundetail: updatedDetails,
        }));
        setEditingId(null);
      } else {
        console.log("Failed to update run detail.");
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className="encounters-section">
      <div className="encounter-header">
        <h1>Encounters</h1>
        <div className="encounter-content">
          {details.rundetail && details.rundetail.length > 0 ? (
            details.rundetail.map((detail) => (
              <div key={detail.id} className="encounter-separator">
                {editingId === detail.id ? (
                  <>
                    <div className="encounter-item">
                      <label className="label">Location:</label>
                      <input
                        className="value"
                        value={editedDetails.location}
                        onChange={(e) => handleInputChange(e, "location")}
                      />
                    </div>
                    <div className="encounter-item">
                      <label className="label">Caught:</label>
                      <select
                        className="value custom-select"
                        value={editedDetails.caught}
                        onChange={(e) => handleInputChange(e, "caught")}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                    <div className="encounter-item">
                      <label className="label">Name:</label>
                      <input
                        className="value"
                        value={editedDetails.name}
                        onChange={(e) => handleInputChange(e, "name")}
                      />
                    </div>
                    <div className="encounter-item">
                      <label className="label">Nickname:</label>
                      <input
                        className="value"
                        value={editedDetails.nickname}
                        onChange={(e) => handleInputChange(e, "nickname")}
                      />
                    </div>
                    <div className="encounter-item">
                      <label className="label">Alive:</label>
                      <select
                        className="value custom-select"
                        value={editedDetails.isAlive}
                        onChange={(e) => handleInputChange(e, "isAlive")}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                    <button className="update-button" onClick={handleSaveClick}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="encounter-item">
                      <span className="label">Location:</span>
                      <span className="value">{detail.location}</span>
                    </div>
                    <div className="encounter-item">
                      <span className="label">Caught:</span>
                      <span className="value">
                        {detail.caught ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="encounter-item">
                      <span className="label">Name:</span>
                      <span className="value">{detail.name}</span>
                    </div>
                    <div className="encounter-item">
                      <span className="label">Nickname:</span>
                      <span className="value">{detail.nickname}</span>
                    </div>
                    <div className="encounter-item">
                      <span className="label">Alive:</span>
                      <span className="value">
                        {detail.isAlive ? "Yes" : "No"}
                      </span>
                    </div>
                    <button
                      className="update-button"
                      onClick={() => handleEditClick(detail)}
                    >
                      Edit
                    </button>
                  </>
                )}
                <hr></hr>
              </div>
            ))
          ) : (
            <p className="helper-text">
              No encounters have been made. Click the button below to add
              encounters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EncountersCard;
