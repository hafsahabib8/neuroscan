import React, { useState } from "react";
import "./info.css";

const InfoModal = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState("symptoms");

  const renderContent = () => {
    switch (selectedTab) {
      case "symptoms":
        return (
          <ul>
            <li>Frequent and severe headaches</li>
            <li>Blurred or double vision</li>
            <li>Seizures</li>
            <li>Nausea or vomiting</li>
            <li>Changes in speech or hearing</li>
            <li>Memory problems</li>
            <li>Unexplained mood changes</li>
            <li>Difficulty walking or balancing</li>
          </ul>
        );
      case "causes":
        return (
          <p>
            Brain tumors can be caused by genetic mutations, environmental exposures,
            or may arise without a known cause. Risk factors include family history,
            exposure to radiation, and certain inherited conditions.
          </p>
        );
      case "treatment":
        return (
          <p>
            Treatment options depend on tumor type, size, and location. Common
            treatments include surgery, radiation therapy, chemotherapy, and
            targeted drug therapy. Early detection improves outcomes.
          </p>
        );
      case "prevention":
        return (
          <p>
            While most brain tumors can not be prevented, reducing exposure to radiation,
            avoiding carcinogenic chemicals, and maintaining a healthy lifestyle can
            help reduce overall cancer risk.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>×</button>
        <h1 className="title">Brain Tumor Awareness</h1>
        <div className="tabs">
          <button className={selectedTab === "symptoms" ? "active" : ""} onClick={() => setSelectedTab("symptoms")}>Symptoms</button>
          <button className={selectedTab === "causes" ? "active" : ""} onClick={() => setSelectedTab("causes")}>Causes</button>
          <button className={selectedTab === "treatment" ? "active" : ""} onClick={() => setSelectedTab("treatment")}>Treatment</button>
          <button className={selectedTab === "prevention" ? "active" : ""} onClick={() => setSelectedTab("prevention")}>Prevention</button>
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InfoModal;
