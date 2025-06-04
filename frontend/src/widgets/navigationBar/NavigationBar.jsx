import {useState} from 'react'
import './navigationBar.css'
import {useNavigate} from 'react-router-dom'

function NavigationBar({text,profile}){
    const [visible,setVisible] = useState(false)

    const Navigate = useNavigate()

    const handleClicks = () =>{
        setVisible(!visible)
    }

    const handleClicksoverlay = () =>{
        setVisible(false)
    }
    return(
        <nav>
            <div id='logo'>
            </div>
            <div id='center'>
            <div>{text.split('\n').map((line, index) => (
        <div className='text' key={index}>
          {line}
          <br />
        </div>
      ))}</div>
            </div>
            {profile &&
            <div id='person-icon' onClick={handleClicks}>
            </div>}
            {visible && 
            <div id='overlay' onClick={handleClicksoverlay}>
            <div id='list'  >
                <div className='item'>Change Password</div>
                <div className='item' onClick={() => Navigate('/')}>Logout</div>
            </div>
            </div>
            }
        </nav>
    )
}

export default NavigationBar;