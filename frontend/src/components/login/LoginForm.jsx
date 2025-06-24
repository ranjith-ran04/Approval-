import { useState} from "react";
import "./LoginForm.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import Alert from "../../widgets/alert/Alert";

const LoginForm = () => {
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertType("success");
    setAlertMessage("Logged in successfully.");
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if(shouldNavigate){
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <NavigationBar
        text={`GOVERNMENT OF TAMILNADU
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
        profile={true}
        style={{ marginLeft: "350px" }}
        bool={true}
      />

      <div className="login-container">
        <div className="login-box">
          <h3>Login Form</h3>
          <form className="loginform" onSubmit={(e) => {
            e.preventDefault();
            setShouldNavigate(true);
            handleSubmit(e);
          }}>
            <div
              className={`input-group ${
                focusedField === "register" ? "focused" : ""
              }`}
            >
              <div className="icon-user-icon" ></div>
              <input
                className="logininput"
                type="text"
                placeholder="Register Number"
                onFocus={() => setFocusedField("register")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div
              className={`input-group ${
                focusedField === "password" ? "focused" : ""
              }`}
            >
              <div className="icon-lock-icon"></div>
              <input
                className="logininput"
                type="password"
                placeholder="Password"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <button type="submit" className="login-button">
                LOGIN
              </button>
              <Alert
                type={alertType}
                message={alertMessage}
                show={showAlert}
                close={handleCloseAlert}
              />
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginForm;