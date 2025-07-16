import "./home.css";
import { useState,useEffect } from "react";

function Home({details}) {
  // console.log(details);

  return (
    <div className="container">
      <h2 className="heading">{`${details.collegeCode || "unknownCode" } - ${details.collegeName || "unknownCollege"}`}</h2>
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
