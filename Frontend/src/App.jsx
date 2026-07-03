import React from "react";
import { Route, Routes } from "react-router-dom";

import Start from "./pages/Start";
import Home from "./pages/Home";

import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import UserHome from "./pages/UserHome";
import UserProfile from "./pages/UserProfile";
import UserLogout from "./pages/UserLogout";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import ConfirmOrder from "./components/ConfirmOrder";

import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminHome from "./pages/AdminHome";
import AdminHome1 from "./pages/AdminHome1";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectWrapper from "./pages/AdminProtectWrapper";

const App = () => {
  return (
    <Routes>

    

      <Route path="/" element={<Start />} />

      <Route path="/login" element={<UserLogin />} />

      <Route path="/signup" element={<UserSignup />} />

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin-signup" element={<AdminSignup />} />

   

      <Route
        path="/home"
        element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        }
      />

      <Route
        path="/user-home"
        element={
          <UserProtectWrapper>
            <UserHome />
          </UserProtectWrapper>
        }
      />

      <Route
        path="/user-profile"
        element={
          <UserProtectWrapper>
            <UserProfile />
          </UserProtectWrapper>
        }
      />

      <Route
        path="/user/logout"
        element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        }
      />


      <Route
        path="/admin-home1"
        element={
          <AdminProtectWrapper>
            <AdminHome1 />
          </AdminProtectWrapper>
        }
      />

      <Route
        path="/admin-home"
        element={
          <AdminProtectWrapper>
            <AdminHome />
          </AdminProtectWrapper>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectWrapper>
            <AdminDashboard />
          </AdminProtectWrapper>
        }
      />
     

    </Routes>
  );
};

export default App;