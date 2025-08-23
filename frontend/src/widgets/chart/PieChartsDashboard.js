import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {adminhost} from '../../constants/backendpath';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartDashboard = (collegeCode) => {
  const [communityData, setCommunityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchChart(){
    try{
    const res = await axios.post(`${adminhost}chart`,{collegeCode:collegeCode.collegeCode},{withCredentials:true});
      if(res.status === 200){
        // console.log(res.data);
        setCommunityData(res.data[0]);
        setCategoryData(res.data[1]);
      }
    }catch(err){
      console.log(err);
    }}
    fetchChart();
  }, []);

  const communityChart = {
    labels: communityData.map((d) => d.community),
    datasets: [
      {
        data: communityData.map((d) => d.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#B2FF59"],
        borderWidth: 0,
      },
    ],
  };

  // console.log(categoryData)

  const categoryChart = {
    labels: categoryData.map((d) => d.catogory.slice(0,3)),
    datasets: [
      {
        data: categoryData.map((d) => d.count),
        backgroundColor: ["#8E44AD", "#27AE60", "#3498DB", "#E67E22", "#E74C3C", "#1ABC9C", "#F39C12"],
        borderWidth: 0,
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
      width:'100%',
      display: "flex",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      gap: "20px",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        width: "40%",
        padding: "1rem",
        border: "2px solid #888",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        height:'45vh'
      }}>
        <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Community-wise Distribution
        </h4>
        <div style={{ height: "200px" }}>
          <Pie data={communityChart} options={options} />
        </div>
      </div>

      <div style={{
        width: "40%",
        padding: "1rem",
        border: "2px solid #888",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        height:'45vh'
      }}>
        <h4 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Category-wise Distribution
        </h4>
        <div style={{ height: "200px" }}>
          <Pie data={categoryChart} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PieChartDashboard;
