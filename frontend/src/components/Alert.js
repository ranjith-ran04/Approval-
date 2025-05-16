import './Alert.css'
export const Alert = ({message,show,close}) => {
  return (
    <div>
        {show &&(
            <>
            <div className='overlay'></div>
              <div className='alertbox'>
                <div className='tick-container'>
                  <svg className='tick' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" strokeWidth="2" />
                    <path fill="none" stroke="#4CAF50" strokeWidth="5" d="M14 27 L22 35 L38 19"  strokeDasharray="30" strokeDashoffset="30" strokeLinecap="round" strokeLinejoin="round" >
                      <animate attributeName='stroke-dashoffset' from="50" to="0" dur="0.5s" fill="freeze" />


                    </path>

                  </svg>

                </div>
                  <p className='message'>{message}</p>
                  <button className='button' onClick={close}>OK</button>
              </div>
             
                
            </>
        )}
    </div>
  );
};
export default Alert;
