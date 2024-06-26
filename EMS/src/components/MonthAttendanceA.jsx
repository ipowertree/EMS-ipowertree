import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AttendanceA.css';

const MonthAttendanceA = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const years = Array.from(new Array(20), (_, index) => new Date().getFullYear() - 10 + index); // 10 years back and 10 years ahead
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchAttendanceData();
    }
  }, [selectedYear, selectedMonth, selectedEmployeeId]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://ipowertree.onrender.com/employees");
      setEmployees(response.data);
      if (response.data.length > 0) {
        setSelectedEmployeeId(response.data[0].uid);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://ipowertree.onrender.com/attendance/${selectedYear}/${selectedMonth}/employee/${selectedEmployeeId}`);
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const calculateTotals = (attendanceData) => {
    let totals = { present: 0, absent: 0, leave: 0 };

    attendanceData.forEach(record => {
      if (record.status.present) totals.present++;
      if (record.status.absent) totals.absent++;
      if (record.status.leave) totals.leave++;
    });

    return totals;
  };

  const totals = calculateTotals(attendanceData);

  return (
    <div className="containerata">
    <br />
    <div className="cardata">
        <div className="cardata-header">
      <h2>MONTHLY ATTENDANCE</h2>
      </div>
      <br />
      <div className="cardata-body">
      <div className="date-containerata">
        <label htmlFor="year">Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="select-style"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <label htmlFor="month">Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="select-style"
        >
          {monthNames.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </select>
        <label htmlFor="employee">Employee:</label>
        <select
          id="employee"
          value={selectedEmployeeId}
          onChange={handleEmployeeChange}
          className="select-style"
        >
          {employees.map(employee => (
            <option key={employee.uid} value={employee.uid}>{employee.name}</option>
          ))}
        </select>
      </div>
      <div className="cardata-containerata">
        <div className="cardata-style">
          <h5>Present</h5>
          <p>{totals.present}</p>
        </div>
        <div className="cardata-style">
          <h5>Absent</h5>
          <p>{totals.absent}</p>
        </div>
        <div className="cardata-style">
          <h5>Leave</h5>
          <p>{totals.leave}</p>
        </div>
      </div>
      {attendanceData.length > 0 ? (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map(record => (
                <tr key={record.date}>
                  <td>{record.date}</td>
                  <td>{record.day}</td>
                  <td>{record.status.present ? 'Yes' : '-'}</td>
                  <td>{record.status.absent ? 'Yes' : '-'}</td>
                  <td>{record.status.leave ? 'Yes' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No attendance records for the selected month.</p>
      )}
      </div>
    </div>
    </div>
  );
};

export default MonthAttendanceA;
