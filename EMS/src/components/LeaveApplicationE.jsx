import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/LeaveApp.css';

function LeaveApplicationE() {
  const [leaves, setLeaves] = useState([]);
  const [timePeriodFilter, setTimePeriodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
  const userId = localStorage.getItem("uid"); // Assuming you store the user ID in local storage

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`https://ipowertree.onrender.com/leaves/${userId}`);
        setLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leave applications:", error);
      }
    };

    fetchLeaves();
  }, [userId]);

  const handleTimePeriodFilterChange = (event) => {
    setTimePeriodFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePaymentTypeFilterChange = (event) => {
    setPaymentTypeFilter(event.target.value);
  };

  // const handleClearFilters = () => {
  //   setTimePeriodFilter("All");
  //   setStatusFilter("All");
  //   setPaymentTypeFilter("All");
  // };

  const filterByTimePeriod = (leave) => {
    const currentDate = new Date();
    const leaveDate = new Date(leave.startDate);
    if (timePeriodFilter === "Last Month") {
      const lastMonth = new Date();
      lastMonth.setMonth(currentDate.getMonth() - 1);
      return leaveDate >= lastMonth;
    } else if (timePeriodFilter === "Last Year") {
      const lastYear = new Date();
      lastYear.setFullYear(currentDate.getFullYear() - 1);
      return leaveDate >= lastYear;
    }
    return true;
  };

  const filteredLeaves = leaves.filter(leave => {
    if (!filterByTimePeriod(leave)) return false;
    if (statusFilter !== "All" && statusFilter !== leave.status) return false;
    if (paymentTypeFilter !== "All" && paymentTypeFilter !== leave.leavePaymentType) return false;
    return true;
  });

  return (
    <>
      <br />
      <br />
      <h2 className="text-center">LEAVE APPLICATIONS</h2>
      <br />

      <div className="filters-container text-center mb-4">
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownTimeButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by Time Period: {timePeriodFilter}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownTimeButton">
            <li>
              <button className={`dropdown-item ${timePeriodFilter === "All" && "active"}`} onClick={() => setTimePeriodFilter("All")}>
                All Time
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${timePeriodFilter === "Last Month" && "active"}`} onClick={() => setTimePeriodFilter("Last Month")}>
                Last Month
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${timePeriodFilter === "Last Year" && "active"}`} onClick={() => setTimePeriodFilter("Last Year")}>
                Last Year
              </button>
            </li>
          </ul>
        </div>
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownStatusButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by Status: {statusFilter}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownStatusButton">
            <li>
              <button className={`dropdown-item ${statusFilter === "All" && "active"}`} onClick={() => setStatusFilter("All")}>
                All
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${statusFilter === "Approved" && "active"}`} onClick={() => setStatusFilter("Approved")}>
                Approved
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${statusFilter === "Rejected" && "active"}`} onClick={() => setStatusFilter("Rejected")}>
                Rejected
              </button>
            </li>
          </ul>
        </div>
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownPaymentTypeButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by Payment Type: {paymentTypeFilter}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownPaymentTypeButton">
            <li>
              <button className={`dropdown-item ${paymentTypeFilter === "All" && "active"}`} onClick={() => setPaymentTypeFilter("All")}>
                All
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${paymentTypeFilter === "Paid" && "active"}`} onClick={() => setPaymentTypeFilter("Paid")}>
                Paid
              </button>
            </li>
            <li>
              <button className={`dropdown-item ${paymentTypeFilter === "Unpaid" && "active"}`} onClick={() => setPaymentTypeFilter("Unpaid")}>
                Unpaid
              </button>
            </li>
          </ul>
        </div>
        {/* <div className="filter-group">
          <button className="btn btn-secondary" onClick={handleClearFilters}>Clear All Filters</button>
        </div> */}
      </div>

      <div className="tableleapp-container">
        {filteredLeaves.length > 0 ? (
          <table className="tableleapp tableleapp-bordered">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Leave Payment Type</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.totalDays}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>{leave.leavePaymentType}</td>
                  <td>{leave.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center"><br />No leave applications found.</p>
        )}
      </div>
    </>
  );
}

export default LeaveApplicationE;
