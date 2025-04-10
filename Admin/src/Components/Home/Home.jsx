import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from '../Header/Header';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import AllCategory from '../../Pages/CreateTeam/AllCategory';
import AddCategory from '../../Pages/CreateTeam/AddCategory';
import EditCategory from '../../Pages/CreateTeam/EditCategory';
import AllTags from '../../Pages/UploadTask/AllTags';
import AddTag from '../../Pages/UploadTask/AddTag';
import EditTag from '../../Pages/UploadTask/EditTag';
import AllUsers from '../../Pages/BackendUsers/AllUsers';
import TeamLeaderSingup from '../TeamLeaderSignup/TeamLeaderSingup';
import BackendSingup from '../BackendSingup/BackendSingup';
import FieldSignup from '../FieldSignup/FieldSignup';
import TeamUsers from '../../Pages/TeamLeaderUsers/TeamUsers';
import FieldUsers from '../../Pages/FieldExcutiveUsers/FieldUsers';
import Login from '../auth/Login';
import AllPendingTask from '../../Pages/PendingTask/AllPendingTask';
import AllCompleteTask from '../../Pages/CompleteTask/AllCompleteTask';
import AllTeamLeaderTask from '../../Pages/TeamLeaderTask/AllTeamLeaderTask';
import AdminPendingTask from '../../Pages/AdminPendeingTask/AdminPendingTask';

const Home = () => {
  const isLoggedIn = sessionStorage.getItem("login"); // Check if user is logged in

  return (
    <>
      {isLoggedIn ? ( // If logged in, show the header and routes
        <>
          <Header />
          <div className="rightside">
            <Routes>
              <Route path={"/dashboard"} element={<Dashboard />} />

              {/* Category */}
              <Route path={"/all-team"} element={<AllCategory />} />
              <Route path={"/add-team"} element={<AddCategory />} />
              <Route path={"/edit-category/:id"} element={<EditCategory />} />


              {/* Orders */}
              <Route path={"/all-backend-users"} element={<AllUsers />} />
              <Route path={"/all-team-users"} element={<TeamUsers />} />
              <Route path={"/all-field-users"} element={<FieldUsers />} />

              {/* Tags */}
              <Route path={"/all-task"} element={<AllTags />} />
              <Route path={"/add-task"} element={<AddTag />} />
              <Route path={"/edit-task/:id"} element={<EditTag />} />


              {/* Signup Routes */}
              <Route path='/team-leader-account' element={<TeamLeaderSingup />} />
              <Route path='/backend-account' element={<BackendSingup />} />
              <Route path='/field-excutive-account' element={<FieldSignup />} />


              <Route path='/all-unverify-task' element={<AllPendingTask/>} />

              <Route path='/all-complete-task' element={<AllCompleteTask/>} />

              <Route path='/all-pending-task-backend' element={<AllTeamLeaderTask/>} />
              
              <Route path='/all-pending-task-admin' element={<AdminPendingTask/>} />





              {/* Fallback to dashboard if route is not found */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </>
      ) : ( // If not logged in, show the Login component
        <Login />
      )}
    </>
  );
};

export default Home;
