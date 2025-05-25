import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './DeveloperDashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DeveloperDashboard = () => {
  const [modelData, setModelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval] = useState(5000);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('model1');
  const navigate = useNavigate();

  // Protect route: redirect if no token or wrong role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'developer') {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchModelPerformance = async () => {
      try {
        const endpoint =
          selectedModel === 'model1'
            ? 'https://demouserpaglot-myspace.hf.space/api/model-performance'
            : 'https://demouserpaglot-myspace.hf.space/api/model-performance-2';

        const response = await fetch(endpoint);
        const contentType = response.headers.get('content-type');
        const rawText = await response.text();

        if (!rawText.trim()) throw new Error('Empty response body');

        if (contentType?.includes('application/json')) {
          const parsedData = JSON.parse(rawText);
          setModelData(parsedData);
          setIsLoading(false);
        } else {
          console.error('Unexpected content type:', contentType);
          throw new Error('Expected JSON but received different content type');
        }
      } catch (error) {
        console.error('Error fetching model performance:', error.message);
      }
    };

    fetchModelPerformance();
    const interval = setInterval(fetchModelPerformance, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, selectedModel]);

  const handleLogout = () => {
    // Clear tokens from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    // Redirect to home page
    navigate('/home');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const selectModel = (model) => {
    setSelectedModel(model);
    setIsLoading(true);
    setMenuOpen(false);
  };

  if (isLoading || !modelData) {
    return <div className="p-4">Loading model performance data...</div>;
  }

  // Chart data setups
  const { epochs, history, current_metrics } = modelData;

  const trainingHistoryData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Loss',
        data: history.loss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Validation Loss',
        data: history.val_loss,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const accuracyData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Accuracy',
        data: history.accuracy,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Validation Accuracy',
        data: history.val_accuracy,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const diceCoefficientData = {
    labels: epochs,
    datasets: [
      {
        label: 'Dice Coefficient',
        data: history.dice_coefficient,
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
      },
    ],
  };

  const currentMetricsData = {
    labels: ['Precision', 'Recall', 'F1-Score', 'IoU'],
    datasets: [
      {
        label: 'Current Metrics',
        data: [
          current_metrics.precision,
          current_metrics.recall,
          current_metrics.f1_score,
          current_metrics.iou,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {selectedModel === 'model1'
            ? 'Brain Tumor Segmentation Model'
            : 'Secondary Segmentation Model'}
        </h1>
        <div className="navbar1">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <div className="hamburger-bar"></div>
            <div className="hamburger-bar"></div>
            <div className="hamburger-bar"></div>
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => selectModel('model1')}>Model 1</div>
              <div className="dropdown-item" onClick={() => selectModel('model2')}>Model 2</div>
              <div className="dropdown-item" onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Model Performance Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Training & Validation Loss</h3>
          <Line data={trainingHistoryData} />
          <div className="mt-4">
            <p><strong>Final Training Loss:</strong> {history.loss.at(-1)}</p>
            <p><strong>Final Validation Loss:</strong> {history.val_loss.at(-1)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Accuracy Metrics</h3>
          <Line data={accuracyData} />
          <div className="mt-4">
            <p><strong>Final Training Accuracy:</strong> {history.accuracy.at(-1)}</p>
            <p><strong>Final Validation Accuracy:</strong> {history.val_accuracy.at(-1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Dice Coefficient</h3>
          <Bar data={diceCoefficientData} />
          <div className="mt-4">
            <p><strong>Final Dice Coefficient:</strong> {history.dice_coefficient.at(-1)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Current Evaluation Metrics</h3>
          <Pie data={currentMetricsData} />
          <div className="mt-4">
            <p><strong>Precision:</strong> {current_metrics.precision}</p>
            <p><strong>Recall:</strong> {current_metrics.recall}</p>
            <p><strong>F1-Score:</strong> {current_metrics.f1_score}</p>
            <p><strong>IoU:</strong> {current_metrics.iou}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
