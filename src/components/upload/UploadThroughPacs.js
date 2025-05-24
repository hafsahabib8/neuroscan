
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import "./UploadThroughPacs.css";

const BACKEND_URL = "https://demouserpaglot-myspace.hf.space";

const UploadThroughPacs = () => {
  const [studies, setStudies] = useState([]);
  const [allStudies, setAllStudies] = useState([]);
  const [segmentationResults, setSegmentationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [segmenting, setSegmenting] = useState(false);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudies();
  }, []);

  useEffect(() => {
    const filtered = allStudies.filter((study) =>
      (study.PatientMainDicomTags?.PatientName || "unknown")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
    setStudies(filtered);
  }, [filterText, allStudies]);

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/studies`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error:", data);
        throw new Error(data.error || "Failed to fetch studies.");
      }

      setAllStudies(data);
      setStudies(data);
    } catch (error) {
      console.error("❌ Error fetching studies:", error);
      alert("Failed to fetch studies. Backend might not be connected to Orthanc.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSegment = async (studyId) => {
    setSegmenting(true);
    try {
      const seriesRes = await fetch(`${BACKEND_URL}/api/study/${studyId}/series`);
      const series = await seriesRes.json();
      if (!series.length) return alert("No series found for this study.");

      const instancesRes = await fetch(`${BACKEND_URL}/api/series/${series[0].ID}/instances`);
      const instances = await instancesRes.json();
      if (!instances.length) return alert("No instances found.");

      const instanceId = instances[0].ID;
      const segmentRes = await fetch(`${BACKEND_URL}/orthanc/segment/${instanceId}`);
      const result = await segmentRes.json();

      if (!segmentRes.ok || result.error) {
        throw new Error(result.error || "Segmentation failed.");
      }

      setSegmentationResults(result);
    } catch (error) {
      console.error("❌ Error during segmentation:", error);
      alert("Segmentation failed: " + error.message);
    } finally {
      setSegmenting(false);
    }
  };

  const downloadSegmentationImage = () => {
    if (!segmentationResults?.image) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${segmentationResults.image}`;
    link.download = `segmented_scan_${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setSegmentationResults(null);
  };

  return (
 <Layout>
    <div className="page-wrapper">
      <header className="header">
        <img src={require("../logo.png")} alt="Children's National Logo" className="logo" />
        <h2 className="heading">View Scans from PACS</h2>
      </header>

      <div className="pacs-info-container">
        <p className="pacs-info">
          PACS is used to retrieve and analyze DICOM studies from connected servers.
        </p>
      </div>

      <div className="white-container">
        <input
          type="text"
          placeholder="Search by patient name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <div className="spinner-container">
            <div className="custom-spinner"></div>
            <p>Loading studies from PACS...</p>
          </div>
        ) : segmenting ? (
          <div className="spinner-container">
            <div className="custom-spinner green-spinner"></div>
            <p>Segmenting scan, please wait...</p>
          </div>
        ) : (
          <div className="study-list">
            {studies.length ? (
              studies.map((study, index) => (
                <div key={index} className="study-card">
                  <p><strong>Patient Name:</strong> {study.PatientMainDicomTags?.PatientName || "Unknown"}</p>
                  <p><strong>Patient ID:</strong> {study.PatientMainDicomTags?.PatientID || "N/A"}</p>
                  <p><strong>Study Date:</strong> {study.MainDicomTags?.StudyDate || "N/A"}</p>
                  <button onClick={() => fetchAndSegment(study.ID)} className="view-button">
                    Segment Scan
                  </button>
                </div>
              ))
            ) : (
              <p>No matching studies found.</p>
            )}
          </div>
        )}

        {segmentationResults && (
          <div className="segmentation-result">
            <h3>Tumor Detected: {segmentationResults.tumor_exists ? "Yes" : "No"}</h3>
            <img
              src={`data:image/png;base64,${segmentationResults.image}`}
              alt="Segmentation Result"
              className="segmentation-image"
            />
            <div className="result-buttons">
              <button onClick={downloadSegmentationImage} className="download-button">Download</button>
              <button onClick={handleReset} className="download-button">Reset</button>
            </div>
          </div>
        )}
      </div>

    </div>
    </Layout>
  );
};

export default UploadThroughPacs;
