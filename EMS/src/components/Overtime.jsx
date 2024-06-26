import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Overtime.css";  // Import the CSS file

function Overtime() {
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [uid, setUid] = useState(window.localStorage.getItem("uid"));

  useEffect(() => {
    fetchOvertimeData();
  }, [uid]);

  const fetchOvertimeData = () => {
    axios.get(`https://ipowertree.onrender.com/overtime/employee/${uid}`)
      .then(response => {
        setOvertimeData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("There was an error fetching the overtime data!");
        setLoading(false);
      });
  };

  const handleAddOvertime = () => {
    if (!uid || !date || !hours || !description) {
      window.alert("All fields are required!");
      return;
    }

    const newOvertime = { uid, date, hours, description };
    axios.post("https://ipowertree.onrender.com/overtime", newOvertime)
      .then(response => {
        fetchOvertimeData();
        setDate("");
        setHours("");
        setDescription("");
        setError(null);
      })
      .catch(error => {
        setError("There was an error adding the overtime record!");
      });
  };

  // const handleDeleteOvertime = (id) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this overtime record?");
  //   if (confirmDelete) {
  //     axios.delete(`https://ipowertree.onrender.com/overtime/${id}`)
  //       .then(response => {
  //         setOvertimeData(overtimeData.filter(record => record._id !== id));
  //         window.alert("Overtime record deleted successfully!");
  //       })
  //       .catch(error => {
  //         setError("There was an error deleting the overtime record!");
  //       });
  //   }
  // };

  return (
    <div className="containerote mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="cardote">
            <div className="cardote-header text-center">
              <h2 className="text-white">OVERTIME RECORDS</h2>
            </div>
            <div className="cardote-body">
              <div className="add-overtime-form">
                <h3 className="text-center">Add Overtime</h3>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date"
                  className="form-control mb-3"
                />
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Hours"
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="form-control mb-3"
                />
                <button onClick={handleAddOvertime} className="btnote btnote-primary w-100">Add Overtime</button>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {overtimeData.length === 0 ? (
                    <p className="text-center">No records found</p>
                  ) : (
                    <table className="tableote mt-3">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Hours</th>
                          <th>Description</th>
                          {/* <th>Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {overtimeData.map((record) => (
                          <tr key={record._id}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.hours}</td>
                            <td>{record.description}</td>
                            {/* <td>
                              <button className="btnote btnote-dangero" onClick={() => handleDeleteOvertime(record._id)}>Delete</button>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overtime;
