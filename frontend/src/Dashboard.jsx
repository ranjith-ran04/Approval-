import "./dashboard.css";
import Home from "./components/home/Home.jsx";
import CollegeInfo  from "./components/college/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState } from "react";
import EditBranch from "./components/branch/EditBranch.jsx";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});
  return (
    <div>
      <Sidebar setCurrent={setCurrent} />
      <div className="dashone">
        {/* <div className="dashboard-body"> */}
        <NavigationBar
          text={`DIRECTORATE OF TECHNICAL EDUCATION 
TAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 
APPROVAL PROCESS`}
          profile={true}
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
