import React, { useState } from "react";
import Signup from "./Signup";
import Login from "../login/Login";
import Layout from "../Layout";
import "./RoleSelection.css";

const RoleSelection = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [showLogin, setShowLogin] = useState(false);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowSignup(true);
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  return (
    <>
      {/* Main content with blur when signup or login modal is open */}
      <div className={showSignup || showLogin ? "content-blurred" : ""}>
        <Navigation hideAuthButtons={true} />

        <div className="role-selection-container">
          <h1 className="role-selection-title">How do you want to get started?</h1>
          <p className="role-selection-subtitle">
            Select the option that best describes your goal.
          </p>

          <div className="role-card-wrapper-horizontal">
            <div
              className="role-card upwork-style"
              onClick={() => handleRoleSelection("user")}
            >
              <h2>I'm a User</h2>
              <p>I want to use this Web Application to detect tumors from my Scans</p>
            </div>

            <div
              className="role-card upwork-style"
              onClick={() => handleRoleSelection("developer")}
            >
              <h2>I'm a Developer</h2>
              <p>I want to join as a developer and offer my expertise.</p>
            </div>
          </div>
        </div>

     
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <Signup
          onClose={handleCloseSignup}
          initialRole={selectedRole}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={(role = "user") => {
            setShowLogin(false);
            setSelectedRole(role);
            setShowSignup(true);
          }}
        />
      )}
    </>
  );
};

export default RoleSelection;
