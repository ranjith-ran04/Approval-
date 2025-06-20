import "./dashboard.css";
import Home from "./components/Home/Home.jsx";
import CollegeInfo from "./components/College/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState} from "react";
import EditBranch from "./components/branch/EditBranch.jsx";
import Notes from "./widgets/notes/Notes.jsx";

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});

  return (
    <div className="dashboard">
      {current === 0 && <Notes/>}
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

        <div className="dashboard-body">
          {current === 0 && <Home />}
          {current === 1 && <CollegeInfo />}
          {current === 2 && (
            <Branch setCurrent={setCurrent} setState={setState} />
          )}
          {current === 3 && <AddBranch setCurrent={setCurrent}/>}
          {current === 4 && <EditBranch setCurrent={setCurrent} state={state} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
