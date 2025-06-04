import { useState, useEffect } from 'react';
import './LoginForm.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../widgets/navigationBar/NavigationBar';

const LoginForm = () => {
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  useEffect(() => {
    localStorage.setItem('value', true);
  }, []);

  return (
    <div className="login-page">
      <NavigationBar
        text={`DIRECTORATE OF TECHNICAL EDUCATION 
TAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 
APPROVAL PROCESS`}
        profile={false}
      />

      <div className="login-container">
        <div className="login-box">
          <h3>Login Form</h3>
          <form onSubmit={handleSubmit}>
            <div className={`input-group ${focusedField === 'register' ? 'focused' : ''}`}>
              <span className="icon user-icon" />
              <input className="logininput"
                type="text"
                placeholder="Register Number"
                onFocus={() => setFocusedField('register')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={`input-group ${focusedField === 'password' ? 'focused' : ''}`}>
              <span className="icon lock-icon" />
              <input className="logininput"
                type="password"
                placeholder="Password"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <button type="submit" className="login-button">LOGIN</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginForm;
