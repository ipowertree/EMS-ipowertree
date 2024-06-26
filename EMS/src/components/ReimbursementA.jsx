import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ReimbursementA.css"; // Import the CSS file

const ReimbursementA = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [timeFilter, setTimeFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("");

  const adminId = window.localStorage.getItem("uid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const response = await axios.get("https://ipowertree.onrender.com/reimbursements");
        setReimbursements(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  useEffect(() => {
    if (adminId === "A001") {
      setStatusFilter("Pending");
    } else if (adminId === "A002") {
      setStatusFilter("Second Level Pending");
    } else if (adminId === "A003") {
      setStatusFilter("Third Level Pending");
    }
  }, [adminId]);

  const getLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today.setDate(today.getDate() - 7));
    return lastWeek;
  };

  const getLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return lastMonth;
  };

  const filteredReimbursements = reimbursements.filter((reimbursement) => {
    const startDate = new Date(reimbursement.startDate);

    // Filter by time period
    const isInTimeFilter =
      timeFilter === "All" ||
      (timeFilter === "Last Week" && startDate >= getLastWeek()) ||
      (timeFilter === "Last Month" && startDate >= getLastMonth());

    // Filter by status
    const isInStatusFilter =
      statusFilter === "All" ||
      (adminId === "A001" &&
        (statusFilter === "Pending" || statusFilter === "On Hold by Admin 1") &&
        (reimbursement.status === "Pending" ||
          reimbursement.status === "On Hold by Admin 1")) ||
      (adminId === "A002" &&
        (statusFilter === "Second Level Pending" ||
          statusFilter === "On Hold by Admin 2") &&
        (reimbursement.status === "Second Level Pending" ||
          reimbursement.status === "On Hold by Admin 2")) ||
      (adminId === "A003" &&
        (statusFilter === "Third Level Pending" ||
          statusFilter === "On Hold by Admin 3") &&
        (reimbursement.status === "Third Level Pending" ||
          reimbursement.status === "On Hold by Admin 3")) ||
      reimbursement.status === statusFilter;

    // Filter by employee name
    const isInEmployeeFilter =
      employeeFilter === "" ||
      reimbursement.employeeName.toLowerCase().includes(employeeFilter.toLowerCase());

    // Filter by expense type
    const isInExpenseTypeFilter =
      expenseTypeFilter === "" || reimbursement.expenseType === expenseTypeFilter;

    return isInTimeFilter && isInStatusFilter && isInEmployeeFilter && isInExpenseTypeFilter;
  });

  const clearFilters = () => {
    setStatusFilter("All");
    setTimeFilter("All");
    setEmployeeFilter("");
    setExpenseTypeFilter("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Calculate total expense
  const totalExpense = filteredReimbursements.reduce((total, reimbursement) => {
    return total + reimbursement.totalExpense;
  }, 0);

  return (
    <>
      <div className="containerrba mt-5">
        <div className="header-containerrba">
          <h2>REIMBURSEMENT APPLICATIONS</h2>
        </div>
        <div className="form-containerrba text-center">
          <div className="filtersrba mb-4">
            <div className="row g-3">
              <div className="col-md-4 col-sm-6">
                <div className="dropdown mb-2">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownTimeButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Filter by Time Period: {timeFilter}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownTimeButton">
                    <li>
                      <button
                        className={`dropdown-item ${timeFilter === "All" && "active"}`}
                        onClick={() => setTimeFilter("All")}
                      >
                        All
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${timeFilter === "Last Week" && "active"}`}
                        onClick={() => setTimeFilter("Last Week")}
                      >
                        Last Week
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${timeFilter === "Last Month" && "active"}`}
                        onClick={() => setTimeFilter("Last Month")}
                      >
                        Last Month
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
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
                      <button
                        className={`dropdown-item ${statusFilter === "Approved" && "active"}`}
                        onClick={() => setStatusFilter("Approved")}
                      >
                        Approved
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${statusFilter === "Rejected" && "active"}`}
                        onClick={() => setStatusFilter("Rejected")}
                      >
                        Rejected
                      </button>
                    </li>
                    {adminId === "A001" && (
                      <>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "Pending" && "active"}`}
                            onClick={() => setStatusFilter("Pending")}
                          >
                            Pending
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "On Hold by Admin 1" && "active"}`}
                            onClick={() => setStatusFilter("On Hold by Admin 1")}
                          >
                            On Hold by Admin 1
                          </button>
                        </li>
                      </>
                    )}
                    {adminId === "A002" && (
                      <>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "Second Level Pending" && "active"}`}
                            onClick={() => setStatusFilter("Second Level Pending")}
                          >
                            Second Level Pending
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "On Hold by Admin 2" && "active"}`}
                            onClick={() => setStatusFilter("On Hold by Admin 2")}
                          >
                            On Hold by Admin 2
                          </button>
                        </li>
                      </>
                    )}
                    {adminId === "A003" && (
                      <>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "Third Level Pending" && "active"}`}
                            onClick={() => setStatusFilter("Third Level Pending")}
                          >
                            Third Level Pending
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${statusFilter === "On Hold by Admin 3" && "active"}`}
                            onClick={() => setStatusFilter("On Hold by Admin 3")}
                          >
                            On Hold by Admin 3
                          </button>
                        </li>
                      </>
                    )}
                    <li>
                      <button
                        className={`dropdown-item ${statusFilter === "All" && "active"}`}
                        onClick={() => setStatusFilter("All")}
                      >
                        All
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4 col-sm-6">
                <div className="dropdown mb-2">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownExpenseTypeButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Filter by Expense Type: {expenseTypeFilter || "All"}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownExpenseTypeButton">
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "" && "active"}`}
                        onClick={() => setExpenseTypeFilter("")}
                      >
                        All
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "fuel" && "active"}`}
                        onClick={() => setExpenseTypeFilter("fuel")}
                      >
                        Fuel
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "raw-material" && "active"}`}
                        onClick={() => setExpenseTypeFilter("raw-material")}
                      >
                        Raw Material
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "food" && "active"}`}
                        onClick={() => setExpenseTypeFilter("food")}
                      >
                        Food
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "accomodation" && "active"}`}
                        onClick={() => setExpenseTypeFilter("accomodation")}
                      >
                        Accomodation
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "no-bill-claim" && "active"}`}
                        onClick={() => setExpenseTypeFilter("no-bill-claim")}
                      >
                        No Bill Claim
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "stamp-paper" && "active"}`}
                        onClick={() => setExpenseTypeFilter("stamp-paper")}
                      >
                        Stamp Paper
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "travelling-transportation" && "active"}`}
                        onClick={() => setExpenseTypeFilter("travelling-transportation")}
                      >
                        Travelling/Transportation
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "advance-payment" && "active"}`}
                        onClick={() => setExpenseTypeFilter("advance-payment")}
                      >
                        Advance Payment
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${expenseTypeFilter === "other" && "active"}`}
                        onClick={() => setExpenseTypeFilter("other")}
                      >
                        Other
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 text-center">
                <div className="mb-2">
                  <label htmlFor="employeeFilter" className="form-label">
                    Filter by Employee:
                  </label>
                  <select
                    id="employeeFilter"
                    className="form-select-rba"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {reimbursements
                      .map((reimbursement) => reimbursement.employeeName)
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map((employeeName) => (
                        <option key={employeeName} value={employeeName}>
                          {employeeName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="tablerba-containerrba">
            {filteredReimbursements.length > 0 ? (
              <table className="tablerba">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Employee Name</th>
                    <th>Expense Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Expense</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReimbursements.map((reimbursement) => (
                    <tr key={reimbursement._id}>
                      <td>{reimbursement.uid}</td>
                      <td>{reimbursement.employeeName}</td>
                      <td>{reimbursement.expenseType}</td>
                      <td>{new Date(reimbursement.startDate).toLocaleDateString()}</td>
                      <td>{new Date(reimbursement.endDate).toLocaleDateString()}</td>
                      <td>{reimbursement.totalExpense}</td>
                      <td>{reimbursement.status}</td>
                      <td>
                        <Link
                          to={`/homea/checkreimb/${reimbursement._id}`}
                          className="btn btn-black btn-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No reimbursement applications found.</div>
            )}
          </div>
          {filteredReimbursements.length > 0 && (
            <div className="text-center mt-4">
              <h5>Total Expense: {totalExpense}</h5>
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-orange mt-1" onClick={() => navigate('/homea/gst-applications')}>
          GST Applications
        </button>
      </div>
    </>
  );
};

export default ReimbursementA;
