import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LeaveE.css"; // Import the CSS file

const LeaveE = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uid: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    totalDays: 0, // Add totalDays field
  });

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      setFormData((prevFormData) => ({ ...prevFormData, uid }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      };
      if (name === "startDate" || name === "endDate") {
        const { startDate, endDate } = updatedFormData;
        if (startDate && endDate) {
          const totalDays = calculateTotalDays(startDate, endDate);
          updatedFormData.totalDays = totalDays;
        }
      }
      return updatedFormData;
    });
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
    return diffDays;
  };

  const resetForm = () => {
    setFormData({
      uid: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      totalDays: 0, // Reset totalDays
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData); // Log formData to check its content
      const response = await axios.post(
        "https://ipowertree.onrender.com/submit-leave",
        formData
      );
      alert("Form submitted successfully");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="cardlee">
            <div className="cardlee-header">
              <h2>LEAVE APPLICATION FORM</h2>
            </div>
            <div className="cardlee-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="uid">Employee Unique Id:</label>
                  <input
                    type="text"
                    id="uid"
                    name="uid"
                    value={formData.uid}
                    onChange={handleChange}
                    required
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="leaveType">Leave Type:</label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="endDate">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="totalDays">Total Days:</label>
                  <input
                    type="number"
                    id="totalDays"
                    name="totalDays"
                    value={formData.totalDays}
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="reason">Reason for Leave:</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group text-center">
                  <button type="submit" className="btnlee btnlee-primary">
                    Submit
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <button
                  className="btnlee btnlee-success"
                  onClick={() => navigate("/homee/leaveapplication")}
                >
                  Leave Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveE;
