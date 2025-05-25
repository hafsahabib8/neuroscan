import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SegmentationApp.css";
import Layout from "../Layout";

const BACKEND_URL = "https://demouserpaglot-myspace.hf.space";

const SegmentationApp = () => {
  const location = useLocation();
  const pacsImageURL = location.state?.imageURL || null;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [fileData, setFileData] = useState(null);
  const [axialIndex, setAxialIndex] = useState(78);
  const [coronalIndex, setCoronalIndex] = useState(78);
  const [sagittalIndex, setSagittalIndex] = useState(78);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedModality, setSelectedModality] = useState("T1N");
  const [tumorResult, setTumorResult] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [uploadedModalities, setUploadedModalities] = useState([]);

  // Fetch segmentation results when selectedModality changes and fileData exists
  useEffect(() => {
    if (fileData) {
      fetchSegmentationResults();
    }
    // eslint-disable-next-line
  }, [selectedModality]);

  // User session check
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (!email || !role) {
      navigate("/login");
    } else {
      setUser({ first_name: firstName || "User", last_name: lastName || "" });
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/home");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // PACS segmentation if imageURL present
  useEffect(() => {
    if (pacsImageURL) {
      handlePacsSegmentation(pacsImageURL);
    }
    // eslint-disable-next-line
  }, [pacsImageURL]);

  // Modal info for modalities
  const showModal = (modality) => {
    const descriptions = {
      T1N: "T1-weighted MRI provides high-resolution anatomical details.",
      T1C: "T1-weighted MRI with Contrast highlights blood vessels.",
      T2W: "T2-weighted MRI is sensitive to fluid and edema.",
      T2F: "T2-weighted FLAIR enhances lesion visibility.",
    };
    setModalInfo({ modality, description: descriptions[modality] });
  };
  const closeModal = () => setModalInfo(null);

  // File input change
  const handleFileChange = (e, modality) => {
    setSelectedFiles((prev) => ({ ...prev, [modality]: e.target.files[0] }));
  };

  // Upload files to backend
  const handleUpload = async () => {
    if (!Object.values(selectedFiles).some((file) => file)) {
      setStatusMessage("❌ Please select at least one file!");
      return;
    }

    setLoading(true);
    setStatusMessage("⏳ Uploading scans...");
    try {
      const formData = new FormData();
      const modalitiesUploaded = [];
      Object.entries(selectedFiles).forEach(([modality, file]) => {
        if (file) {
          formData.append(modality, file);
          modalitiesUploaded.push(modality);
        }
      });

      const response = await fetch(`${BACKEND_URL}/upload-scans`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || response.statusText);
        } else {
          const text = await response.text();
          throw new Error(text || response.statusText);
        }
      }

      const data = await response.json();

      if (data.error) {
        setStatusMessage("❌ Upload failed!");
        alert(`Upload error: ${data.message || data.error}`);
        setLoading(false);
        return;
      }

      setStatusMessage("✅ Upload successful! Fetching results...");
      setUploadedModalities(modalitiesUploaded);
      fetchSegmentationResults();
    } catch (err) {
      setStatusMessage(`❌ Upload error: ${err.message}`);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // PACS segmentation
  const handlePacsSegmentation = async (instanceId) => {
    if (!instanceId) {
      setStatusMessage("❌ Invalid PACS image identifier");
      return;
    }

    setLoading(true);
    setStatusMessage("⏳ Fetching and segmenting PACS image...");

    try {
      const res = await fetch(`${BACKEND_URL}/orthanc/segment/${instanceId}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }

      const data = await res.json();

      setLoading(false);

      if (data.error) {
        setStatusMessage(`❌ PACS segmentation failed: ${data.error}`);
        return;
      }

      setStatusMessage("✅ PACS segmentation complete!");
      setTumorResult(`🧠 Tumor Status: ${data.tumor_exists ? "Detected" : "Not Detected"}`);

      if (data.image) {
        setFileData({
          axial: [data.image],
          coronal: [],
          sagittal: [],
        });
        setAxialIndex(0);
      }
    } catch (error) {
      setLoading(false);
      setStatusMessage(`❌ Error processing PACS image: ${error.message}`);
      console.error("PACS segmentation error:", error);
    }
  };

  // Fetch segmentation results for selected modality
  const fetchSegmentationResults = useCallback(async () => {
    setStatusMessage("📡 Fetching segmentation results...");
    try {
      const res = await fetch(`${BACKEND_URL}/get-segmentation-results/${selectedModality}`);
      if (!res.ok) {
        setStatusMessage("❌ Error fetching results!");
        return;
      }
      const data = await res.json();
      if (data.error) {
        setStatusMessage("❌ Segmentation failed.");
        return;
      }
      setFileData(data);
      setStatusMessage("✅ Segmentation complete.");

      if (data.axial && data.axial.length > 0) setAxialIndex(Math.floor(data.axial.length / 2));
      if (data.coronal && data.coronal.length > 0) setCoronalIndex(Math.floor(data.coronal.length / 2));
      if (data.sagittal && data.sagittal.length > 0) setSagittalIndex(Math.floor(data.sagittal.length / 2));
    } catch (err) {
      setStatusMessage("❌ Network error!");
    }
  }, [selectedModality]);

  // Get image src for a view and index
  const getImageSrc = (view, index) => {
    if (!fileData || !fileData[view] || !Array.isArray(fileData[view])) return "";
    const maxIndex = fileData[view].length - 1;
    if (maxIndex < 0) return "";
    const safeIndex = Math.max(0, Math.min(index, maxIndex));
    const imageAtIndex = fileData[view][safeIndex];
    if (!imageAtIndex) return "";
    return `data:image/png;base64,${imageAtIndex}`;
  };

  // Tumor detection
  const handleTumorDetection = async () => {
    setStatusMessage("🔍 Checking tumor existence...");

    try {
      const res = await fetch(`${BACKEND_URL}/check-tumor-existence`, {
        method: "GET",
      });
      const data = await res.json();

      if (res.ok) {
        setTumorResult(`🧠 Tumor Status: ${data.tumor_exists ? "Detected" : "Not Detected"}`);
        setStatusMessage("✅ Tumor check complete.");
      } else {
        setTumorResult("❌ Tumor check failed.");
        setStatusMessage("❌ Failed to check tumor.");
      }
    } catch (err) {
      setTumorResult("❌ Error checking tumor.");
      setStatusMessage("❌ Network error during tumor check.");
    }
  };

  // Download segmentation images
  const generateSegmentationImages = async (modality) => {
    setGenerating(true);
    setStatusMessage(`⏳ Generating segmentation images for ${modality}...`);

    try {
      const res = await fetch(`${BACKEND_URL}/generate-segmentation-images/${modality}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${modality}_segmentation.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setStatusMessage("✅ Segmentation images downloaded.");
    } catch (err) {
      setStatusMessage(`❌ Download failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout>
      {/* Hamburger / Dropdown Menu */}
      <div className="hamburger-container" ref={dropdownRef}>
        <div className="hamburger-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <div className="segmentation-app">
        <section className="upload-section">
          <h2>Upload MRI Scans</h2>
          {["T1N", "T1C", "T2W", "T2F"].map((modality) => (
            <div key={modality} className="file-input-group">
              <label htmlFor={`${modality}-file`}>
                {modality} Scan
                <button onClick={() => showModal(modality)} type="button" className="info-button">?</button>
              </label>
              <input
                type="file"
                id={`${modality}-file`}
                accept=".nii,.nii.gz"
                onChange={(e) => handleFileChange(e, modality)}
                disabled={loading}
              />
            </div>
          ))}
          <button onClick={handleUpload} disabled={loading} className="uploadbtn">
            {loading ? "Uploading..." : "Upload Scans"}
          </button>
        </section>

        <section className="modality-selection">
          <h2>Select Modality to View</h2>
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            disabled={loading || generating}
          >
            <option value="T1N">T1N</option>
            <option value="T1C">T1C</option>
            <option value="T2W">T2W</option>
            <option value="T2F">T2F</option>
          </select>
          <button
            onClick={() => generateSegmentationImages(selectedModality)}
            disabled={generating || loading}
            className="uploadbtn"
          >
            {generating ? "Generating..." : "Download Segmentation Images"}
          </button>
        </section>

        <section className="segmentation-viewer">
          <h2>Segmentation Viewer</h2>
          <div className="image-group">
            <div className="image-view">
              <h3>Axial</h3>
              <img
                src={getImageSrc("axial", axialIndex)}
                alt="Axial slice"
                className="segmentation-image"
              />
              <input
                type="range"
                min="0"
                max={fileData?.axial?.length - 1 || 0}
                value={axialIndex}
                onChange={(e) => setAxialIndex(Number(e.target.value))}
                disabled={!fileData?.axial?.length}
              />
            </div>
            <div className="image-view">
              <h3>Coronal</h3>
              <img
                src={getImageSrc("coronal", coronalIndex)}
                alt="Coronal slice"
                className="segmentation-image"
              />
              <input
                type="range"
                min="0"
                max={fileData?.coronal?.length - 1 || 0}
                value={coronalIndex}
                onChange={(e) => setCoronalIndex(Number(e.target.value))}
                disabled={!fileData?.coronal?.length}
              />
            </div>
            <div className="image-view">
              <h3>Sagittal</h3>
              <img
                src={getImageSrc("sagittal", sagittalIndex)}
                alt="Sagittal slice"
                className="segmentation-image"
              />
              <input
                type="range"
                min="0"
                max={fileData?.sagittal?.length - 1 || 0}
                value={sagittalIndex}
                onChange={(e) => setSagittalIndex(Number(e.target.value))}
                disabled={!fileData?.sagittal?.length}
              />
            </div>
          </div>
        </section>

        <section className="tumor-detection">
          <h2>Tumor Detection</h2>
          <button onClick={handleTumorDetection} disabled={loading} className="uploadbtn">
            Check Tumor Existence
          </button>
          {tumorResult && <p className="tumor-result">{tumorResult}</p>}
        </section>

        {modalInfo && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{modalInfo.modality} Information</h3>
              <p>{modalInfo.description}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}

        {/* Status message at the bottom */}
        {statusMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#333",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              zIndex: 1000,
            }}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SegmentationApp;
