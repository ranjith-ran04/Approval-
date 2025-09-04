import "./dashboard.css";
import NavigationBar from "../../widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "../../widgets/sidebar/Sidebar.jsx";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { adminhost,host} from "../../constants/backendpath.js";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "../../components/studentDetails/StudentDetails.jsx";
import ScrollToTop from "../../widgets/scrollToTop/ScrollToTop.jsx";
import Chart from "../../widgets/chart/PieChartsDashboard.js";
import CollegeInfo from "../../components/college/CollegeInfo.jsx";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [data, setData] = useState({});
  const [collegeCode, setCollegeCode] = useState("");
  const [submittedCode, setsubmittedCode] = useState("");
  const [supp, setSupp] = useState(false);
  const scrollRef = useRef();
  const location = useLocation();
  // // console.log(location.state);
  const logged = location.state?.logged || false;

  const navigate = useNavigate();
  async function fetch() {
    setIsSubmit(true);
    try {
      const res = await axios.post(
        `${adminhost}home`,
        { collegeCode },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data && res.data.length > 0) {
        setData(res.data[0]);
      } else {
        setData({});
      }
    } catch (error) {
      navigate("/admin/login");
    }
  }

  const handleChange = (e) => {};

  const updateDetails = async () => {
    try {
      const res = await axios.put(
        `${adminhost}home`,
        { collegeCode },
        { withCredentials: true }
      );
      if (res.status === 200) {
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    if (collegeCode) {
      fetch();
    }
  }, [isSubmit]);

  useEffect(() => {
    if (current === 2) {
      setSupp(true);
    } else {
      setSupp(false);
    }
  }, [current]);

  const handleKey = (e) => {
    if (e.key === "Enter" && collegeCode) {
      setsubmittedCode(collegeCode);
      setCollegeCode(collegeCode);
      fetch();
      setIsSubmit(true);
    }
  };

  useEffect(() => {
    if (current === 2) {
      setSupp(true);
    } else {
      setSupp(false);
    }
  }, [current]);

  // console.log(supp);
    const handleLogOut = async (admin) => {
      console.log('hi')
    try {
      const res = await axios.get(`${host}logout`, { withCredentials: true });
      if (res.status === 200) {
        if (admin) {
          navigate("/admin/login");
        } else {
          navigate("/");
          sessionStorage.setItem("notesShown", "");
          localStorage.setItem("current",0);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return logged ? (
    <div className="dashboard">
      {isSubmit && <Sidebar setCurrent={setCurrent} admin={true} />}
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
          login={logged}
          handleLogOut={handleLogOut}
        />

        <div className="dashboard-body" ref={scrollRef}>
          { current === 0 && (<div className="dashboard-box">
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
              <button className="collbut" onClick={fetch}>
                Enter
              </button>
            </div>

            {isSubmit && (
              <>
                {/* College Name */}
                <div className="collgroup-full">
                  <label htmlFor="collname" className="coll-label">
                    College Name
                  </label>
                  <input
                    type="text"
                    id="collname"
                    className="coll-input"
                    value={data.name_of_college || ""}
                    readOnly
                  />
                </div>

                {/* Office Letter */}
                <div className="coll-section">
                  <h3 className="coll-heading">Office Letter</h3>
                  <div className="coll-row">
                    <div className="collgroup-half">
                      <label htmlFor="offlet" className="coll-label">
                        Letter No
                      </label>
                      <input
                        type="text"
                        id="offlet"
                        className="coll-input"
                        value={data.letter_no || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="collgroup-half">
                      <label htmlFor="letdat" className="coll-label">
                        Dated
                      </label>
                      <input
                        type="text"
                        id="letdat"
                        className="coll-input"
                        value={data.dated || ""}
                        onChange={handleChange}
                      />
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
                      <input
                        type="text"
                        id="prinlet"
                        className="coll-input"
                        value={data.p_letter_no || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="collgroup-half">
                      <label htmlFor="prindat" className="coll-label">
                        Dated
                      </label>
                      <input
                        type="text"
                        id="prindat"
                        className="coll-input"
                        value={data.p_dated || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="coll-btn-container">
                  <button className="coll-save-btn">Save</button>
                </div>
              </>
            )}
          </div>)
          }
          {isSubmit && (
            <>
              {isSubmit && current === 0 && (
                <Chart collegeCode={collegeCode} key={submittedCode} />
              )}
              {current === 1 && (
                <StudentDetails
                  admin={true}
                  supp={supp}
                  setCurrent={setCurrent}
                />
              )}
              {current === 2 && (
                <StudentDetails
                  admin={true}
                  supp={supp}
                  setCurrent={setCurrent}
                />
              )}
              {current === 3 && (
                <CollegeInfo admin={true} collegeCode={collegeCode} />
              )}

              <ScrollToTop scrollRef={scrollRef} />
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default Dashboard;
