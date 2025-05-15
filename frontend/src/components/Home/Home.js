import './home.css'
import NavigationBar from '../../widgets/NavigationBar';
import Button from '../../widgets/Button'
import Notes from '../../widgets/Notes'
import { useState } from 'react';

function Home() {
    const [open,setOpen] = useState(true)
    const [minimized,setMinimized] = useState(false)

    const handleClick = (para) =>{
        if(!para){
        setMinimized(true);
        setTimeout(() => setOpen(false), 0);
        }else{
        setOpen(para)
        setTimeout(() => setMinimized(false), 0);
    }
    }
    return(
        <div id = "container">
        {open && <Notes handleClick={handleClick} minimized = {minimized} />}
        {minimized && (
  <div className="minimized-icon" onClick={() => handleClick(true)}>
    📝
  </div>
)}
        <NavigationBar text = {'DIRECTORATE OF TECHNICAL EDUCATION \nTAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 \nAPPROVAL PROCESS'} profile = {true}/>
        <div id='body'>
        <div id='sidebar'>
        <div className='menuItems'>
            Home
        </div>
        <div className='menuItems'>
            College Details   
        </div>
        <div className='menuItems'>
            Branchwise Details   
        </div>
        <div className='menuItems'>
            Student Details   
        </div>
        <div className='menuItems'>
            Discontinued Details
        </div>
        <div className='menuItems'>
            Form A
        </div>
        <div className='menuItems'>
            Form B
        </div>
        <div className='menuItems'>
            Form C
        </div>
        <div className='menuItems'>
            Form D
        </div>
        <div className='menuItems'>
            Form G
        </div>
        <div className='menuItems'>
            Form LEA2025
        </div>
        <div className='menuItems'>
            Change Password
        </div>
        <div>
        <Button name={"SUBMIT"}/>
        </div>
        </div>
        <div id='center-body'>
            1.UNIVERSITY COLLEGE OF ENGINEERING
        </div>
        </div>
        </div>
    )
}

export default Home;