import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./Signup/supabaseClient";
import "./ResetPasswordForm.css";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupSession = async () => {
      try {
        // First, check if we have URL hash parameters (from email link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (access_token && refresh_token) {
          console.log("Found tokens in URL hash, setting session...");
          const { error } = await supabase.auth.setSession({ 
            access_token, 
            refresh_token 
          });
          
          if (error) {
            console.error("Session set error:", error.message);
            setMessage("Failed to authenticate session: " + error.message);
          } else {
            console.log("Session set successfully");
            setSessionReady(true);
          }
        } else {
          // Check if we already have an active session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Get session error:", error);
            setMessage("Failed to get session: " + error.message);
          } else if (session) {
            console.log("Found existing session");
            setSessionReady(true);
          } else {
            console.log("No valid session or tokens found");
            setMessage("Invalid or missing reset token. Please request a new password reset.");
          }
        }
      } catch (err) {
        console.error("Setup session error:", err);
        setMessage("An error occurred while setting up the session.");
      } finally {
        setIsLoading(false);
      }
    };

    setupSession();
  }, []);

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // 1. Update password in Supabase auth.users
      const { error: authError } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (authError) {
        console.error("Supabase auth update error:", authError);
        setMessage("Failed to update password: " + authError.message);
        return;
      }

      // 2. Get current user to get their email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Failed to get user session.");
        return;
      }

      // 3. OPTIONAL: Update password in your own custom 'users' table
      // NOTE: Not recommended to store passwords in plain text!
      // Consider removing this section for security
      const { error: dbError } = await supabase
        .from("users")
        .update({ password: newPassword }) // This is not secure!
        .eq("email", user.email);

      if (dbError) {
        console.error("Custom users table update error:", dbError);
        // Don't fail the whole process if custom table update fails
        console.warn("Password updated in auth, but failed in users table.");
      }

      setMessage("✅ Password updated successfully! Redirecting to login...");
      
      // Sign out the user after password reset for security
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate("/home"); // or wherever you want to redirect after reset
      }, 2000);

    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h2>Reset Your Password</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>

        {sessionReady ? (
          <div className="reset-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="reset-input"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="reset-input"
                placeholder="Confirm new password"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={isSubmitting}
              className="reset-button"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        ) : (
          <div className="reset-error">
            <p>{message || "No valid reset token found."}</p>
            <div className="error-actions">
              <button 
                onClick={() => navigate("/home")} 
                className="reset-button secondary"
              >
                Back to Home
              </button>
              <button 
                onClick={() => window.location.href = '/home'} 
                className="reset-button secondary"
                style={{ marginLeft: '10px' }}
              >
                Request New Reset
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className={`reset-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
