import "./dashboard.css";
import NavigationBar from "../../widgets/navigationBar/NavigationBar.jsx";
import Sidebar from "../../widgets/sidebar/Sidebar.jsx";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { adminhost } from "../../constants/backendpath.js";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "../../components/studentDetails/StudentDetails.jsx";
import ScrollToTop from "../../widgets/scrollToTop/ScrollToTop.jsx";
import Chart from '../../widgets/chart/PieChartsDashboard.js';

function Dashboard() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({});
  const [supp,setSupp] = useState(false);
  const scrollRef = useRef();  
  const location = useLocation();
  console.log(location.state);
  const logged = location.state?.logged || false;

  const navigate = useNavigate();
  async function fetch() {
    try {
      const res = await axios.get(`${adminhost}home`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log('dashboard',res.data);
      }
    } catch (error) {
      navigate("/admin/login");
    }
  }
  useEffect(() => {
    fetch();
  }, []);

  useEffect(()=>{
    if(current === 2){
      setSupp(true);
    }else{
      setSupp(false);
    }
  },[current]);

console.log(supp);

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
          style={{height:'40px'}}
        />

        <div className="dashboard-body" ref={scrollRef}>
        <>
        {current === 0 && <Chart/>}
        {current === 1 && <StudentDetails admin={true} supp={supp}/>}
        {current === 2 && <StudentDetails admin={true} supp={supp}/>}

        <ScrollToTop scrollRef={scrollRef} />
        </>
        </div>
      </div>
    </div>
  ) : null;
}

export default Dashboard;
