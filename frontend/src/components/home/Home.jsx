import "./home.css";
import { useState,useEffect } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";
import college from "../../constants/college";

function Home() {
  const [details, setDetails] = useState({
    taluk:"",
    district:"",
    constituency:"",
    pincode:"",
    chairman:"",
    principalName:"",
    collegeContact:""
  });
  const collegeCode = "5901";
  const header = `${collegeCode || "unknownCode" }. ${college.get(collegeCode) || "unknownCollege"}`
  async function fetch(collegeCode) {
    try {
      const res = await axios.post(`${host}home`, { collegeCode: collegeCode });
      if (res.status === 200) {
        setDetails(res.data);
      } else {
        console.log("error in res");
      }
    } catch (error) {
      console.log("Error occured in fetching");
    }
  }
  useEffect(()=>{
    fetch(collegeCode);
  },[]);

  return (
    <div className="container">
      <h2 className="heading">{header}</h2>
      <div className="content-box">
        <div className="section">
          <h3>Location Details</h3>
          <div className="row">
            <span className="label">Taluk</span>
            <span className="separator">:</span>
            <span className="value">{details.taluk}</span>
          </div>
          <div className="row">
            <span className="label">District</span>
            <span className="separator">:</span>
            <span className="value">{details.district}</span>
          </div>
          <div className="row">
            <span className="label">Constituency</span>
            <span className="separator">:</span>
            <span className="value">{details.constituency}</span>
          </div>
          <div className="row">
            <span className="label">Pincode</span>
            <span className="separator">:</span>
            <span className="value">{details.pincode}</span>
          </div>
        </div>

        <div className="section">
          <h3>Contact Details</h3>
          <div className="row">
            <span className="label">Chairman</span>
            <span className="separator">:</span>
            <span className="value">{details.chairman || "-"}</span>
          </div>
          <div className="row">
            <span className="label">Principal/Dean</span>
            <span className="separator">:</span>
            <span className="value">{details.principalName}</span>
          </div>
          <div className="row">
            <span className="label">College Contact No</span>
            <span className="separator">:</span>
            <span className="value">{details.collegeContact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;