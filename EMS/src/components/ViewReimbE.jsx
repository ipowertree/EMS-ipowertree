import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewReimbE.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ViewReimbE() {
  const [reimbursements, setReimbursements] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState("All");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const response = await axios.get(
          `https://ipowertree.onrender.com/reimbursement/${uid}`
        );
        setReimbursements(response.data);
      } catch (error) {
        console.error("Error fetching reimbursements:", error);
      }
    };

    if (uid) {
      fetchReimbursements();
    }
  }, [uid]);

  const getLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today.setDate(today.getDate() - 7));
    return lastWeek;
  };

  const getLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return lastMonth;
  };

  const filteredReimbursements = reimbursements.filter((reimbursement) => {
    const startDate = new Date(reimbursement.startDate);

    const isInTimeFilter =
      timeFilter === "All" ||
      (timeFilter === "Last Week" && startDate >= getLastWeek()) ||
      (timeFilter === "Last Month" && startDate >= getLastMonth());

    const isInStatusFilter =
      statusFilter === "All" || reimbursement.status === statusFilter;

    const isInExpenseTypeFilter =
      expenseTypeFilter === "All" ||
      reimbursement.expenseType === expenseTypeFilter;

    return isInTimeFilter && isInStatusFilter && isInExpenseTypeFilter;
  });

  const totalExpense = filteredReimbursements.reduce((total, reimbursement) => {
    return total + reimbursement.totalExpense;
  }, 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    const approvedReimbursements = filteredReimbursements.filter(
      (reimbursement) => reimbursement.status === "Approved"
    );

    const totalApprovedExpense = approvedReimbursements.reduce(
      (total, reimbursement) => total + reimbursement.totalExpense,
      0
    );

    doc.setFontSize(14);
    doc.text("Approved Reimbursement Applications of : ______________", 14, 16);
    doc.setFontSize(10);

    const tableData = approvedReimbursements.map((reimbursement, index) => [
      index + 1,
      reimbursement.expenseType,
      reimbursement.description || "N/A",
      new Date(reimbursement.startDate).toLocaleDateString(),
      new Date(reimbursement.endDate).toLocaleDateString(),
      reimbursement.vehicleType || "N/A",
      reimbursement.totalKms || "N/A",
      reimbursement.totalExpense,
      reimbursement.gstType,
      reimbursement.status,
    ]);

    doc.autoTable({
      head: [
        [
          "S.No",
          "Expense Type",
          "Description",
          "Start Date",
          "End Date",
          "Vehicle Type",
          "Total Kms",
          "Total Expense",
          "GST Type",
          "Status",
        ],
      ],
      body: tableData,
      startY: 30,
      margin: { top: 30 },
      styles: { fontSize: 8 }, // Decreased font size
    });

    doc.setFontSize(12);
    doc.text(
      `Total Approved Expense: ${totalApprovedExpense}`,
      14,
      doc.internal.pageSize.height - 20
    );
    doc.save("approved_reimbursements.pdf");
  };

  return (
    <>
      <br />
      <br />
      <h2 className="text-center">REIMBURSEMENT APPLICATIONS</h2>
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
                className={`dropdown-item ${
                  timeFilter === "Last Week" && "active"
                }`}
                onClick={() => setTimeFilter("Last Week")}
              >
                Last Week
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  timeFilter === "Last Month" && "active"
                }`}
                onClick={() => setTimeFilter("Last Month")}
              >
                Last Month
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
              <button
                className={`dropdown-item ${
                  statusFilter === "All" && "active"
                }`}
                onClick={() => setStatusFilter("All")}
              >
                All
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  statusFilter === "Approved" && "active"
                }`}
                onClick={() => setStatusFilter("Approved")}
              >
                Approved
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  statusFilter === "Pending" && "active"
                }`}
                onClick={() => setStatusFilter("Pending")}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  statusFilter === "Rejected" && "active"
                }`}
                onClick={() => setStatusFilter("Rejected")}
              >
                Rejected
              </button>
            </li>
          </ul>
        </div>
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownExpenseTypeButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by Expense Type: {expenseTypeFilter}
          </button>
          <ul
            className="dropdown-menu"
            aria-labelledby="dropdownExpenseTypeButton"
          >
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "All" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("All")}
              >
                All
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "fuel" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("fuel")}
              >
                Fuel
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "raw-material" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("raw-material")}
              >
                Raw Material
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "food" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("food")}
              >
                Food
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "accomodation" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("accomodation")}
              >
                Accommodation
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "no-bill-claim" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("no-bill-claim")}
              >
                No Bill Claim
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "stamp-paper" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("stamp-paper")}
              >
                Stamp Paper
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "travelling-allowance" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("travelling-allowance")}
              >
                Travelling Allowance
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item ${
                  expenseTypeFilter === "others" && "active"
                }`}
                onClick={() => setExpenseTypeFilter("others")}
              >
                Others
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tablevre-container">
        {filteredReimbursements.length === 0 ? (
          <p style={{ textAlign: "center" }}>No applications found.</p>
        ) : (
          <>
            <table className="tablevre tablevre-bordered">
              <thead>
                <tr>
                  <th>Expense Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Expense</th>
                  <th>Status</th>
                  <th>Reviews</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReimbursements.map((reimbursement) => (
                  <tr key={reimbursement._id}>
                    <td>{reimbursement.expenseType}</td>
                    <td>
                      {new Date(reimbursement.startDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(reimbursement.endDate).toLocaleDateString()}
                    </td>
                    <td>{reimbursement.totalExpense}</td>
                    <td>{reimbursement.status}</td>
                    <td>{reimbursement.review}</td>
                    <td>
                      <Link
                        to={`/homee/editreimb/${reimbursement._id}`}
                        className="btn btn-vw btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center mt-4">
              <h5>Total Expense: {totalExpense}</h5>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={generatePDF}>
                Generate PDF for Approved Applications
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ViewReimbE;
