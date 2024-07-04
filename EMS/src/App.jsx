import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import LoginformA from "./components/LoginformA";
import LoginformE from "./components/LoginformE";
import LoginformC from "./components/LoginformC";
import HomePage from "./components/HomePage";
import HomeA from "./components/HomeA";
import HomeE from "./components/HomeE";
import HomeC from "./components/HomeC";
import ProfileA from "./components/ProfileA";
import ManageEmpA from "./components/ManageEmpA";
import AttendanceA from "./components/AttendanceA";
import MonthAttendanceA from "./components/MonthAttendanceA";
import TaskA from "./components/TaskA";
import LeaveA from "./components/LeaveA";
import CheckLeave from "./components/CheckLeave";
import OvertimeA from "./components/OvertimeA";
import ReimbursementA from "./components/ReimbursementA";
import CheckReimb from "./components/CheckReimb";
import GstApplications from "./components/GstApplications";
import ManageClientA from "./components/ManageClientA";
import ManageInventoryA from "./components/ManageInventoryA";


import ProfileC from "./components/ProfileC";
import CheckUpdC from "./components/CheckUpdC";

import ProfileE from "./components/ProfileE";
import TaskE from "./components/TaskE";
import AttendanceE from "./components/AttendanceE";
import Overtime from "./components/Overtime";
import ReimbursementE from "./components/ReimbursementE";
import ViewReimbE from "./components/ViewReimbE";
import EditReimb from "./components/EditReimb";
import LeaveE from "./components/LeaveE";
import LeaveApplicationE from "./components/LeaveApplicationE";
import ManageClientE from "./components/ManageClientE";
import AddEmp from "./components/AddEmp";
import EditEmpa from "./components/EditEmpa";

import AddClientA from "./components/AddClientA";
import AddClientE from "./components/AddClientE";
import EditClientA from "./components/EditClientA";
import EditClientE from "./components/EditClientE";
import ClientDocs from "./components/ClientDocs";


import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginforma" element={<LoginformA />} />
        <Route path="/loginforme" element={<LoginformE />} />
        <Route path="/loginformc" element={<LoginformC />} />



        <Route
          path="/homea"
          element={
            <PrivateRoute>
              <HomeA />
            </PrivateRoute>

         
          }
        >
          <Route path="" element={<ProfileA />} />
          <Route path="/homea/manageempa" element={<ManageEmpA />} />
          <Route path="/homea/attendancea" element={<AttendanceA />} />
          <Route path="/homea/overtimea" element={<OvertimeA />} />
          <Route path="/homea/taska" element={<TaskA />} />
          <Route path="/homea/leavea" element={<LeaveA />} />
          <Route path="/homea/checkleave/:id" element={<CheckLeave />} /> 
          <Route path="/homea/addempa" element={<AddEmp />} />
          <Route path="/homea/editempa/:uid" element={<EditEmpa />} />
          <Route path="/homea/monthlyattendancea" element={<MonthAttendanceA />} />
          <Route path="/homea/reimba" element={<ReimbursementA />} />
          <Route path="/homea/checkreimb/:id" element={<CheckReimb />} />
          <Route path="/homea//gst-applications" element={<GstApplications />} />
          <Route path="/homea/editclient/:uid" element={<EditClientA />} />
          <Route path="/homea/clientdocs/:uid" element={<ClientDocs />} />

          <Route path="/homea/manageclienta" element={
            <ManageClientA />
            
            } />
          <Route path="/homea/addclienta" element={<AddClientA />} />
          <Route
            path="/homea/manageinventorya"
            element={<ManageInventoryA />}
          />
        </Route>

        <Route
          path="/homee"
          element={
            <PrivateRoute>
              <HomeE />
            </PrivateRoute>

          
          }
        >
          <Route path="" element={<ProfileE />} />
          <Route path="/homee/taske/:uid" element={<TaskE />} />
          <Route path="/homee/attendance/:uid" element={<AttendanceE />} />
          <Route path="/homee/overtime" element={<Overtime />} />
          <Route path="/homee/reimbursemente" element={<ReimbursementE />} />
          <Route path="/homee/viewreimbe" element={<ViewReimbE />} />
          <Route path="/homee/editreimb/:id" element={<EditReimb />} />
          <Route path="/homee/managecliente" element={<ManageClientE />} />
          <Route path="/homee/addcliente" element={<AddClientE />} />
          <Route path="/homee/editcliente/:uid" element={<EditClientE />} />  
          <Route path="/homee/clientdocs/:uid" element={<ClientDocs />} />        
          <Route path="/homee/leavee" element={<LeaveE />} />
          <Route path="/homee/leaveapplication" element={<LeaveApplicationE />} />
        </Route>

        <Route
          path="/homec"
          element={
            <PrivateRoute>
              <HomeC />
            </PrivateRoute>
          }
        >
          <Route path="" element={<ProfileC />} />
          <Route path="/homec/checkupdc" element={<CheckUpdC />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;