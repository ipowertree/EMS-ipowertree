import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/AttendanceA.css'; // Import the CSS file

const AttendanceA = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleString('en-US', { weekday: 'long' }));
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    axios.get("https://ipowertree.onrender.com/employees")
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const attendanceData = {
      year: selectedYear,
      month: selectedMonth,
      date: selectedDate,
      day: selectedDay,
      data: attendance
    };

    if (isUpdate) {
      try {
        setLoading(true);
        await axios.put(`https://ipowertree.onrender.com/attendance/${selectedYear}/${selectedMonth}/${selectedDate}`, attendanceData);
        alert(`Attendance updated successfully for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear}`);
        navigate("/homea/manageempa");
      } catch (error) {
        console.error("Error updating attendance:", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await axios.get(`https://ipowertree.onrender.com/attendance/${selectedYear}/${selectedMonth}/${selectedDate}`);
        if (res.data.length > 0) {
          alert(`Attendance for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear} already exists.`);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking existing attendance:", error);
        setLoading(false);
        return;
      }

      axios.post("https://ipowertree.onrender.com/attendance", attendanceData)
        .then(response => {
          console.log(response.data);
          alert(`Attendance recorded successfully for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear}`);
          navigate("/homea/manageempa");
        })
        .catch(error => {
          console.error("Error recording attendance:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://ipowertree.onrender.com/attendance/${selectedYear}/${selectedMonth}/${selectedDate}`);
      if (res.data.length > 0) {
        const existingAttendance = res.data[0].data;
        setAttendance(existingAttendance);
        setIsUpdate(true);
        alert(`Attendance data loaded for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear}. You can now update the attendance.`);
      } else {
        alert(`No existing attendance data found for ${selectedDay}, ${selectedDate}-${selectedMonth}-${selectedYear}.`);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from(new Array(20), (_, index) => new Date().getFullYear() - 10 + index);
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

  return (
    <div className="containerata">
      <br />
      <div className="cardata">
        <div className="cardata-header">
          <h2>ATTENDANCE</h2>
        </div>
        <div className="cardata-body">
          <div className="cardata-containerata">
            <div className="cardata-style">
              <h6>Total Present</h6>
              <p>{summary.present}</p>
            </div>
            <div className="cardata-style">
              <h6>Total Absent</h6>
              <p>{summary.absent}</p>
            </div>
            <div className="cardata-style">
              <h6>Total On Leave</h6>
              <p>{summary.onLeave}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            <div className="date-containerata">
              <label htmlFor="year">Year:</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
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
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="select-style"
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
                className="select-style"
              >
                {days.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              <label>Day: </label>
              <span className="select-style">{selectedDay}</span>
            </div>
            <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Leave</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.uid}>
                    <td>{employee.uid}</td>
                    <td>{employee.name}</td>
                    <td>
                      <input
                        type="radio"
                        name={`attendance-${employee.uid}`}
                        value="present"
                        checked={attendance[employee.uid]?.present || false}
                        onChange={(e) => handleAttendanceChange(employee.uid, e)}
                        className="radio-style"
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`attendance-${employee.uid}`}
                        value="absent"
                        checked={attendance[employee.uid]?.absent || false}
                        onChange={(e) => handleAttendanceChange(employee.uid, e)}
                        className="radio-style"
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`attendance-${employee.uid}`}
                        value="leave"
                        checked={attendance[employee.uid]?.leave || false}
                        onChange={(e) => handleAttendanceChange(employee.uid, e)}
                        className="radio-style"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <br />
            <button
              type="submit"
              className={`buttonata submit-buttonata ${loading ? 'disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : isUpdate ? 'Update' : 'Submit'}
            </button><br />
            {!isUpdate && (
              <button
                type="button"
                onClick={handleUpdate}
                className="buttonata update-buttonata"
                disabled={loading}
              >
                Load for Update
              </button>
            )}
            <br />
            <button
              type="button"
              onClick={() => navigate("/homea/monthlyattendancea")}
              className="buttonata view-buttonata"
            >
              View Monthly Attendance
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceA;
