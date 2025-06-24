import './button.css';
import { useRef } from 'react';

function Button({ name, onClick, type = "button" }) {
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    const button = buttonRef.current;
    const circle = document.createElement('div');
    circle.classList.add('ripple');

    const ripple = document.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  const handleClick = (e) => {
    createRipple(e);
    
    if (onClick && type !== "submit") {
      console.log('buttn cliced');
      onClick();
    } 
  };

  return (
    <button
      ref={buttonRef}
      id="button"
      className="submit-btn"
      onClick={handleClick}
      type={type}
      >
      {name}
    </button>
  );
}

export default Button;
