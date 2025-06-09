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
        text={`GOVERNMENT OF TAMILNADU
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
        profile={true}
        style={{marginLeft:'350px'}}
        bool={true}
      />

      <div className="login-container">
        <div className="login-box">
          <h3>Login Form</h3>
          <form className="loginform" onSubmit={handleSubmit}>
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
