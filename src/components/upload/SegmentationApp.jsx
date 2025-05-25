import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SegmentationApp.css";
import Layout from "../Layout";

const BACKEND_URL = "https://demouserpaglot-myspace.hf.space";

const SegmentationApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pacsImageURL = location.state?.imageURL || null;

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
  const [userId, setUserId] = useState(null);
  const [uploadedModalities, setUploadedModalities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (fileData) {
      fetchSegmentationResults();
    }
    // eslint-disable-next-line
  }, [selectedModality]);

  useEffect(() => {
    if (pacsImageURL) {
      handlePacsSegmentation(pacsImageURL);
    }
    // eslint-disable-next-line
  }, [pacsImageURL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/home");
  };

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

  const handleFileChange = (e, modality) => {
    setSelectedFiles({ ...selectedFiles, [modality]: e.target.files[0] });
  };

  // Upload scans
  const handleUpload = async () => {
    if (!Object.values(selectedFiles).some((file) => file)) {
      setStatusMessage("❌ Please select at least one file!");
      return;
    }

    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (!token || !storedUserId) {
      alert("Authorization token missing. Please log in.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setStatusMessage("⏳ Uploading scans...");
    try {
      const formData = new FormData();
      formData.append("userId", storedUserId);

      const modalitiesUploaded = [];
      Object.entries(selectedFiles).forEach(([modality, file]) => {
        if (file) {
          formData.append(modality, file);
          modalitiesUploaded.push(modality);
        }
      });

      const response = await fetch(`${BACKEND_URL}/upload-scans`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 524) {
          throw new Error("Server timeout (524): The backend took too long to respond. Please try again later or contact support.");
        }
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

  const handlePacsSegmentation = (instanceId) => {
    if (!instanceId) {
      setStatusMessage("❌ Invalid PACS image identifier");
      return;
    }

    setLoading(true);
    setStatusMessage("⏳ Fetching and segmenting PACS image...");
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      setLoading(false);
      navigate("/login");
      return;
    }

    fetch(`${BACKEND_URL}/orthanc/segment/${instanceId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || res.statusText);
        }
        return res.json();
      })
      .then((data) => {
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
            sagittal: []
          });
          setAxialIndex(0);
        }
      })
      .catch((error) => {
        setLoading(false);
        setStatusMessage(`❌ Error processing PACS image: ${error.message}`);
        console.error("PACS segmentation error:", error);
      });
  };

  // Fetch segmentation results
  const fetchSegmentationResults = useCallback(() => {
    setStatusMessage("📡 Fetching segmentation results...");
    fetch(`${BACKEND_URL}/get-segmentation-results/${selectedModality}`)
      .then(async (res) => {
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
        // Set indices to mid-slice for each view
        if (data.axial && data.axial.length > 0) setAxialIndex(Math.floor(data.axial.length / 2));
        if (data.coronal && data.coronal.length > 0) setCoronalIndex(Math.floor(data.coronal.length / 2));
        if (data.sagittal && data.sagittal.length > 0) setSagittalIndex(Math.floor(data.sagittal.length / 2));
      })
      .catch((err) => {
        setStatusMessage("❌ Network error!");
      });
  }, [selectedModality]);

  // Helper to get image src for a given view and index
  const getImageSrc = (view, index) => {
    if (!fileData || !fileData[view] || !Array.isArray(fileData[view])) return "";
    const maxIndex = fileData[view].length - 1;
    if (maxIndex < 0) return "";
    const safeIndex = Math.max(0, Math.min(index, maxIndex));
    const imageAtIndex = fileData[view][safeIndex];
    if (!imageAtIndex) return "";
    return `data:image/png;base64,${imageAtIndex}`;
  };

  // Check tumor existence
  const handleTumorDetection = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }
    setStatusMessage("🔍 Checking tumor existence...");
    fetch(`${BACKEND_URL}/check-tumor-existence`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setTumorResult(`🧠 Tumor Status: ${data.tumor_exists ? "Detected" : "Not Detected"}`);
          setStatusMessage("✅ Tumor check complete.");
        } else {
          setTumorResult("❌ Tumor check failed.");
          setStatusMessage("❌ Failed to check tumor.");
        }
      })
      .catch((err) => {
        setTumorResult("❌ Error checking tumor.");
        setStatusMessage("❌ Network error during tumor check.");
      });
  };

  // Generate segmentation images for one modality
  const generateSegmentationImages = (modality) => {
    setGenerating(true);
    setStatusMessage(`⏳ Generating segmentation images for ${modality}...`);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      setGenerating(false);
      navigate("/login");
      return;
    }

    fetch(`${BACKEND_URL}/generate-segmentation-images/${modality}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${modality}_segmentation_images.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setStatusMessage(`✅ Segmentation images for ${modality} downloaded!`);
        setGenerating(false);
      })
      .catch((error) => {
        setStatusMessage("❌ Error generating segmentation images.");
        setGenerating(false);
      });
  };

  return (
    <Layout>
          {/* Hamburger / Dropdown Menu */}

    <div
      style={{
        textAlign: "center",
        padding: "20px",
        minHeight: "100vh",
        background: "#f4f4f4",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          backgroundColor: "transparent",
          border: "2px solid #333",
          color: "#333",
          fontSize: "16px",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
      <h1 style={{ color: "#333" }}>
        <b>Brain Scan Segmentation</b>
      </h1>

      <div
        style={{
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "50%",
          minWidth: "350px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {["T1N", "T1C", "T2W", "T2F"].map((modality) => (
          <div key={modality} style={{ marginBottom: "10px" }}>
            <label
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "10px",
              }}
              onClick={() => showModal(modality)}
            >
              {modality}:
            </label>
            <input
              type="file"
              accept=".nii,.nii.gz"
              onChange={(e) => handleFileChange(e, modality)}
            />
          </div>
        ))}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            marginTop: "10px",
          }}
        >
          {loading ? "Uploading..." : "Upload Scans"}
        </button>
      </div>

      <div style={{ margin: "30px", color: "#333" }}>
        <label>
          <b>Select Modality:</b>
        </label>
        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          style={{ fontSize: "18px", padding: "8px", marginLeft: "10px" }}
        >
          {["T1N", "T1C", "T2W", "T2F"].map((modality) => (
            <option key={modality} value={modality}>
              {modality}
            </option>
          ))}
        </select>
      </div>

      {fileData ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          {["axial", "coronal", "sagittal"].map((view) => (
            <div
              key={view}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "20px",
                minWidth: "250px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#333" }}>{view.charAt(0).toUpperCase() + view.slice(1)}</h3>
              <img
                src={getImageSrc(view, { axial: axialIndex, coronal: coronalIndex, sagittal: sagittalIndex }[view])}
                alt={`${view} slice`}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  background: "#eee",
                  marginBottom: "10px",
                }}
              />
              <input
                type="range"
                min="0"
                max={fileData[view]?.length - 1 || 0}
                value={
                  { axial: axialIndex, coronal: coronalIndex, sagittal: sagittalIndex }[view]
                }
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  if (view === "axial") setAxialIndex(idx);
                  if (view === "coronal") setCoronalIndex(idx);
                  if (view === "sagittal") setSagittalIndex(idx);
                }}
                disabled={!fileData[view]?.length}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          margin: "30px auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          width: "50%",
          minWidth: "350px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ color: "#333" }}>Tumor Detection</h2>
        <button
          onClick={handleTumorDetection}
          disabled={loading}
          style={{
            width: "100%",
            fontSize: "0.8rem",
            padding: "10px 20px",
            minHeight: "36px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Check Tumor Existence
        </button>
        {tumorResult && (
          <p style={{ fontWeight: "bold", color: "#d32f2f", fontSize: "18px" }}>{tumorResult}</p>
        )}
      </div>

      <div style={{ margin: "30px auto", textAlign: "center" }}>
        <button
          onClick={() => generateSegmentationImages(selectedModality)}
          disabled={generating || loading}
          style={{
            padding: "10px 20px",
            backgroundColor: generating ? "#ccc" : "#4CAF50",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            marginTop: "10px",
          }}
        >
          {generating ? "Generating..." : "Download Segmentation Images"}
        </button>
      </div>

      {modalInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "30px",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modalInfo.modality} Information</h3>
            <p>{modalInfo.description}</p>
            <button
              onClick={closeModal}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#2196F3",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
