import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckLeave = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [leavePaymentType, setleavePaymentType] = useState(""); // Default to Unpaid
  const navigate = useNavigate();

  const adminId = window.localStorage.getItem('uid');

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        console.log("Fetching Leave ID:", id); // Log the ID
        const response = await axios.get(`http://localhost:8001/leave/${id}`);
        console.log("Fetched Leave Data:", response.data); // Log the response data
        setLeave(response.data);
      } catch (error) {
        setError('Error fetching leave application');
        console.error('Error fetching leave application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8001/leaves/${id}/status`, { status, review, leavePaymentType });
      setLeave((prevLeave) => ({
        ...prevLeave,
        status,
        review,
        leavePaymentType,
      }));
      navigate('/homea/leavea');
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this leave application?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8001/leaves/${id}`);
        navigate('/homea/leavea');
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!leave) {
    return <div>Leave application not found</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-orange text-white">
          <h2>APPLICATION DETAILS</h2>
        </div>
        <div className="card-body">
          <p><strong>Employee UID:</strong> {leave.uid}</p>
          <p><strong>Leave Type:</strong> {leave.leaveType}</p>
          <p><strong>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> {leave.totalDays}</p>
          <p><strong>Reason:</strong> {leave.reason}</p>
          <p><strong>Status:</strong> {leave.status}</p>
          <p><strong>Leave Payment Type:</strong> {leave.leavePaymentType}</p>
          <p><strong>Review:</strong> {leave.review}</p>
          <div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Add your review here"
              rows="4"
              cols="50"
            />
          </div>
          <div>
            <p><strong>Leave Payment Type:</strong></p>
            <label>
              <input
                type="radio"
                name="leaveType"
                value="Paid"
                checked={leavePaymentType === "Paid"}
                onChange={(e) => setleavePaymentType(e.target.value)}
              /> Paid
            </label>
            <label>
              <input
                type="radio"
                name="leaveType"
                value="Unpaid"
                checked={leavePaymentType === "Unpaid"}
                onChange={(e) => setleavePaymentType(e.target.value)}
              /> Unpaid
            </label>
          </div>
        </div>
        <div>
          {leave.status === 'Pending' && adminId === 'A001' && (
            <>
              <button
                className="btn btn-sm btn-warning mb-2"
                onClick={() => handleStatusChange(leave._id, 'Second Level Pending')}
              >
                Send for Approval
              </button>
              <button
                className="btn btn-sm btn-danger mb-2"
                onClick={() => handleStatusChange(leave._id, 'Rejected')}
              >
                Reject
              </button>
            </>
          )}
          {leave.status === 'Second Level Pending' && adminId === 'A002' && (
            <>
              <button
                className="btn btn-sm btn-success mb-2"
                onClick={() => handleStatusChange(leave._id, 'Approved')}
              >
                Approve
              </button>
              <button
                className="btn btn-sm btn-danger mb-2"
                onClick={() => handleStatusChange(leave._id, 'Rejected')}
              >
                Reject
              </button>
            </>
          )}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handleDelete(leave._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckLeave;