import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import backgroundVideo from "../../assets/highquality.mp4";
import Layout from "../Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user details from localStorage
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (!email || !role) {
      navigate("/login");
    } else {
      setUser({ first_name: firstName || "User", last_name: lastName || "" });
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/home");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Background Video */}
        <video className="background-video" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hamburger / Dropdown Menu */}
        <div className="hamburger-container" ref={dropdownRef}>
          <div className="hamburger-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <div className="dashboard-content">
          <h1 className="user-name">
            Hi, {user ? `${user.first_name} ${user.last_name}` : "Welcome!"}
          </h1>
        </div>

        {/* Upload Buttons */}
        <div className="dashboard-button-container">
          <button className="upload-button" onClick={() => navigate("/segmentation")}>
            UPLOAD SCANS FROM DEVICE
          </button>
          <button className="upload-button pacs-button" onClick={() => navigate("/upload-pacs")}>
            UPLOAD SCANS THROUGH PACS
          </button>
        </div>
      </div>

      {/* Brain Health Hero Section */}
      <div className="brain-health-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>🧠 Boost Your Brain Power!</h2>
            <ul>
              <li>Stay active – even a short walk helps.</li>
              <li>Fuel up on omega-3s and colorful veggies.</li>
              <li>Sleep 7–9 hours for memory + focus.</li>
              <li>Learn, play games, and stay curious!</li>
              <li>Connect with people – it sharpens thinking.</li>
              <li>Laugh, relax, and manage stress well.</li>
            </ul>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
