import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import childlogo from "../assets/logo.png";
import "./home/home.css"; 
import Home from "./home/home";
import newvid from "../assets/neurologo.gif";

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
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <img
              src={newvid}
              alt="NeuroScan Logo"
              style={{ height: "60px", width: "40px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "25px", fontWeight: "bold" }}>
              NeuroScan
            </span>
          </div>
        </Link>

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
      {/* Footer */}
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
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section team">
            <h4>Team</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/hafsaahabib"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> Hafsa
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/malaika-s27"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> Malaika
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AqsaSyed01"
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
                <i className="fas fa-map-marker-alt"></i> Islamabad, Pakistan
              </li>
              <li>
                <i className="fab fa-github"></i>{" "}
                <a
                  href="https://github.com"
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
          <p>
            © NeuroScan powered by{" "}
            <img
              src={childlogo}
              alt="Powered by Logo"
              className="powered-by-logo"
            />
          </p>
        </div>
      </footer>
      {showModal && <InfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Layout;
