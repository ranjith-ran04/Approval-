import {useState} from 'react'
import './navigationBar.css'

function NavigationBar({text,profile}){
    const [visible,setVisible] = useState(false)

    const handleClick = () =>{
        setVisible(!visible)
    }
    return(
        <nav>
            <div id='logo'>
            </div>
            <div id='center'>
            <h3>{text.split('\n').map((line, index) => (
        <div className='text' key={index}>
          {line}
          <br />
        </div>
      ))}</h3>
            </div>
            <div id='person'>
            {profile &&
            <div id='person-icon' onClick={handleClick}>
            </div>}
            {visible && 
            <div id='list'>
                <div className='item'>Change Password</div>
                <div className='item'>Logout</div>
            </div>
            }
            </div>
        </nav>
    )
}

export default NavigationBar;