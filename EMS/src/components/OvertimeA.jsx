import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OvertimeA.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function OvertimeA() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeUid, setSelectedEmployeeUid] = useState("");
  const [overtimeData, setOvertimeData] = useState([]);
  const [totalOvertimeHours, setTotalOvertimeHours] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://ipowertree.onrender.com/employees");
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Error fetching employees. Please try again later.");
      }
    };

    fetchEmployees();
  }, []);

  const fetchOvertimeDataByEmployee = async (uid) => {
    if (!uid) {
      setError("Please select a valid Employee.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://ipowertree.onrender.com/overtime/employee/${uid}`, {
        params: {
          year,
          month
        }
      });
      setOvertimeData(response.data);
      if (response.data.length === 0) {
        setTotalOvertimeHours(0);
      } else {
        setTotalOvertimeHours(null);
      }
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        setError("Error: No response from the server. Please try again later.");
      } else {
        setError("Error: There was an error fetching the overtime data!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalOvertimeHours = async (uid, year, month) => {
    if (!uid) {
      setError("Please select a valid Employee.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://ipowertree.onrender.com/overtime/employee/${uid}/month/${year}/${month}`);
      setTotalOvertimeHours(response.data.totalHours);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.request) {
        setError("Error: No response from the server. Please try again later.");
      } else {
        setError("Error: There was an error fetching the total overtime hours!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overtime-container">

    <div className="header-overtime">
      <h2>OVERTIME RECORDS</h2>
    </div>
    <div className="form-overtime-container">

      <div className="form-sectionota">
        <div className="form-groupota">
          <label htmlFor="employee-select"><strong>Select Employee:</strong></label>
          <select
            id="employee-select"
            value={selectedEmployeeUid}
            onChange={(e) => setSelectedEmployeeUid(e.target.value)}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.uid} value={employee.uid}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-groupota">
          <label htmlFor="year-input"><strong>Year:</strong></label>
          <input
            id="year-input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
          />
        </div>
        
        <div className="form-groupota">
          <label htmlFor="month-select"><strong>Month:</strong></label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-groupota">
          <button onClick={() => fetchOvertimeDataByEmployee(selectedEmployeeUid)}>
            Fetch Overtime Records
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {overtimeData.length === 0 ? (
            <p className="text-center">No record found</p>
          ) : (
            <>
            <div class="tableota-container">
              <table className="tableota">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {overtimeData.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.hours}</td>
                      <td>{record.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              
              <div className="form-groupota">
                <button onClick={() => fetchTotalOvertimeHours(selectedEmployeeUid, year, month)}>
                  Calculate Total Overtime Hours
                </button>
              </div>
              
              {totalOvertimeHours !== null && (
                <div className="total-overtime">
                  <p>Total Overtime Hours for {monthNames[month - 1]} {year}: {totalOvertimeHours}</p>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default OvertimeA;
