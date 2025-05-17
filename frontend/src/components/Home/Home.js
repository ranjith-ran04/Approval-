import './home.css'
import NavigationBar from '../../widgets/navigationBar/NavigationBar'
import Button from '../../widgets/button/Button'
import Notes from '../../widgets/notes/Notes'
import { useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
const NOTE_KEY = "hasseen"

function Home() {
    const [open,setOpen] = useState(false)
    const [minimized,setMinimized] = useState(false)
    const navigate = useNavigate()

    const handleNavigation = () => {
        navigate('/collegeDetails')
    }

    useEffect(() => {
        const has = localStorage.getItem(NOTE_KEY) === "true"
        
        if(!has){
            setOpen(true)
            localStorage.setItem(NOTE_KEY,'true')
        }
        else{
            setMinimized(true)
        }
   }, [])

    const handleClick = (para) =>{
        if(!para){
        setMinimized(true);
        setOpen(false)
        }else{
        setOpen(para)
        setMinimized(false);
    }
    }

    const details = {
        Taluk : 'Mambam',
        Contituency : 'Mylapore',
        District : 'Chennai',
        Pincode : '620001'
    }

    const contactDetails = {
        Chairman : 'Vishnu (ph.no:9897969594)',
        Principal : 'Dr.K.S.EASWARAKUMAR (ph.no:04422358491)',
        College : '4422358491'
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
        <div className='menuItems' onClick={() => navigate('/home')}>
            Home
        </div>
        <div className='menuItems' onClick={handleNavigation}>
            College Details   
        </div>
        <div className='menuItems' onClick={() => navigate("/branch")}>
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
        <div>
        <Button name={"SUBMIT"}/>
        </div>
        </div>
        <div id='center-b'>
        <div id='center-body'>
            1.UNIVERSITY COLLEGE OF ENGINEERING
        </div>
        <div id='wrap'>
        <div id='first-body'>
        <div className='one' id='p'>
        <strong>Taluk</strong>
        <div>: {details.Taluk}</div>
        </div>
        <div className='one' id='o'>
        <strong>Constituency </strong>
        <div>: {details.Contituency}</div>
        </div>
        <div className='one' id='q'>
        <strong>District </strong>
        <div>: {details.District}</div>
        </div>
        <div className='one' id='r'>
        <strong>Pincode </strong>
        <div>: {details.Pincode}</div>
        </div>
        </div>
        <div id='second-body'>
        <div className='one'>
        <strong>CONTACT</strong>
        </div>
        <div className='one' id='y'>
        <strong>Chairman </strong>
        <div>: {contactDetails.Chairman}</div>
        </div>
        <div className='one' id='u'>
        <strong>Principal/Dean </strong>
        <div>: {contactDetails.Principal}</div>
        </div>
        <div className='one' id='i'>
        <strong>College Contact No </strong>
        <div>: {contactDetails.College}</div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Home;
