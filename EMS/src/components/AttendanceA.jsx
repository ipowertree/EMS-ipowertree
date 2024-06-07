import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AttendanceA = () => {
  const navigate = useNavigate(); 
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleString('en-US', { weekday: 'long' }));

  useEffect(() => {
    axios.get("http://localhost:8001/employees")
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  useEffect(() => {
    const date = new Date(selectedYear, selectedMonth - 1, selectedDate);
    setSelectedDay(date.toLocaleString('en-US', { weekday: 'long' }));
  }, [selectedYear, selectedMonth, selectedDate]);

  const handleAttendanceChange = (uid, event) => {
    const { value } = event.target;
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [uid]: {
        uid: uid,        
        present: false,
        absent: false,
        leave: false,
        [value]: true
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const attendanceData = {
      year: selectedYear,
      month: selectedMonth,
      date: selectedDate,
      day: selectedDay,
      data: attendance
    };
    axios.post("http://localhost:8001/attendance", attendanceData)
      .then(response => {
        console.log(response.data);
        alert(`Attendance recorded successfully for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear}`);
        navigate("/homea/manageempa");
      })
      
      .catch(error => {
        console.error("Error recording attendance:", error);
        
      });
  };

  const years = Array.from(new Array(20), (_, index) => new Date().getFullYear() - 10 + index); // 10 years back and 10 years ahead
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from(new Array(31), (_, index) => index + 1);

  const calculateSummary = () => {
    let present = 0;
    let absent = 0;
    let onLeave = 0;

    Object.values(attendance).forEach(record => {
      if (record.present) present++;
      if (record.absent) absent++;
      if (record.leave) onLeave++;
    });

    return { present, absent, onLeave };
  };

  const summary = calculateSummary();

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyles = {
    border: '1px solid #ddd',
    padding: '10px',
    backgroundColor: '#f2f2f2',
    textAlign: 'center'
  };

  const tdStyles = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center'
  };

  const radioStyles = {
    cursor: 'pointer'
  };

  const selectStyles = {
    padding: '0.5rem',
    margin: '0 0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: 'white'
  };

  const dateContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',    
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const summaryCardStyles = {
    flex: '1',
    // paddingBottom: '10px', // Reduced padding
    paddingTop: '12px',
    margin: '0 5px', // Reduced margin
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  };
  
  const summaryContainerStyles = {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
    width: '60%',
    maxWidth: '600px',
    flexWrap: 'wrap' // Allow cards to wrap
  };
  

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: '20px',
    }}>
      <h2>Attendance</h2>
      <div style={summaryContainerStyles}>
        <div style={summaryCardStyles}>
          <h6>Total Present</h6>
          <p>{summary.present}</p>
        </div>
        <div style={summaryCardStyles}>
          <h6>Total Absent</h6>
          <p>{summary.absent}</p>
        </div>
        <div style={summaryCardStyles}>
          <h6>Total On Leave</h6>
          <p>{summary.onLeave}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <div style={dateContainerStyles}>
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={selectStyles}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={selectStyles}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <label htmlFor="date">Date:</label>
          <select
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={selectStyles}
          >
            {days.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          
          <label>Day: </label>
          <span style={selectStyles}>{selectedDay}</span>
        </div>
        
        
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>UID</th>
              <th style={thStyles}>Name</th>
              <th style={thStyles}>Present</th>
              <th style={thStyles}>Absent</th>
              <th style={thStyles}>Leave</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.uid}>
                <td style={tdStyles}>{employee.uid}</td>
                <td style={tdStyles}>{employee.name}</td>
                <td style={tdStyles}>
                  <input
                    type="radio"
                    name={`attendance-${employee.uid}`}
                    value="present"
                    checked={attendance[employee.uid]?.present || false}
                    onChange={(e) => handleAttendanceChange(employee.uid, e)}
                    style={radioStyles}
                  />
                </td>
                <td style={tdStyles}>
                  <input
                    type="radio"
                    name={`attendance-${employee.uid}`}
                    value="absent"
                    checked={attendance[employee.uid]?.absent || false}
                    onChange={(e) => handleAttendanceChange(employee.uid, e)}
                    style={radioStyles}
                  />
                </td>
                <td style={tdStyles}>
                  <input
                    type="radio"
                    name={`attendance-${employee.uid}`}
                    value="leave"
                    checked={attendance[employee.uid]?.leave || false}
                    onChange={(e) => handleAttendanceChange(employee.uid, e)}
                    style={radioStyles}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      
    </div>
  );
};

export default AttendanceA;
