import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import supabase from "../Signup/supabaseClient";
import "./Login.css";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().oneOf(["user", "developer"], "Invalid role").required("Role is required"),
});

const Login = ({ onClose, initialRole = "user", onSignupClick }) => {
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch 
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { role: initialRole }
  });

  const currentRole = watch("role");

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const verifyUserRole = async (email, role) => {
    const table = role === "developer" ? "developers" : "users";
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("email", email)
      .single();

    return !error && data;
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setServerError("");

    try {
      // Verify user exists in correct role table
      const isValidRole = await verifyUserRole(formData.email, formData.role);
      if (!isValidRole) {
        setServerError(`Email not registered as ${formData.role}`);
        return;
      }

      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      if (!data.session) throw new Error("No session found");

      // Store session data
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", formData.role);

      onClose();
      navigate(formData.role === "developer" ? "/developer-dashboard" : "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleForgotPassword = async () => {
  //   if (!contactInfo) return setMessage("Please enter your email");
    
  //   setMessage("Sending reset instructions...");
  //   const { error } = await supabase.auth.resetPasswordForEmail(contactInfo, {
  //     redirectTo: "https://yourdomain.com/reset-password",
  //   });

  //   setMessage(error?.message || "Reset email sent!");
  //   setTimeout(() => {
  //     setShowForgotModal(false);
  //     setContactInfo("");
  //     setMessage("");
  //   }, 3000);
  // };
const handleForgotPassword = async () => {
    if (!contactInfo) return setMessage("Please enter your email");
    
    setMessage("Sending reset instructions...");
    
    // Make sure this URL matches your actual domain and route
    const resetUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(contactInfo, {
      redirectTo: resetUrl,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Reset email sent! Check your inbox and click the link to reset your password.");
    }
    
    setTimeout(() => {
      setShowForgotModal(false);
      setContactInfo("");
      setMessage("");
    }, 5000); // Increased timeout to give user time to read success message
  };
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1 className="login-title">Login</h1>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-button ${currentRole === "user" ? "active-tab" : ""}`}
            onClick={() => setValue("role", "user")}
            type="button"
          >
            User
          </button>
          <button
            className={`tab-button ${currentRole === "developer" ? "active-tab" : ""}`}
            onClick={() => setValue("role", "developer")}
            type="button"
          >
            Developer
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input
              {...register("email")}
              type="email"
              className="login-input"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              {...register("password")}
              type="password"
              className="login-input"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <input type="hidden" {...register("role")} />

          {serverError && <p className="error-message">{serverError}</p>}

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : `Log in as ${currentRole}`}
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
