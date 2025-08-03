import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartDashboard = () => {
  const [communityData, setCommunityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/community-distribution")
      .then((res) => setCommunityData(res.data))
      .catch((err) => console.error("Community Axios Error:", err));

    axios
      .get("http://localhost:5000/api/category-distribution")
      .then((res) => setCategoryData(res.data))
      .catch((err) => console.error("Category Axios Error:", err));
  }, []);

  const communityChart = {
    labels: communityData.map((d) => d.community),
    datasets: [
      {
        data: communityData.map((d) => d.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#B2FF59"],
        borderWidth: 0, // no inner border
      },
    ],
  };

  const categoryChart = {
    labels: categoryData.map((d) => d.catogory),
    datasets: [
      {
        data: categoryData.map((d) => d.count),
        backgroundColor: ["#8E44AD", "#27AE60", "#3498DB", "#E67E22", "#E74C3C", "#1ABC9C", "#F39C12"],
        borderWidth: 0, // no inner border
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
          },
          boxWidth: 15,
          padding: 20,
        },
      },
    },
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      gap: "20px",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
    }}>
      {/* Community Chart */}
      <div style={{
        width: "25%",
        padding: "1rem",
        border: "2px solid #888",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}>
        <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Community-wise Distribution
        </h4>
        <div style={{ height: "300px" }}>
          <Pie data={communityChart} options={options} />
        </div>
      </div>

      {/* Category Chart */}
      <div style={{
        width: "25%",
        padding: "1rem",
        border: "2px solid #888",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}>
        <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Category-wise Distribution
        </h4>
        <div style={{ height: "300px" }}>
          <Pie data={categoryChart} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PieChartDashboard;
