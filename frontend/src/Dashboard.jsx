import "./dashboard.css";
import Home from "./components/Home/Home.jsx";
import CollegeInfo from "./components/College/CollegeInfo.jsx";
import Branch from "./components/branch/Branch.jsx";
import AddBranch from "./components/branch/AddBranch.jsx";
import NavigationBar from "./widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "./widgets/sidebar/Sidebar.jsx";
import { useState, useEffect } from "react";
import EditBranch from "./components/branch/EditBranch.jsx";
import Notes from "./widgets/notes/Notes.jsx";
import axios from "axios";
import { host } from "./constants/backendpath.js";
import { useNavigate, useLocation } from "react-router-dom";
import Studentform from './components/studentdetails/Studentform.jsx'

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});
  const location = useLocation();
  const logged = location.state?.logged || false;

  const [details, setDetails] = useState({
    taluk: "",
    district: "",
    constituency: "",
    pincode: "",
    chairman: "",
    principalName: "",
    collegeContact: "",
  });
  const navigate = useNavigate();
  async function fetch() {
    try {
      // console.log('hi')
      const res = await axios.get(`${host}home`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        // console.log(res.data);
        setDetails(res.data);
      }
    } catch (error) {
      navigate("/");
    }
  }
  useEffect(() => {
    fetch();
  }, []);

  return logged ? (
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
        <div className="dashboard-body">
          {current === 0 && <Home details={details} />}
          {current === 1 && <CollegeInfo />}
          {current === 2 && (
            <Branch setCurrent={setCurrent} setState={setState} />
          )}
          {current === 3 && <AddBranch setCurrent={setCurrent} />}
          {current === 4 && (
            <EditBranch setCurrent={setCurrent} state={state} />
          )}
          {current===5 && <Studentform setCurrent={setCurrent} setState={setState}/>}
          {current === 0 && <Notes />}
        </div>
      </div>
    </div>
  ) : null;
}

export default Dashboard;
