import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import "./home/home.css"; // use your shared stylesheet
import Home from "./home/home";
import InfoModal from "./infopage/info"; 

const Layout = ({ children }) => {  
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();

  return (
    <div className="home-container">
      {/* Background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">NeuroScan</div>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/home">About</Link>
          </li>
          <li>
            <a
              href="#info"
              className="info-link"
              onClick={(e) => {
                e.preventDefault(); // Prevent normal anchor navigation
                setShowModal(true);
              }}
            >
              Info
            </a>
          </li>
          <li>
<Link style={{ color: "white" }}>......</Link>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>NeuroScan</h3>
            <p>
              A brain image segmentation tool that helps users detect tumors
              from medical scans. Empowering health through AI.
            </p>
          </div>

          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/home">About</a>
              </li>
              <li>
                <a href="/home">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section team">
            <h4>Team</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/hafsa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> Hafsa
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/malaika"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> Malaika
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/aqsa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> Aqsa
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <i className="fas fa-envelope"></i> info@neuroscan.ai
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i> Lahore, Pakistan
              </li>
              <li>
                <i className="fab fa-github"></i>{" "}
                <a
                  href="https://github.com/neuroscan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/neuroscan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 NeuroScan – All rights reserved.</p>
        </div>
      </footer>
            {showModal && <InfoModal onClose={() => setShowModal(false)} />}

    </div>
  );
};

export default Layout;
