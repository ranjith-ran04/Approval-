import React from 'react';
import './Header.css';
import tnlogo from './assets/logo.png'

const Header = () => (
  <div className="header-container">
    <img src={logo} alt="Tamil Nadu Logo" />
    <h2>DIRECTORATE OF TECHNICAL EDUCATION<br />(GOVERNMENT OF TAMILNADU)</h2>
    <h3>Lateral Entry B.E./B.Tech Admissions - 2024<br />Approval Process</h3>
  </div>
);

export default Header;