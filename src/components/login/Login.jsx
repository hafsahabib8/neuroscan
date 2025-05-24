import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onClose, initialRole = "user", onSignupClick }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: initialRole,
  });
  const [errors, setErrors] = useState({});

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!["user", "developer"].includes(formData.role)) {
      newErrors.role = "Invalid role";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", formData.role);
      localStorage.setItem("isLoggedIn", "true");
      onClose();
      navigate(formData.role === "developer" ? "/developer-dashboard" : "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!contactInfo || !/\S+@\S+\.\S+/.test(contactInfo)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setMessage("Sending reset email...");
    setTimeout(() => {
      setMessage("Reset link sent!");
      setTimeout(() => {
        setShowForgotModal(false);
        setContactInfo("");
        setMessage("");
      }, 2000);
    }, 1000);
  };

  const handleCloseModal = () => {
    onClose?.(); // Trigger parent onClose if needed
    navigate("/home"); // Navigate back to home
  };

  return (
    <div className="login-modal-overlay" onClick={handleCloseModal}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1 className="login-title">Login</h1>
          <button className="modal-close-btn" onClick={handleCloseModal}>
            &times;
          </button>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-button ${formData.role === "user" ? "active-tab" : ""}`}
            onClick={() => handleRoleChange("user")}
            type="button"
          >
            User
          </button>
          <button
            className={`tab-button ${formData.role === "developer" ? "active-tab" : ""}`}
            onClick={() => handleRoleChange("developer")}
            type="button"
          >
            Developer
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="login-input"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : `Log in as ${formData.role}`}
          </button>
        </form>

        <div className="login-footer">
          <span className="link-button" onClick={onSignupClick}>
            Create an account
          </span>
          <span className="link-button" onClick={() => setShowForgotModal(true)}>
            Forgot Password?
          </span>
        </div>
      </div>

      {showForgotModal && (
        <div className="inner-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="modal-input"
            />
            <button onClick={handleForgotPassword} className="modal-button">
              Send Reset Link
            </button>
            {message && <p className="modal-message">{message}</p>}
            <button className="modal-close" onClick={() => setShowForgotModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
