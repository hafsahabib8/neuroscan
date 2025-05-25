// export default ResetPasswordForm;
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
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          console.error("Session set error:", error.message);
          setMessage("Failed to authenticate session.");
        } else {
          setSessionReady(true);
        }
      });
    } else {
      setMessage("Invalid or missing reset token.");
    }
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
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });

      if (authError) {
        console.error("Supabase auth update error:", authError);
        setMessage("Failed to update Supabase password: " + authError.message);
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
      const { error: dbError } = await supabase
        .from("users")
        .update({ password: newPassword })
        .eq("email", user.email);

      if (dbError) {
        console.error("Custom users table update error:", dbError);
        setMessage("Password updated in auth, but failed in users table.");
      } else {
        setMessage("✅ Password updated successfully. Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <button onClick={() => navigate("/home")} className="reset-button secondary">
              Back to Home
            </button>
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
