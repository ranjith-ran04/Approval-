import React, { useState } from 'react';
import './LoginForm.css';
import NavigationBar from '../../widgets/navigationBar/NavigationBar'; 
import Footer from './Footer'
const LoginForm = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in with ${code}`);
  };

  return (
    <div className="login-container">
      <NavigationBar
        text={`DIRECTORATE OF TECHNICAL EDUCATION 
TAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 
APPROVAL PROCESS`}
        profile={false}
      />
      <div id='login'>
      <div className="login-box">
        <h3>Login Form</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Counselling Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
          <button type="submit">Log In</button>
        </form>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LoginForm;
