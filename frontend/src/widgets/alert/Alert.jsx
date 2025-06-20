import './Alert.css';

export const Alert = ({ type="success", message, show, close,okbutton,cancelbutton}) => {
  const renderIcon = () => {
    if (type === 'success') {
      return (
<<<<<<< HEAD:frontend/src/components/alert/Alert.js
        <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
          <circle cx="25" cy="25" r="25" fill="none" stroke="#4CAF50" strokeWidth="2" />
=======
        <svg className='alerticon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" strokeWidth="2" />
>>>>>>> 03565babffe92ea1cb1ae5157d9fe56696b7b8c0:frontend/src/widgets/alert/Alert.jsx
          <path
            fill="none"
            stroke="#4CAF50"
            strokeWidth="8"
            d="M14 27 L22 35 L38 19"
            strokeDasharray="30"
            strokeDashoffset="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate attributeName='stroke-dashoffset' from="50" to="0" dur="0.5s" fill="freeze" />
          </path>
        </svg>
      );
    } else if (type === 'error') {
      return (
        <svg className='alerticon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#F44336" strokeWidth="2" />
          <line x1="16" y1="16" x2="36" y2="36" stroke="#F44336" strokeWidth="5" />
          <line x1="36" y1="16" x2="16" y2="36" stroke="#F44336" strokeWidth="5" />
        </svg>
      );
    } else if (type === 'warning') {
      return (
        <svg className='alerticon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#FF9800" strokeWidth="2" />
          <line x1="26" y1="14" x2="26" y2="30" stroke="#FF9800" strokeWidth="5" />
          <circle cx="26" cy="38" r="2" fill="#FF9800" />
        </svg>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {show && (
        <>
          <div className='overlay'></div>
          <div className='alertbox'>
            <div className='icon-container'>
              {renderIcon()}
            </div>
            <p className='message'>{message}</p>
            <button className='button' onClick={okbutton}>OK</button>
            <button className='button' onClick={cancelbutton}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Alert;
