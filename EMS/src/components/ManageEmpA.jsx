import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/ManageEmpA.css"; // Import custom CSS for styling

function ManageEmpA() {

  const [employee, setEmployee] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllRecord = async () => {
      try {
        const res = await axios.get("http://localhost:8001/employees");
        setEmployee(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRecord();
  }, []);

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("isLoggedIn");
  }, []);

  return (
    <>
    <div id="manage-emp-container">
    
      <div className="button-container">
        <Link to="/assign-task" className="manage-button">
          <i className="bi bi-list-task"></i>
          Task Assignment
        </Link>
        <Link to="/homea/attendancea" className="manage-button">
          <i className="bi bi-calendar-check-fill"></i>
          Attendance
        </Link>
        <Link to="/reimbursement" className="manage-button">
          <i className="bi bi-currency-dollar"></i>
          Reimbursement
        </Link>
        <Link to="/leave-application" className="manage-button">
          <i className="bi bi-envelope-open-fill"></i>
          Leave Application
        </Link>
        <Link to="/homea/addempa" className="manage-button">
          <i className="bi bi-person-plus-fill"></i>
          Add Employees
        </Link>
      </div>
      <div className="px-5 mt-3">
  <div className="card mt-3">
    <div className="card-header text-center">
      <h2>Employee List</h2>
    </div>
    <div className="card-body">
      <table className="table table-striped custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Uid</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employee.map((e, index) => (
            <tr key={e.uid}>
              <td>{index + 1}</td>
              <td>{e.uid}</td>
              <td>{e.name}</td>
              <td>{e.phone}</td>
              <td>{e.department}</td>
              <td>
                <button className="btn btn-primary btn-sm">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>




    </div>
    
    </>
  );
}

export default ManageEmpA;
