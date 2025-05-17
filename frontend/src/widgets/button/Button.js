import './button.css'
import { useRef } from 'react';

function Button ({name,onClick}){
    const buttonRef = useRef(null)

    const createRipple = (event) => {
        const button = buttonRef.current
        const circle = document.createElement('span')
        circle.classList.add('ripple')

        const ripple = document.getElementsByClassName('ripple')[0]

        if(ripple){
            ripple.remove()
        }

        button.appendChild(circle)
    }

    const handleClick = (e) => {
        createRipple(e)
        if(onClick){
            onClick(e)
        }
    }
    return(
        <div ref={buttonRef} id='button' onClick={handleClick}>
        {name}
        </div>
    )
}

export default Button;