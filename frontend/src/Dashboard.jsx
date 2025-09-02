import "./dashboard.css";
import Home from "./components/Home/Home.jsx";
import CollegeInfo from "./components/college/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState, useRef, useEffect } from "react";
import EditBranch from "./components/branch/EditBranch.jsx";
import Notes from "./widgets/notes/Notes.jsx";
import ScrollToTop from "./widgets/scrollToTop/ScrollToTop.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "./components/studentDetails/StudentDetails.jsx";
import Discontinued from "./components/discontinued/Discontinued.jsx";
import Reminder from "./widgets/reminder/Onemin.jsx";
import axios from "axios";
import { host } from "./constants/backendpath.js";

function Dashboard() {
  const [current, setCurrent] = useState(Number(localStorage.getItem("current") || 0));
  const [state, setState] = useState({});
  const scrollRef = useRef();
  const location = useLocation();
  const logged = location.state?.logged || false;
  const Navigate = useNavigate();

    useEffect(()=>{
    localStorage.setItem("current",current)
  },[current]);
    const handleLogOut = async (admin) => {
    try {
      const res = await axios.get(`${host}logout`, { withCredentials: true });
      if (res.status === 200) {
        if (admin) {
          Navigate("/admin/login");
        } else {
          Navigate("/");
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
      <Sidebar setCurrent={setCurrent} admin={false} current={current}/>
      <div className="dashone">
        <NavigationBar
          text={`GOVERNMENT OF TAMILNADU
DIRECTORATE OF TECHNICAL EDUCATION
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech., Admissions Approval-2025`}
          profile={true}
          bool={false}
          setCurrent={setCurrent}
          admin={false}
          style={{ height: "70px" }}
          login={logged}
          handleLogOut={handleLogOut}
        />

        <div className="dashboard-body" ref={scrollRef}>
          <>
            {current === 0 && <Home />}
            {current === 1 && <CollegeInfo />}
            {current === 2 && (
              <Branch setCurrent={setCurrent} setState={setState} />
            )}
            {current === 3 && <AddBranch setCurrent={setCurrent} />}
            {current === 4 && (
              <EditBranch setCurrent={setCurrent} state={state} />
            )}
            {current === 0 && <Notes />}
            {current === 5 && <StudentDetails />}
            {current === 6 && <Discontinued />}
            <ScrollToTop scrollRef={scrollRef} />
            <Reminder handleLogOut={handleLogOut} admin={false} />
          </>
        </div>
      </div>
    </div>
  ) : null;
}

export default Dashboard;
