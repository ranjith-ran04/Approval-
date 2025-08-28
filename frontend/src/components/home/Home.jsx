import "./home.css";
import { useState,useEffect } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";
import { useNavigate} from "react-router-dom";

function Home() {
  const navigate = useNavigate();
    const [details, setDetails] = useState({
      taluk: "",
      district: "",
      constituency: "",
      pincode: "",
      chairman: "",
      principalName: "",
      collegeContact: "",
    });
    async function fetch() {
    try {
      const res = await axios.get(`${host}home`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        // console.log('dashboard',res.data);
        setDetails(res.data[0]);
      }
    } catch (error) {
      navigate("/");
    }
  }
  useEffect(() => {
    fetch();
  }, []);
  return (
    <div className="container">
      <h2 className="homeheading">{`${details.collegeCode || "unknownCode" } - ${details.collegeName || "unknownCollege"}`}</h2>
      <div className="content-box">
        <div className="section">
          <h3>Location Details</h3>
          <div className="row-Home">
            <span className="label">Taluk</span>
            <span className="separator">:</span>
            <span className="value">{details.taluk}</span>
          </div>
          <div className="row-Home">
            <span className="label">District</span>
            <span className="separator">:</span>
            <span className="value">{details.district}</span>
          </div>
          <div className="row-Home">
            <span className="label">Constituency</span>
            <span className="separator">:</span>
            <span className="value">{details.constituency}</span>
          </div>
          <div className="row-Home">
            <span className="label">Pincode</span>
            <span className="separator">:</span>
            <span className="value">{details.pincode}</span>
          </div>
        </div>

        <div className="section">
          <h3>Contact Details</h3>
          <div className="row-Home">
            <span className="label">Chairman</span>
            <span className="separator">:</span>
            <span className="value">{details.chairman || "-"}</span>
          </div>
          <div className="row-Home">
            <span className="label">Principal/Dean</span>
            <span className="separator">:</span>
            <span className="value">{details.principalName}</span>
          </div>
          <div className="row-Home">
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
