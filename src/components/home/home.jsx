// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import emailjs from "@emailjs/browser"; // <-- Add this import!
// import "./home.css";
// import image from "../../assets/brain.jpg";
// import Login from "../login/Login";
// import RoleSelection from "../Signup/RoleSelection";
// import InfoModal from "../infopage/info";
// import newvid from "../../assets/neurologo.gif";
// import childlogo from "../../assets/logo.png";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);

//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [statusMessage, setStatusMessage] = useState("");

//   useEffect(() => {
//     const sections = document.querySelectorAll(".fade-in-section");
//     const options = { threshold: 0.1 };
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add("visible");
//         }
//       });
//     }, options);
//     sections.forEach((section) => observer.observe(section));
//     return () => {
//       sections.forEach((section) => observer.unobserve(section));
//     };
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!formData.name || !formData.email || !formData.message) {
//       setStatusMessage("Please fill in all fields.");
//       return;
//     }

//     emailjs
//       .send(
//         "service_3u4cvnj", // Your EmailJS service ID
//         "template_mdufmpe", // Your EmailJS template ID
//         {
//           name: formData.name, // matches {{name}} in template
//           time: new Date().toLocaleString(), // matches {{time}} in template
//           message: formData.message, // matches {{message}} in template
//         },
//         "S_2jb5_j4OJ31t74U" // Your EmailJS public key
//       )
//       .then(
//         () => {
//           setStatusMessage("Message sent successfully!");
//           setFormData({ name: "", email: "", message: "" });
//         },
//         (error) => {
//           setStatusMessage("Failed to send message. Please try again later.");
//           console.error("EmailJS error:", error);
//         }
//       );
//   };

//   return (
//     <div className="home-container">
//       {/* Background blobs */}
//       <div className="blob blob1"></div>
//       <div className="blob blob2"></div>

//       {/* Navigation */}
//       <nav className="navbar">
//         <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
//           <div
//             className="logo"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               cursor: "pointer",
//             }}
//           >
//             <img
//               src={newvid}
//               alt="NeuroScan Logo"
//               style={{ height: "60px", width: "40px", objectFit: "contain" }}
//             />
//             <span style={{ fontSize: "25px", fontWeight: "bold" }}>
//               NeuroScan
//             </span>
//           </div>
//         </Link>
//         <ul className="nav-links">
//           <li>
//             <a href="#home" className="active">
//               Home
//             </a>
//           </li>
//           <li>
//             <a
//               href="#info"
//               className="info-link"
//               onClick={(e) => {
//                 e.preventDefault(); // Prevent normal anchor navigation
//                 setShowModal(true);
//               }}
//             >
//               Info
//             </a>
//           </li>
//           <li>
//             <a href="#about">About</a>
//           </li>
//           <li>
//             <a href="#contact">Contact</a>
//           </li>
//           <li>
//             <button
//               className="btn login-btn"
//               onClick={() => setShowLoginModal(true)}
//             >
//               <svg
//                 className="icon"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M15 3h4a2 2 0 0 1 2 2v4" />
//                 <path d="M10 14L21 3" />
//                 <path d="M21 21v-6" />
//               </svg>
//               Login
//             </button>
//           </li>
//           <li>
//             <button
//               className="btn signup-btn"
//               onClick={() => navigate("/roleselect")}
//             >
//               <svg
//                 className="icon"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//               Sign Up
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Hero Section */}
//       <header id="home" className="hero-section fade-in-section">
//         <div className="hero-text">
//           <h1>Revolutionizing Brain Image Analysis</h1>
//           <p>
//             Advanced AI-powered tool to detect and segment brain tumors with
//             precision and ease.
//           </p>
//           <button
//             className="btn primary-btn"
//             onClick={() => setShowLoginModal(true)}
//           >
//             Get Started
//             <svg
//               className="icon-arrow"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#fff"
//               strokeWidth="3"
//             >
//               <line x1="5" y1="12" x2="19" y2="12"></line>
//               <polyline points="12 5 19 12 12 19"></polyline>
//             </svg>
//           </button>
//         </div>
//         <div className="hero-image">
//           <img src={image} alt="Brain scan" />
//         </div>
//       </header>
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
//       />
//       {/* About Section */}
//       <section id="about" className="about-section fade-in-section">
//         <h2>About NeuroScan</h2>
//         <p>
//         Neuroscan simplifies and speeds up brain tumor detection using deep learning. 
//         By analyzing MRI scans quickly and accurately, it supports healthcare professionals with a reliable second opinion. 
//         With PACS integration and an easy-to-use interface, it fits smoothly into hospital workflows—helping improve diagnoses and patient care.
//         </p>
//         <div className="features-grid">
//           <FeatureCard
//             icon={
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#0ebeff"
//                 strokeWidth="2"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M8 12l2 2 4-4" />
//               </svg>
//             }
//             title="High accuracy segmentation"
//           />
//           <FeatureCard
//             icon={
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#0ebeff"
//                 strokeWidth="2"
//               >
//                 <path d="M3 12l2-2 4 4 8-8 2 2-10 10z" />
//               </svg>
//             }
//             title="Interactive 3D visualization"
//           />
//           <FeatureCard
//             icon={
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#0ebeff"
//                 strokeWidth="2"
//               >
//                 <path d="M21 16V8a2 2 0 0 0-2-2H7l-4 4v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" />
//                 <path d="M3 12h4" />
//               </svg>
//             }
//             title="PACS Integration"
//           />
//           <FeatureCard
//             icon={
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#0ebeff"
//                 strokeWidth="2"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="12" y1="8" x2="12" y2="12" />
//                 <line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//             }
//             title="User-friendly interface"
//           />
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="contact-section fade-in-section">
//         <div className="bg-layer"></div>
//         <h2>Contact Us</h2>
//         <form onSubmit={handleSubmit} className="contact-form" noValidate>
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Your full name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="your.email@example.com"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="message">Message</label>
//           <textarea
//             id="message"
//             name="message"
//             placeholder="Write your message here..."
//             value={formData.message}
//             onChange={handleChange}
//             rows="5"
//             required
//           />
//           <button type="submit" className="btn primary-btn">
//             Send Message
//           </button>
//         </form>
//         {statusMessage && <p className="status-message">{statusMessage}</p>}
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-section about">
//             <h3>NeuroScan</h3>
//             <p>
//               A brain image segmentation tool that helps users detect tumors
//               from medical scans. Empowering health through AI.
//             </p>
//           </div>
//           <div className="footer-section links">
//             <h4>Quick Links</h4>
//             <ul>
//               <li>
//                 <a href="/home">Home</a>
//               </li>
//               <li>
//                 <a href="#about">About</a>
//               </li>
//               <li>
//                 <a href="#contact">Contact</a>
//               </li>
//             </ul>
//           </div>
//           <div className="footer-section team">
//             <h4>Team</h4>
//             <ul>
//               <li>
//                 <a
//                   href="https://github.com/hafsaahabib"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <i className="fab fa-github"></i> Hafsa
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://github.com/malaika-s27"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <i className="fab fa-github"></i> Malaika
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="https://github.com/AqsaSyed01"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <i className="fab fa-github"></i> Aqsa
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div className="footer-section contact">
//             <h4>Contact Us</h4>
//             <ul>
//               <li>
//                 <i className="fas fa-envelope"></i> info@neuroscan.ai
//               </li>
//               <li>
//                 <i className="fas fa-map-marker-alt"></i> Islamabad, Pakistan
//               </li>
//               <li>
//                 <i className="fab fa-github"></i>{" "}
//                 <a
//                   href="https://github.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   github.com/neuroscan
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p>
//             © NeuroScan powered by{" "}
//             <img
//               src={childlogo}
//               alt="Powered by Logo"
//               className="powered-by-logo"
//             />
//           </p>
//         </div>
//       </footer>

//       {showModal && <InfoModal onClose={() => setShowModal(false)} />}
//       {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title }) => (
//   <div className="feature-card">
//     <div className="feature-icon">{icon}</div>
//     <h3>{title}</h3>
//   </div>
// );

// export default Home;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./home.css";
import image from "../../assets/brain.jpg";
import newvid from "../../assets/neurologo.gif";
import InfoModal from "../infopage/info";

const FeatureCard = ({ icon, title }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
  </div>
);

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
          email: formData.email,
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
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <nav className="navbar">
        <Link to="/home" className="logo">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <img src={newvid} alt="NeuroScan Logo" style={{ height: "60px", width: "40px", objectFit: "contain" }} />
            <span style={{ fontSize: "25px", fontWeight: "bold" }}>NeuroScan</span>
          </div>
        </Link>
        <ul className="nav-links">
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#info" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Info</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button className="btn login-btn" onClick={handleLoginClick}>
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </li>
          {!isLoggedIn && (
            <li>
              <button className="btn signup-btn" onClick={() => navigate("/roleselect")}>
                Sign Up
              </button>
            </li>
          )}
        </ul>
      </nav>

      <header id="home" className="hero-section fade-in-section">
        <div className="hero-text">
          <h1>Revolutionizing Brain Image Analysis</h1>
          <p>
            Advanced AI-powered tool to detect and segment brain tumors with precision and ease.
          </p>
          <button className="btn primary-btn" onClick={() => setShowLoginModal(true)}>
            Get Started
            <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        <div className="hero-image">
          <img src={image} alt="Brain scan" />
        </div>
      </header>

      <section id="about" className="about-section fade-in-section">
        <h2>About NeuroScan</h2>
        <p>
          NeuroScan simplifies and speeds up brain tumor detection using deep learning.
          By analyzing MRI scans quickly and accurately, it supports healthcare professionals with a reliable second opinion.
          With PACS integration and an easy-to-use interface, it fits smoothly into hospital workflows—helping improve diagnoses and patient care.
        </p>
        <div className="features-grid">
          <FeatureCard title="High accuracy segmentation" icon={<svg viewBox="0 0 24 24" stroke="#0ebeff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>} />
          <FeatureCard title="Interactive 3D visualization" icon={<svg viewBox="0 0 24 24" stroke="#0ebeff" strokeWidth="2"><path d="M3 12l2-2 4 4 8-8 2 2-10 10z" /></svg>} />
          <FeatureCard title="PACS Integration" icon={<svg viewBox="0 0 24 24" stroke="#0ebeff" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-2-2H7l-4 4v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" /><path d="M3 12h4" /></svg>} />
          <FeatureCard title="User-friendly interface" icon={<svg viewBox="0 0 24 24" stroke="#0ebeff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>} />
        </div>
      </section>

      <section id="contact" className="contact-section fade-in-section">
        <div className="bg-layer"></div>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
          <label htmlFor="message">Message</label>
          <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Write your message here..." required />
          <button type="submit" className="btn primary-btn">Send Message</button>
        </form>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>NeuroScan</h3>
            <p>A brain image segmentation tool that helps users detect tumors from medical scans. Empowering health through AI.</p>
          </div>
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NeuroScan. All rights reserved.</p>
        </div>
      </footer>

      {showModal && <InfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;

