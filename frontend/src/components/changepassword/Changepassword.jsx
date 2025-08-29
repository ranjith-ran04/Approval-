import "./changepassword.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import Alert from "../../widgets/alert/Alert";
import axios from "axios";
import { host } from "../../constants/backendpath";
import { useLoader } from "../../context/LoaderContext";

function Changepassword() {
  const {hideLoader, showLoader} = useLoader();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [collegeCode, setCollegeCode] = useState(null);
  const location = useLocation();
  const logged = location.state?.logged || false;

  useEffect(() => {
    changeFetch();
  }, []);

  async function changeFetch() {
    showLoader();
    try {
      const res = await axios.get(`${host}changePassword`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        const c_code = res.data;
        setCollegeCode(c_code);
      }
    } catch (error) {
      // console.log(error);
      navigate("/");
    } finally{
      hideLoader();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm("All");
    setErrors(validationErrors);

    if (Object.values(validationErrors).every((val) => val === "")) {
      showLoader();
      try {
        const res = await axios.post(
          `${host}changePassword`,
          {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            collegeCode: collegeCode,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          setAlertType("success");
          setAlertMessage("Password changed successfully.");
          setShowAlert(true);
        }
      } catch (error) {
        // console.log(error);
        setAlertType("error");
        setAlertMessage(
          error.response?.data?.message || "Password change failed"
        );
        setShowAlert(true);
      } finally {
        hideLoader();
      }
    }
  };

  const handleCloseAlert = () => {
    if (alertType === "error") {
      setShowAlert(false);
      formData.confirmPassword = "";
      formData.newPassword = "";
      formData.oldPassword = "";
    } else {
      navigate("/dashboard", { state: { logged: true } });
    }
  };

  const validateForm = (name) => {
    const newErrors = { ...errors };

    if (name === "oldPassword" || name === "All") {
      const oldPassword = formData.oldPassword.trim();
      if (!oldPassword) {
        newErrors.oldPassword = "*Old password is required";
      } else if (oldPassword.length < 7) {
        newErrors.oldPassword = "*Old password must be at least 7 characters";
      } else {
        newErrors.oldPassword = "";
      }
    }

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
                focusedField === "oldPassword" ? "focused" : ""
              }`}
            >
              <span className="change-icon old-icon" />
              <input
                className="changeinput"
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={formData.oldPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField("oldPassword")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.oldPassword && (
              <p className="changeerror">{errors.oldPassword}</p>
            )}

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
                Change Password
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

export default Changepassword;
