import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GstApplications.css";  // Import the CSS file here

const GstApplications = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const response = await axios.get("https://ipowertree.onrender.com/reimbursements");
        setReimbursements(response.data.filter((r) => r.gstType === "GST" && r.status === "Approved"));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  const filteredReimbursements = reimbursements.filter((reimbursement) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const reimbursementStartDate = new Date(reimbursement.startDate);

    return (
      (startDate === "" || reimbursementStartDate >= start) &&
      (endDate === "" || reimbursementStartDate <= end)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="containergst mt-5">
      <h2 className="gstheader">GST APPLICATIONS</h2>
      <br />
      <div className="dategst mb-4 text-center">
        <div className="mb-2">
          <label htmlFor="startDate" className="form-label">
            <strong>Start Date: </strong>
          </label>
          <input
            type="date"
            id="startDate"
            className="form-control-gst"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="endDate" className="form-label">
          <strong>End Date: </strong>
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control-gst"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="tablegst-containergst">
      <div class="tablegst-scrollable">
        {filteredReimbursements.length > 0 ? (
          <table className="tablegst tablegst-bordered">
            <thead>
              <tr>
                {/* <th>UID</th> */}
                <th>Employee Name</th>
                <th>Expense Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Expense</th>
                {/* <th>Status</th> */}
                <th>Proofs</th>
              </tr>
            </thead>
            <tbody>
              {filteredReimbursements.map((reimbursement) => (
                <tr key={reimbursement._id}>
                  {/* <td>{reimbursement.uid}</td> */}
                  <td>{reimbursement.employeeName}</td>
                  <td>{reimbursement.expenseType}</td>
                  <td>{new Date(reimbursement.startDate).toLocaleDateString()}</td>
                  <td>{new Date(reimbursement.endDate).toLocaleDateString()}</td>
                  <td>{reimbursement.totalExpense}</td>
                  {/* <td>{reimbursement.status}</td> */}
                  <td>
                    {reimbursement.proofs.map((proof, index) => (
                      <a
                        key={index}
                        href={`https://ipowertree.onrender.com/${proof}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Proof {index + 1}
                        <br />
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : (
          <div>No approved GST applications found for the selected period.</div>
        )}
        </div>
      </div>
    </div>
  );
};

export default GstApplications;
