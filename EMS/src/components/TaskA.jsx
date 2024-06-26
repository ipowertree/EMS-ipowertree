import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskA.css"; // Import custom CSS for styling

const TaskA = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskDetails, setTaskDetails] = useState({ task: "", deadline: "" });
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://ipowertree.onrender.com/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleTaskChange = (field, value) => {
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const task = {
        uid: selectedEmployee,
        ...taskDetails,
        status: "Pending",
      };

      await axios.post("https://ipowertree.onrender.com/tasks", { tasks: [task] });
      alert("Task assigned successfully!");
      setTaskDetails({ task: "", deadline: "" });
      fetchPendingTasks(); // Fetch and update pending tasks immediately after assigning
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task.");
    }
  };

  const fetchPendingTasks = async () => {
    try {
      const response = await axios.get("https://ipowertree.onrender.com/tasks?status=Pending");
      setPendingTasks(response.data);
      setShowPending(true);
      setShowCompleted(false);
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get("https://ipowertree.onrender.com/tasks?status=Done");
      setCompletedTasks(response.data);
      setShowPending(false);
      setShowCompleted(true);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://ipowertree.onrender.com/tasks/${taskId}`);
        setPendingTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
        setCompletedTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error deleting task.");
      }
    }
  };

  return (
    <>
      <div className="containerta">

      <div className="header-containerta">

        <h2>TASK ASSIGNMENT</h2>
      </div>

      <div className="form-containerta">
        <form onSubmit={handleSubmit}>
          <div className="form-groupta">
            <label>Employee:</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="form-controlta"
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((employee) => (
                <option key={employee.uid} value={employee.uid}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-groupta">
            <label>Task:</label>
            <input
              type="text"
              className="form-controlta"
              value={taskDetails.task}
              onChange={(e) => handleTaskChange("task", e.target.value)}
              placeholder="Enter task details"
            />
          </div>
          <div className="form-groupta">
            <label>Deadline:</label>
            <input
              type="date"
              className="form-controlta"
              value={taskDetails.deadline}
              onChange={(e) => handleTaskChange("deadline", e.target.value)}
            />
          </div>
          <div className="button-containerta">
            <button type="submit" className="btnta btnta-primary">
              Assign Task
            </button>
          </div>
        </form>
        </div>
      </div>
      <div className="button-containerta">
        <button onClick={fetchPendingTasks} className="btnta btnta-warning">
          Show All Pending Tasks
        </button>
        </div>
        <div className="button-containerta">
        <button onClick={fetchCompletedTasks} className="btnta btnta-success">
          Show All Completed Tasks
        </button>
      </div>
      {showPending && (
        <div className="tasks-containerta">
          <div className="tasks-header">
            <h3>PENDING TASKS</h3>
          </div>
          {pendingTasks.length === 0 ? (
            <p className="text-center">No pending tasks found.</p>
          ) : (
            <div className="tableta-responsive">
              <table className="tableta">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Employee Name</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.task}</td>
                      <td>{employees.find(e => e.uid === task.uid)?.name}</td>
                      <td>{new Date(task.deadline).toLocaleDateString()}</td>
                      <td>
                        <button className="btnta btnta-danger" onClick={() => handleDeleteTask(task._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {showCompleted && (
        <div className="tasks-containerta">
          <div className="tasks-header">
            <h3>COMPLETED TASKS</h3>
          </div>
          {completedTasks.length === 0 ? (
            <p className="text-center">No completed tasks found.</p>
          ) : (
            <div className="tableta-responsive">
              <table className="tableta">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Employee Name</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.task}</td>
                      <td>{employees.find(e => e.uid === task.uid)?.name}</td>
                      <td>{new Date(task.deadline).toLocaleDateString()}</td>
                      <td>
                        <button className="btnta btnta-danger" onClick={() => handleDeleteTask(task._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaskA;
