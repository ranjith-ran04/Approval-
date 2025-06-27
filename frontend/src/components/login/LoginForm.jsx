import { useState, useEffect } from "react";
import "./LoginForm.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import Alert from "../../widgets/alert/Alert";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    regNo: '',
    pwd: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const fieldsOrder = ['regNo', 'pwd'];

  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(true);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setAlertType("success");
      setAlertMessage("Logged in successfully.");
      setShowAlert(true);
      setShouldNavigate(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (shouldNavigate) {
      navigate('/dashboard');
    }
  };

  const validateForm = (forceTouch = false) => {
    const newErrors = {};

    if (touched.regNo || forceTouch) {
      if (!formData.regNo.trim()) {
        newErrors.regNo = '*Councelling code is required';
      } else if (!/^[0-9]+$/.test(formData.regNo.trim())) {
        newErrors.regNo = '*Councelling code can only contain numbers';
      }
    }

    if (touched.pwd || forceTouch) {
      if (!formData.pwd) {
        newErrors.pwd = '*Password is required';
      } else if (formData.pwd.length < 6) {
        newErrors.pwd = '*Password must be at least 6 characters';
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const currentIndex = fieldsOrder.indexOf(name);
    for (let i = 0; i < currentIndex; i++) {
      const field = fieldsOrder[i];
      if (!formData[field]) {
        setTouched((prev) => ({
          ...prev,
          [field]: true,
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-page">
      <NavigationBar
        text={`GOVERNMENT OF TAMILNADU
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
        profile={true}
        bool={true}
      />

      <div className="login-page">
  <div className="login-container">
    <div className="login-box">
    <div id="icon-container">
      <div id="login-logo"></div></div>
      <form className="loginform" onSubmit={handleSubmit}>
        <div className={`input-group ${focusedField === "register" ? "focused" : ""}`}>
          <span className="icon user-icon" />
          <input
            className="logininput"
            type="text"
            name="regNo"
            placeholder="Counselling Code"
            value={formData.regNo}
            onChange={handleChange}
            onFocus={() => setFocusedField("register")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        {errors.regNo && <p className="error">{errors.regNo}</p>}

        <div className={`input-group ${focusedField === "password" ? "focused" : ""}`}>
          <span className="icon lock-icon" />
          <input
            className="logininput"
            type="password"
            name="pwd"
            placeholder="Password"
            value={formData.pwd}
            onChange={handleChange}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
        {errors.pwd && <p className="error">{errors.pwd}</p>}

        <div>
          <button type="submit" className="login-button">LOGIN</button>
          <Alert
            type={alertType}
            message={alertMessage}
            show={showAlert}
            okbutton={handleCloseAlert}
          />
        </div>
      </form>
    </div>
  </div>
</div>


      <Footer />
    </div>
  );
};

export default LoginForm;
