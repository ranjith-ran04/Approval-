import "./changepassword.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import Alert from "../../widgets/alert/Alert";
import axios from "axios";
import { host } from "../../constants/backendpath";

function Resetpassword() {
  const location = useLocation();
  const collegeCode = location.state?.collegeCode || null;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
//   console.log(collegeCode);
  const handleSubmit = async (e) => {
    // console.log("inside hanlesubmit");
    e.preventDefault();
    const validationErrors = validateForm("All");
    setErrors(validationErrors);

    if (Object.values(validationErrors).every((val) => val === "")) {
      try {
        const res = await axios.post(`${host}resetPassword`, {
          newPassword: formData.newPassword,
          collegeCode: collegeCode,
        });
        // console.log(res);
        if (res.status === 200) {
          setAlertType("success");
          setAlertMessage("Password reset successfully.");
          setShowAlert(true);
        }
      } catch (error) {
        setAlertType("error");
        setAlertMessage(
          error.response?.data?.message || "Password reset failed"
        );
        setShowAlert(true);
      }
    }
  };

  const handleCloseAlert = () => {
    if (alertType === "error") {
      setShowAlert(false);
      setFormData({ newPassword: "", confirmPassword: "" });
    } else {
      navigate("/");
    }
  };

  const validateForm = (name) => {
    const newErrors = { ...errors };

    if (name === "newPassword" || name === "All") {
      const newPassword = formData.newPassword.trim();
      if (!newPassword) {
        newErrors.newPassword = "*New password is required";
      } else if (newPassword.length < 7) {
        newErrors.newPassword = "*New password must be at least 7 characters";
      } else {
        newErrors.newPassword = "";
      }
    }

    if (name === "confirmPassword" || name === "All") {
      const confirmPassword = formData.confirmPassword.trim();
      const newPassword = formData.newPassword.trim();
      if (!confirmPassword) {
        newErrors.confirmPassword = "*Confirm password is required";
      } else if (confirmPassword.length < 7) {
        newErrors.confirmPassword =
          "*Confirm password must be at least 7 characters";
      } else if (confirmPassword !== newPassword) {
        newErrors.confirmPassword = "*Confirm password must match new password";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validationErrors = validateForm(name);
    setErrors(validationErrors);
  };

  return (
    <div className="change-page">
      <NavigationBar
        text={`GOVERNMENT OF TAMILNADU
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech.,Approval-2025`}
        profile={true}
        bool={false}
        login={true}
      />
      <div className="change-container">
        <div className="change-box">
          <div id="change-icon-container">
            <div id="change-logo"></div>
          </div>
          <form className="changeform" onSubmit={handleSubmit}>
            <div
              className={`change-input-group ${
                focusedField === "newPassword" ? "focused" : ""
              }`}
            >
              <span className="change-icon new-icon" />
              <input
                className="changeinput"
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.newPassword && (
              <p className="changeerror">{errors.newPassword}</p>
            )}

            <div
              className={`change-input-group ${
                focusedField === "confirmPassword" ? "focused" : ""
              }`}
            >
              <span className="change-icon confirm-icon" />
              <input
                className="changeinput"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="changeerror">{errors.confirmPassword}</p>
            )}

            <div>
              <button type="submit" className="login-button">
                Reset Password
              </button>
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
  );
}

export default Resetpassword;
