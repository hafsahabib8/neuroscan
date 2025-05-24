import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import supabase from "./supabaseClient";

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
  const [approvedEmails, setApprovedEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch approved emails when component mounts
  useEffect(() => {
    const fetchApprovedEmails = async () => {
      try {
        if (role === "developer") {
          const { data, error } = await supabase
            .from("approved_developer_emails")
            .select("email");

          if (error) {
            console.error("Error fetching approved emails:", error);
            setServerError("Error fetching approved developer emails. Please try again later.");
            return;
          }

          // Make sure data exists before mapping
          if (data && Array.isArray(data)) {
            const emails = data.map((item) => item.email);
            setApprovedEmails(emails);
          } else {
            console.error("No data returned for approved emails");
            setApprovedEmails([]);
          }
        }
      } catch (error) {
        console.error("Error fetching approved emails:", error);
        setServerError("Error connecting to the server. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedEmails();
  }, [role]);

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
    // Clear errors for this field when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
    // Clear server errors when user modifies any field
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.role === "developer") {
      if (approvedEmails.length > 0 && !approvedEmails.includes(formData.email)) {
        newErrors.email =
          "This is not a recognized developer email. Please use an approved work email.";
      }
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        setServerError(authError.message || "Authentication failed");
        return;
      }

      if (!authData || !authData.user) {
        console.error("No user data returned from signUp");
        setServerError("Failed to create account. Please try again.");
        return;
      }

      // Step 2: Add user to the appropriate table based on role
      if (formData.role === "user") {
        // Insert into users table with the correct schema columns
        const { error: profileError } = await supabase.from("users").insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password, // Note: In a real app, don't store plaintext passwords
          },
        ]);

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          setServerError("Error creating user profile. Please try again.");
          
          // Clean up the auth entry if profile creation fails
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error("Error during cleanup:", e);
          }
          
          return;
        }

        alert("Signup successful! You can now login.");
      } else if (formData.role === "developer") {
        // Check if email is in the approved list
        if (approvedEmails.includes(formData.email)) {
          // Add to developers table
          const { error: devError } = await supabase.from("developers").insert([
            {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              password: formData.password, // Note: In a real app, don't store plaintext passwords
              approved: true
            },
          ]);

          if (devError) {
            console.error("Error creating developer profile:", devError);
            setServerError("Error creating developer profile. Please try again.");
            
            // Clean up the auth entry if profile creation fails
            try {
              await supabase.auth.signOut();
            } catch (e) {
              console.error("Error during cleanup:", e);
            }
            
            return;
          }
          
          alert("Developer account created successfully! You can now login.");
        } else {
          // Create pending request if not on approved list
          const { error: devRequestError } = await supabase
            .from("developer_requests")
            .insert([
              {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                status: "pending",
              },
            ]);

          if (devRequestError) {
            console.error("Error creating developer request:", devRequestError);
            setServerError("Error submitting developer request. Please try again.");
            
            // Clean up the auth entry if profile creation fails
            try {
              await supabase.auth.signOut();
            } catch (e) {
              console.error("Error during cleanup:", e);
            }
            
            return;
          }

          alert("Developer registration submitted! Your account is pending approval.");
        }
      }

      // Step 3: Navigate appropriately after successful signup
      if (onClose && onLoginClick) {
        onClose();
        onLoginClick();
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setServerError("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalContainerClick = (e) => {
    if (e.target.className === "signup-modal-container") {
      onClose();
    }
  };

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    if (onClose && onLoginClick) {
      onClose();
      onLoginClick();
    } else {
      navigate("/login");
    }
  };

  if (role === "developer" && isLoading) {
    return (
      <div className="signup-modal-container" onClick={handleModalContainerClick}>
        <div className="create-account-modal">
          <div className="close-button" onClick={onClose}>
            ×
          </div>
          <h1 className="create-account-title">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-modal-container" onClick={handleModalContainerClick}>
      <div className="create-account-modal">
        <div className="close-button" onClick={onClose}>
          ×
        </div>
        <h1 className="create-account-title">
          {role === "developer" ? "Developer Registration" : "Create Account"}
        </h1>
        {role === "developer" && (
          <p className="developer-info">
            Developer access is restricted to approved email addresses only.
          </p>
        )}
        <form className="create-account-form" onSubmit={handleSignup}>
          <div className="input-row">
            <div className="input-wrapper">
              <label htmlFor="firstName" className="input-label">
                First Name
              </label>
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
              <label htmlFor="lastName" className="input-label">
                Last Name
              </label>
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
            <label htmlFor="password" className="input-label">
              Password
            </label>
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
