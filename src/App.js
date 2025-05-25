import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Home from "./components/home/home";
import Login from "./components/login/Login";
import RoleSelection from "./components/Signup/RoleSelection";
import ResetPasswordForm from './components/ResetPasswordForm';
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import UploadThroughPacs from "./components/upload/UploadThroughPacs";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roleselect" element={<RoleSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-pacs" element={<UploadThroughPacs />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
