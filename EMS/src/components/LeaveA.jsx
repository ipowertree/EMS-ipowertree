import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/LeaveA.css"; // Import the CSS file

const LeaveA = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = window.localStorage.getItem("uid");

  const initialFilter = currentUser === "A002" ? "Second Level Pending" : currentUser === "A001" ? "Pending" : "All";
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [timePeriodFilter, setTimePeriodFilter] = useState("All");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("https://ipowertree.onrender.com/leaves");
        setLeaves(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTimePeriodFilterChange = (event) => {
    setTimePeriodFilter(event.target.value);
  };

  const handlePaymentTypeFilterChange = (event) => {
    setPaymentTypeFilter(event.target.value);
  };

  const handleEmployeeFilterChange = (event) => {
    setEmployeeFilter(event.target.value);
  };

  const handleClearFilters = () => {
    setStatusFilter("All");
    setTimePeriodFilter("All");
    setPaymentTypeFilter("All");
    setEmployeeFilter("All");
  };

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
    if (employeeFilter !== "All" && employeeFilter !== leave.name) return false;
    return true;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const uniqueEmployees = [...new Set(leaves.map(leave => leave.name))];

  return (
    <div className="containerlea mt-5">
      <div className="header-containerlea">
        <h2>LEAVE APPLICATIONS</h2>
      </div>
      <div className="form-containerlea text-center">
        <div className="filterslea mb-4">
          <div className="row g-3">
            <div className="col-md-4 col-sm-6">
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownTimeButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter by Time Period: {timePeriodFilter}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownTimeButton">
                  <li><button className={`dropdown-item ${timePeriodFilter === "All" && "active"}`} onClick={() => setTimePeriodFilter("All")}>All Time</button></li>
                  <li><button className={`dropdown-item ${timePeriodFilter === "Last Month" && "active"}`} onClick={() => setTimePeriodFilter("Last Month")}>Last Month</button></li>
                  <li><button className={`dropdown-item ${timePeriodFilter === "Last Year" && "active"}`} onClick={() => setTimePeriodFilter("Last Year")}>Last Year</button></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownStatusButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter by Status: {statusFilter}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownStatusButton">
                  <li><button className={`dropdown-item ${statusFilter === "Pending" && "active"}`} onClick={() => setStatusFilter("Pending")}>Pending</button></li>
                  <li><button className={`dropdown-item ${statusFilter === "Approved" && "active"}`} onClick={() => setStatusFilter("Approved")}>Approved</button></li>
                  <li><button className={`dropdown-item ${statusFilter === "Rejected" && "active"}`} onClick={() => setStatusFilter("Rejected")}>Rejected</button></li>
                  <li><button className={`dropdown-item ${statusFilter === "Second Level Pending" && "active"}`} onClick={() => setStatusFilter("Second Level Pending")}>Second Level Pending</button></li>
                  <li><button className={`dropdown-item ${statusFilter === "All" && "active"}`} onClick={() => setStatusFilter("All")}>All</button></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="dropdown mb-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownPaymentTypeButton" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter by Payment Type: {paymentTypeFilter}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownPaymentTypeButton">
                  <li><button className={`dropdown-item ${paymentTypeFilter === "All" && "active"}`} onClick={() => setPaymentTypeFilter("All")}>All Payment Types</button></li>
                  <li><button className={`dropdown-item ${paymentTypeFilter === "Paid" && "active"}`} onClick={() => setPaymentTypeFilter("Paid")}>Paid</button></li>
                  <li><button className={`dropdown-item ${paymentTypeFilter === "Unpaid" && "active"}`} onClick={() => setPaymentTypeFilter("Unpaid")}>Unpaid</button></li>
                </ul>
              </div>
            </div>
            <div className="col-12 text-center">
              <div className="mb-2">
                <label htmlFor="employeeFilter" className="form-label">Filter by Employee:</label>
                <select id="employeeFilter" className="form-select-leave" value={employeeFilter} onChange={handleEmployeeFilterChange}>
                  <option value="All">All Employees</option>
                  {uniqueEmployees.map((employee, index) => (
                    <option key={index} value={employee}>{employee}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
        <div className="tablelea-containerlea">
          {filteredLeaves.length > 0 ? (
            <table className="tablelea-leave">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Days</th>
                  <th>Status</th>
                  <th>Leave Payment Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.name}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.status}</td>
                    <td>{leave.leavePaymentType}</td>
                    <td>
                      <Link to={`/homea/checkleave/${leave._id}`} className="btn btn-black btn-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No leave applications found.</div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveA;
