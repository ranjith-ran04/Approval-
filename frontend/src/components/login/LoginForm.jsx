import { useState, useEffect } from "react";
import "./LoginForm.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import Alert from "../../widgets/alert/Alert";
import axios from "axios";
import { host, adminhost } from "../../constants/backendpath";

const LoginForm = ({ admin }) => {
  const [formData, setFormData] = useState({ regNo: "", pwd: "" });
  const [focusedField, setFocusedField] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [changed, setChanged] = useState(0);
  const [loginStatus, setLoginStatus] = useState(null);

  const navigate = useNavigate();
  const fieldsOrder = ["regNo", "pwd"];

  useEffect(() => {
    validateForm();
  }, [formData, touched]);
  useEffect(() => {
    async function fetchLogin() {
      try {
        const res = await axios.get(`${admin ? adminhost : host}login`, {
          withCredentials: true,
        });
        if(res.status === 250 ){
          navigate("/");
        }
        if (res.status === 200) {
          navigate(`${admin ? "/admin/dashboard" : "/dashboard"}`, {
            state: {
              logged: true,
            },
          });
        }
      } catch (error) {
        console.warn(error);
      }
    }
    fetchLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(true);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${admin ? adminhost : host}login`,
          {
            counsellingCode: formData.regNo,
            password: formData.pwd,
          },
          { withCredentials: true }
        );
        const changeFlag = response.data.changed;
        setChanged(changeFlag);
        localStorage.setItem("collegeCode", formData.regNo);
        setLoginStatus("success");
        setAlertType("success");
        setAlertMessage("Logged in successfully.");
        setShowAlert(true);
      } catch (error) {
        setLoginStatus("error");
        setAlertType("error");
        setAlertMessage(error.response?.data?.message || "Login failed");
        setShowAlert(true);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const currentIndex = fieldsOrder.indexOf(name);
    for (let i = 0; i < currentIndex; i++) {
      const field = fieldsOrder[i];
      if (!formData[field]) {
        setTouched((prev) => ({ ...prev, [field]: true }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (forceTouch = false) => {
    const newErrors = {};

    if (touched.regNo || forceTouch) {
      if (!formData.regNo.trim()) {
        newErrors.regNo = "*Counselling code is required";
      } else if (!/^[0-9]+$/.test(formData.regNo.trim()) && !admin) {
        newErrors.regNo = "*Counselling code must be numeric";
      }
    }

    if (touched.pwd || forceTouch) {
      if (!formData.pwd) {
        newErrors.pwd = "*Password is required";
      } else if (formData.pwd.length < 6 && !admin) {
        newErrors.pwd = "*Password must be at least 6 characters";
      }
    }

    return newErrors;
  };

  const handleCloseAlert = () => {
    if (changed === 0) {
      navigate("/resetPassword", {
        state: {
          collegeCode: formData.regNo,
        },
      });
    } else if (changed === 2) {
      navigate(`${admin ? "/admin/dashboard" : "/dashboard"}`, {
        state: {
          logged: true,
        },
      });
    }else {
      navigate(`${admin ? "/admin/dashboard" : "/dashboard"}`, {
        state: {
          logged: true,
        },
      });
    }
  };

  const handleInvalid = () => {
    setShowAlert(false);
  };

  return (
    <div className="login-page">
      <NavigationBar
        text={`GOVERNMENT OF TAMILNADU
Tamilnadu Lateral Entry Direct Second Year B.E/B.Tech., Admissions Approval-2025`}
        profile={true}
        bool={true}
        login={true}
      />
      <div className="login-container">
        <div className="login-box">
          <div id="icon-container">
            <div id="login-logo"></div>
          </div>
          <form className="loginform" onSubmit={handleSubmit}>
            <div
              className={`input-group ${
                focusedField === "register" ? "focused" : ""
              }`}
            >
              <span className="icon user-icon" />
              <input
                className="logininput"
                type="text"
                name="regNo"
                placeholder={admin ? "Name" : "Counselling Code"}
                value={formData.regNo}
                onChange={handleChange}
                onFocus={() => setFocusedField("register")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {errors.regNo && <p className="error">{errors.regNo}</p>}

            <div
              className={`input-group ${
                focusedField === "password" ? "focused" : ""
              }`}
            >
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

            <button type="submit" className="login-button">
              LOGIN
            </button>

            <Alert
              type={alertType}
              message={alertMessage}
              show={showAlert}
              okbutton={
                loginStatus === "success" ? handleCloseAlert : handleInvalid
              }
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
