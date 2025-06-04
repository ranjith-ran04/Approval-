import "./home.css";
import Notes from "../../widgets/notes/Notes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const NOTE_KEY = "hasseen";

function Home() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const has = localStorage.getItem(NOTE_KEY) === "true";
    if (!has) {
      setOpen(true);
      localStorage.setItem(NOTE_KEY, "true");
    } else {
      setMinimized(true);
    }
    localStorage.setItem("value", false);
  }, []);

  const handleClick = (para) => {
    if (!para) {
      setMinimized(true);
      setOpen(false);
    } else {
      setOpen(para);
      setMinimized(false);
    }
  };

  const details = {
    Taluk: "Mambam",
    Contituency: "Mylapore",
    District: "Chennai",
    Pincode: "620001",
  };

  const contactDetails = {
    Chairman: "Vishnu (ph.no:9897969594)",
    Principal: "Dr.K.S.EASWARAKUMAR (ph.no:04422358491)",
    College: "4422358491",
  };
  return (
    <div id="container">
      {open && <Notes handleClick={handleClick} minimized={minimized} />}
      {minimized && (
        <div className="minimized-icon" onClick={() => handleClick(true)}>
          📝
        </div>
      )}
          <div id="center-body">1.UNIVERSITY COLLEGE OF ENGINEERING</div>
          <div id="wrap">
            <div id="first-body">
              <div className="one" id="p">
                <strong>Taluk</strong>
                <div>: {details.Taluk}</div>
              </div>
              <div className="one" id="o">
                <strong>Constituency </strong>
                <div>: {details.Contituency}</div>
              </div>
              <div className="one" id="q">
                <strong>District </strong>
                <div>: {details.District}</div>
              </div>
              <div className="one" id="r">
                <strong>Pincode </strong>
                <div>: {details.Pincode}</div>
              </div>
            </div>
            <div id="second-body">
              <div className="one">
                <strong>CONTACT</strong>
              </div>
              <div className="one" id="y">
                <strong>Chairman </strong>
                <div>: {contactDetails.Chairman}</div>
              </div>
              <div className="one" id="u">
                <strong>Principal/Dean </strong>
                <div>: {contactDetails.Principal}</div>
              </div>
              <div className="one" id="i">
                <strong>College Contact No </strong>
                <div>: {contactDetails.College}</div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default Home;
