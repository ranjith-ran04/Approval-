import { useState } from "react";
import "./navigationBar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { host } from "../../constants/backendpath";

function NavigationBar({
  text,
  profile,
  bool,
  setCurrent,
  login,
  admin,
  style,
}) {
  const [visible, setVisible] = useState(false);

  const Navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${host}logout`, { withCredentials: true });
      if (res.status === 200) {
        if (admin) {
          Navigate("/admin/login");
        } else {
          Navigate("/");
          sessionStorage.setItem("notesShown", "");
          localStorage.setItem("current",0);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleClicks = () => {
    if (!bool) {
      setVisible(!visible);
    } else {
      setVisible(false);
    }
    if (admin) {
      handleLogOut();
    }
  };

  const handleClicksoverlay = () => {
    setVisible(false);
  };
  return (
    <nav>
      <div
        id="logo"
        onClick={() => {
          login ? setCurrent(0) : (login = false) ;
        }}
      ></div>
      <div id="center">
        <div>
          {text.split("\n").map((line, index) => (
            <div className="text" key={index}>
              {line}
              <br />
            </div>
          ))}
        </div>
      </div>
      {profile && <div id="person-icon" onClick={handleClicks}></div>}
      {visible && !admin && (
        <div id="overlay1" onClick={handleClicksoverlay}>
          <div id="list" style={style}>
            <div className="item" onClick={() => Navigate("/changePassword")}>
              Change Password
            </div>
            <div className="item" onClick={handleLogOut}>
              Logout
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
