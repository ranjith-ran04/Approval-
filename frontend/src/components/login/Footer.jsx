import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="alt-footer">
      <div className="footer-section">
        <h4>Contact Us</h4>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfr6ePqeGayQ81x5YkfWXLEvk9GgvJ9ztIO7eV9OZ7mvCpH3w/viewform?usp=header" target='blank'>Google Form</a>
        <p>THE SECRETARY</p>
        <p>LATERAL ENTRY ADMISSIONS - 2025</p>
      </div>
      <div className="footer-section">
        <h4>Email</h4>
        <p>tnleaapproval25@gmail.com</p>
      </div>
      <div className="footer-section">
        <h4>Address</h4>
        <p>Alagappa Chettiar</p>
        <p>Govt. College of Engineering & Technology</p>
        <p>Karaikudi - 630003, Sivagangai</p>
      </div>
    </footer>
  );
};

export default Footer;