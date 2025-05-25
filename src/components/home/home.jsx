import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./home.css";
import image from "../../assets/brain.jpg";
import Login from "../login/Login";
import RoleSelection from "../Signup/RoleSelection";
import InfoModal from "../infopage/info";
import newvid from "../../assets/neurologo.gif";
import childlogo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, options);
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage("Please fill in all fields.");
      return;
    }

    emailjs
      .send(
        "service_3u4cvnj",
        "template_mdufmpe",
        {
          name: formData.name,
          time: new Date().toLocaleString(),
          message: formData.message,
        },
        "S_2jb5_j4OJ31t74U"
      )
      .then(
        () => {
          setStatusMessage("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          setStatusMessage("Failed to send message. Please try again later.");
          console.error("EmailJS error:", error);
        }
      );
  };

  return (
    <div className="home-container">
      {/* Background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

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
            <a href="#home" className="active">
              Home
            </a>
          </li>
          <li>
            <a
              href="#info"
              className="info-link"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              Info
            </a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <button
              className="btn login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                <path d="M10 14L21 3" />
                <path d="M21 21v-6" />
              </svg>
              Login
            </button>
          </li>
          <li>
            <button
              className="btn signup-btn"
              onClick={() => navigate("/roleselect")}
            >
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Sign Up
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section fade-in-section">
        <div className="hero-text">
          <h1>Revolutionizing Brain Image Analysis</h1>
          <p>
            Advanced AI-powered tool to detect and segment brain tumors with
            precision and ease.
          </p>
          <button
            className="btn primary-btn"
            onClick={() => setShowLoginModal(true)}
          >
            Get Started
            <svg
              className="icon-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
        <div className="hero-image">
          <img src={image} alt="Brain scan" />
        </div>
      </header>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <section id="about" className="about-section fade-in-section">
        <h2>About NeuroScan</h2>
        <p>
          NeuroScan is designed to make brain tumor detection faster and easier.
          Our platform uses advanced deep learning algorithms to analyze MRI
          scans and assist healthcare professionals in diagnosing brain tumors
          with greater speed and accuracy. We know that time is critical when it
          comes to medical diagnoses, which is why we created a tool that’s
          simple, quick, and reliable. Whether you're a radiologist or a
          healthcare provider, our user-friendly interface helps you upload MRI
          scans in seconds, process them effortlessly, and get detailed results
          in just moments. Our tool is built to integrate seamlessly into
          hospital workflows, with PACS support to directly fetch imaging data.
          It’s all about giving healthcare professionals a second opinion they
          can trust, enhancing decision-making, and ultimately improving patient
          care. At the heart of our work is a commitment to making medical
          imaging more accessible, so that doctors and researchers can focus on
          what matters most—saving lives.
        </p>
        <div className="features-grid">
          <FeatureCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ebeff"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
            }
            title="High accuracy segmentation"
          />
          <FeatureCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ebeff"
                strokeWidth="2"
              >
                <path d="M3 12l2-2 4 4 8-8 2 2-10 10z" />
              </svg>
            }
            title="Interactive 3D visualization"
          />
          <FeatureCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ebeff"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-2-2H7l-4 4v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" />
                <path d="M3 12h4" />
              </svg>
            }
            title="PACS Integration"
          />
          <FeatureCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ebeff"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
            title="User-friendly interface"
          />
        </div>
      </section>

      <section id="contact" className="contact-section fade-in-section">
        <div className="bg-layer"></div>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          />
          <button type="submit" className="btn primary-btn">
            Send Message
          </button>
        </form>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>NeuroScan</h3>
            <p style="text-align: justify;">
              A brain image analysis tool that helps users detect tumors from
              medical scans. Our aim is to make medical image diagnosis easier
              and faster with the power of AI.
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
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

const FeatureCard = ({ icon, title }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
  </div>
);

export default Home;
