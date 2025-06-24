import './menuIcon.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function MenuIcon ({bool ,setBool}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
    setBool(!bool)
  };

  const navigate =useNavigate()

  return (
    <div className="App">
        <button className={`menu-button ${drawerOpen ? 'open' : '' }`} onClick={toggleDrawer}>
          ☰
        </button>
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div id='menu-items'>
        <div className='menuItems-icon' onClick={() => navigate('/home')}>
            Home
        </div>
        <div className='menuItems-icon' onClick={() => navigate('/collegeDetails')}>
            College Details   
        </div>
        <div className='menuItems-icon' onClick={() => navigate("/branch")}>
            Branchwise Details   
        </div>
        <div className='menuItems-icon'>
            Student Details   
        </div>
        <div className='menuItems-icon'>
            Discontinued Details
        </div>
        <div className='menuItems-icon'>
            Form A
        </div>
        <div className='menuItems-icon'>
            Form B
        </div>
        <div className='menuItems-icon'>
            Form C
        </div>
        <div className='menuItems-icon'>
            Form D
        </div>
        <div className='menuItems-icon'>
            Form G
        </div>
        <div className='menuItems-icon'>
            Form LEA2025
        </div>
        </div>
      </div>
    </div>
  )
}
export default MenuIcon