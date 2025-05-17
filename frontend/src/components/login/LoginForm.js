import React, { useState } from 'react';
import './LoginForm.css';
import NavigationBar from '../../widgets/navigationBar/NavigationBar'; 
import Footer from './Footer'
const LoginForm = () => {
  const [focusedField, setFocusedField] = useState(null);

  return (
    <div className="login-container">
      <NavigationBar
        text={`DIRECTORATE OF TECHNICAL EDUCATION 
TAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 
APPROVAL PROCESS`}
        profile={false}
      />
      <div className='login-box'>
        <div className={`input-group ${focusedField === 'register' ? 'focused' : ''}`}>
          <span className="icon user-icon" />
      <div id='login'>
      <div className="login-box">
        <h3>Login Form</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Register Number"
            onFocus={() => setFocusedField('register')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div className={`input-group ${focusedField === 'password' ? 'focused' : ''}`}>
          <span className="icon lock-icon" />
          <input
            type="password"
            placeholder="Password"
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

      <button className="login-button">LOGIN</button>
    </div>
    </div>
  );
};

export default LoginForm;