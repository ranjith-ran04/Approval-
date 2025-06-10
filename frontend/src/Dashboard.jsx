import "./dashboard.css";
import Home from "./components/home/Home.jsx";
import CollegeInfo from "./components/college/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState, useEffect } from "react";
import EditBranch from "./components/branch/EditBranch.jsx";
import Notes from "./widgets/notes/Notes.jsx";

const NOTE_KEY = "hasseen";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

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
  return (
    <div>
      {open && <Notes handleClick={handleClick} minimized={minimized} />}
      {minimized && (
        <div className="minimized-icon" onClick={() => handleClick(true)}>
          <div className='icon-dashboard'>

          </div>
          
        </div>
      )}
      <Sidebar setCurrent={setCurrent} />
      <div className="dashone">
        {/* <div className="dashboard-body"> */}
        <NavigationBar
          text={`GOVERNMENT OF TAMILNADU
DIRECTORATE OF TECHNICAL EDUCATION
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
          profile={true}
          bool={false}
          setCurrent={setCurrent}
        />
        {/* </div> */}

        <div className="dashboard-body">
          {current === 0 && <Home />}
          {current === 1 && <CollegeInfo />}
          {current === 2 && (
            <Branch setCurrent={setCurrent} setState={setState} />
          )}
          {current === 3 && <AddBranch />}
          {current === 4 && <EditBranch state={state} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
