import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import ABCVideo from "../../assets/highquality.mp4";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    try {
      navigate("/home");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  return (
    <div className="landing-container" style={{ position: "relative" }}>
      <video autoPlay muted loop className="background-video">
        <source src={ABCVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="logo">NeuroScan</div>

      <div className="content">{/* Optional descriptive text */}</div>

      <button className="go-ahead-button" onClick={handleNavigation}>
        Begin Analysis →
      </button>
    </div>
  );
};

export default LandingPage;
