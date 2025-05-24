import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = ({ onClose, initialRole = "user", onLoginClick }) => {
  const navigate = useNavigate();
  const role = initialRole || "user";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: role,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      alert("Frontend Signup simulation successful! 🚀");
      setIsSubmitting(false);
      onClose?.();
      onLoginClick?.();
    }, 1000);
  };

  const handleModalContainerClick = (e) => {
    if (e.target.className === "signup-modal-container") {
      onClose();
    }
  };

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    onClose?.();
    onLoginClick?.();
  };

  return (
    <div className="signup-modal-container" onClick={handleModalContainerClick}>
      <div className="create-account-modal">
        <div className="close-button" onClick={onClose}>×</div>
        <h1 className="create-account-title">
          {role === "developer" ? "Developer Registration" : "Create Account"}
        </h1>
        {role === "developer" && (
          <p className="developer-info">
            Developer access is typically restricted to approved emails.
          </p>
        )}
        <form className="create-account-form" onSubmit={handleSignup}>
          <div className="input-row">
            <div className="input-wrapper">
              <label htmlFor="firstName" className="input-label">First Name</label>
              <input
                type="text"
                id="firstName"
                className={`input-field ${errors.firstName ? "error-field" : ""}`}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="input-wrapper">
              <label htmlFor="lastName" className="input-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                className={`input-field ${errors.lastName ? "error-field" : ""}`}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="email" className="input-label">
              {role === "developer" ? "Work Email" : "Email"}
            </label>
            <input
              type="email"
              id="email"
              className={`input-field ${errors.email ? "error-field" : ""}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              className={`input-field ${errors.password ? "error-field" : ""}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : role === "developer"
              ? "Register as Developer"
              : "Create Account"}
          </button>
        </form>
        <p className="login-text">
          Already have an account?{" "}
          <a href="#" onClick={handleLoginLinkClick}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
