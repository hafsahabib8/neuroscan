import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Home from "./components/home/home";
import Login from "./components/login/Login";
import RoleSelection from "./components/Signup/RoleSelection";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import UploadThroughPacs from "./components/upload/UploadThroughPacs";
import DeveloperDashboard from "./components/DeveloperDashboard/DevelopeDashboard";
import SegmentationApp from "./components/upload/SegmentationApp";
import InfoModal from "./components/infopage/info";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roleselect" element={<RoleSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/segmentation" element={<SegmentationApp />} />
        <Route path="/upload-pacs" element={<UploadThroughPacs />} />
        <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
        <Route path="/info" element={<BrainTumorInfoPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
