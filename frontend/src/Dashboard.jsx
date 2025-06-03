import './dashboard.css'
import Home from './components/home/Home.js'
import {CollegeInfo} from './components/college/CollegeInfo.js'
import Branch from './components/branch/Branch.jsx';
import AddBranch from './components/branch/AddBranch.jsx';
import NavigationBar from './widgets/navigationBar/NavigationBar.js';
import Sidebar from './widgets/sidebar/Sidebar.jsx'
import {useState} from 'react'
import EditBranch from './components/branch/EditBranch.jsx';

function Dashboard(){
    const [current , setCurrent] = useState(0)
    const [state,setState] = useState({})
    return(
        <div>
        <NavigationBar
        text={`DIRECTORATE OF TECHNICAL EDUCATION 
TAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 
APPROVAL PROCESS`}
        profile={true}
      />
      <Sidebar setCurrent={setCurrent}/>
    <div id="dashboard-body">
      {current === 0 && <Home/>}
      {current === 1 && <CollegeInfo/>}
      {current === 2 && <Branch setCurrent={setCurrent} setState={setState}/>}
      {current === 3 && <AddBranch/>}
      {current === 4 && <EditBranch state={state}/>}
      </div>
        </div>
    )
}

export default Dashboard