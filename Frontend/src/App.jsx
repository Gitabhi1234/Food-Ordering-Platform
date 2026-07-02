import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'

import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import AdminHome from './pages/AdminHome'
import AdminHome1 from './pages/AdminHome1' 
import AdminProtectWrapper from './pages/AdminProtectWrapper'
import Home from './pages/Home'
import UserHome from './pages/UserHome'
import UserProfille from './pages/UserProfile'

import AdminDashboard from './pages/AdminDashboard'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/Admin-login" element={<AdminLogin />} />
        <Route path="/Admin-signup" element={<AdminSignup />} />
        <Route
          path="/user-home"
          element={
            <UserProtectWrapper>
              <UserHome/>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home/>
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
          path="/Admin-home1"
          element={
            <AdminProtectWrapper>
              <AdminHome1 />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/Admin-home"
          element={
            <AdminProtectWrapper>
              <AdminHome />
            </AdminProtectWrapper>
          }
        />
        <Route
            path= "/user-home/user-profile"
          element={
            <UserProtectWrapper>
              <UserProfille />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/Admin-dashboard"
          element={
            <AdminProtectWrapper>
              <AdminDashboard />
            </AdminProtectWrapper>
          }
        />
       
      </Routes>
    </div>
  );
}

export default App;
