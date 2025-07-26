import "./dashboard.css";
import Home from "./components/home/Home.jsx";
import CollegeInfo from "./components/college/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState, useRef } from "react";
import EditBranch from "./components/branch/EditBranch.jsx";
import Notes from "./widgets/notes/Notes.jsx";
import ScrollToTop from "./widgets/scrollToTop/ScrollToTop.jsx";
import Addstudent from "./components/studentdetails/Studentform.jsx";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});
  const scrollRef = useRef();
  console.log("Dashboard current:", current);
  return (
    <div className="dashboard">
      <Sidebar setCurrent={setCurrent} />
      <div className="dashone">
        <NavigationBar
          text={`GOVERNMENT OF TAMILNADU
DIRECTORATE OF TECHNICAL EDUCATION
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
          profile={true}
          bool={false}
          setCurrent={setCurrent}
        />

        <div className="dashboard-body" ref={scrollRef}>
          <>
            {current === 0 && <Home /> && <Notes/>}
            {current === 1 && <CollegeInfo />}
            {current === 2 && (
              <Branch setCurrent={setCurrent} setState={setState} />
            )}
            {current === 3 && <AddBranch setCurrent={setCurrent} />}
            {current === 4 && (
              <EditBranch setCurrent={setCurrent} state={state} />
            )}
            {current === 5 && <Addstudent/>}
            <ScrollToTop scrollRef={scrollRef} />
          </>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
