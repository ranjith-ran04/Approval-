import "./dashboard.css";
import NavigationBar from "../../widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "../../widgets/sidebar/Sidebar.jsx";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { adminhost } from "../../constants/backendpath.js";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "../../components/studentDetails/StudentDetails.jsx";
import ScrollToTop from "../../widgets/scrollToTop/ScrollToTop.jsx";
import Chart from "../../widgets/chart/PieChartsDashboard.js";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [data, setData] = useState({});
  const [collegeCode, setCollegeCode] = useState("");
  const [supp, setSupp] = useState(false);
  const scrollRef = useRef();
  const location = useLocation();
  // console.log(location.state);
  const logged = location.state?.logged || false;

  const navigate = useNavigate();
  async function fetch() {
    try {
      const res = await axios.post(
        `${adminhost}home`,
        { collegeCode },
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("dashboard", res.data[0]);
        setData(res.data[0]);
      }
    } catch (error) {
      navigate("/admin/login");
    }
  }
  useEffect(() => {
    if (collegeCode) {
      fetch();
    }
  }, [setCollegeCode]);

  useEffect(() => {
    if (current === 2) {
      setSupp(true);
    } else {
      setSupp(false);
    }
  }, [current]);

  const handleKey = (e) => {
    if (e.key === "Enter" && collegeCode) {
      fetch();
      setIsSubmit(true);
    }
  };

  return logged ? (
    <div className="dashboard">
      <Sidebar setCurrent={setCurrent} admin={true} />
      <div className="dashone">
        <NavigationBar
          text={`GOVERNMENT OF TAMILNADU
DIRECTORATE OF TECHNICAL EDUCATION
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
          profile={true}
          bool={false}
          setCurrent={setCurrent}
          admin={true}
          style={{ height: "40px" }}
        />

        <div className="dashboard-body" ref={scrollRef}>
          <div className="dashboard-box">
            <div className="collgroup collgroup-inline">
              <label htmlFor="collcode" className="collcode">
                College Code
              </label>
              <input
                type="text"
                id="collcode"
                name="collegeCode"
                className="coll-input"
                placeholder="Enter College Code and Click Enter "
                onKeyDown={handleKey}
                onChange={(e) => setCollegeCode(e.target.value)}
              />
              <button className="collbut" onSubmit={fetch}>Enter</button>
            </div>

            {isSubmit && (
              <>
                {/* College Name */}
                <div className="collgroup-full">
                  <label htmlFor="collname" className="coll-label">
                    College Name
                  </label>
                  <input type="text" id="collname" className="coll-input" value={data.name_of_college || ""}/>
                </div>

                {/* Office Letter */}
                <div className="coll-section">
                  <h3 className="coll-heading">Office Letter</h3>
                  <div className="coll-row">
                    <div className="collgroup-half">
                      <label htmlFor="offlet" className="coll-label">
                        Letter No
                      </label>
                      <input type="text" id="offlet" className="coll-input" value={data.letter_no || ""}/>
                    </div>
                    <div className="collgroup-half">
                      <label htmlFor="letdat" className="coll-label">
                        Dated
                      </label>
                      <input type="text" id="letdat" className="coll-input" value={data.dated || ""} />
                    </div>
                  </div>
                </div>

                {/* Principal Letter */}
                <div className="coll-section">
                  <h3 className="coll-heading">Principal Letter</h3>
                  <div className="coll-row">
                    <div className="collgroup-half">
                      <label htmlFor="prinlet" className="coll-label">
                        Letter No
                      </label>
                      <input type="text" id="prinlet" className="coll-input" value={data.p_letter_no || ""}/>
                    </div>
                    <div className="collgroup-half">
                      <label htmlFor="prindat" className="coll-label">
                        Dated
                      </label>
                      <input type="text" id="prindat" className="coll-input" value={data.p_dated || ""}/>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="coll-btn-container">
                  <button className="coll-save-btn">Save</button>
                </div>
              </>
            )}
          </div>
          {isSubmit && (
            <>
              {current === 0 && <Chart collegeCode={collegeCode}/>}
              {current === 1 && <StudentDetails admin={true} supp={supp} />}
              {current === 2 && <StudentDetails admin={true} supp={supp} />}

              <ScrollToTop scrollRef={scrollRef} />
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default Dashboard;
