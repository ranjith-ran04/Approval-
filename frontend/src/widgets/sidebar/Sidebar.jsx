import { useEffect, useState } from "react";
import "./sidebar.css";
import Button from "../button/Button";
import handleForm from "../sidebar/pdfApi";
import Alert from "../alert/Alert";
import { host } from "../../constants/backendpath";
import axios from "axios";

function Sidebar({ setCurrent, admin }) {
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertStage, setAlertStage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});

  const handlecloseAlert = () => {
    setShowAlert(false);
  };

  const getFreezed = async () => {
    try {
      const result = await axios.get(`${host}getFreezed`, {
        withCredentials: true,
      });
      // console.log("getFreezed ", result.data[0].freezed);
      if (result.data[0].freezed === "1") {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Cannot retreieve Freezed state : ", err);
    }
  };

  useEffect(() => {
    getFreezed();
  }, []);

  const handleSubmit = () => {
    setShowAlert(true);
    setAlertMessage(
      "Are you sure you want to submit? You cannot EDIT after this!!!"
    );
    setAlertStage("confirm");
    setAlertType("warning");

    setAlertOkAction(() => async () => {
      try {
        await axios.post(`${host}submit`, {}, { withCredentials: true });

        setSubmitted(true);
        setCurrent(0);
        setAlertMessage("Submitted Successfully!");
        setAlertStage("success");
        setAlertType("success");
        setAlertOkAction(() => () => setShowAlert(false));
      } catch (err) {
        console.error("Submit failed : ", err);
        setAlertMessage("Failed to Submit. Try again.");
        setAlertStage("error");
        setAlertType("error");
        setAlertOkAction(() => () => setShowAlert(false));
      }
    });
  };

  const items = [
    { id: 0, iconId: "homeIcon", label: "Home", action: () => setCurrent(0) },
    {
      id: 1,
      iconId: "collegeIcon",
      label: "College Details",
      action: () => setCurrent(1),
    },
    {
      id: 2,
      iconId: "branchIcon",
      label: "Branchwise Details",
      action: () => setCurrent(2),
    },
    {
      id: 3,
      iconId: "studentIcon",
      label: "Student Details",
      action: () => setCurrent(5),
    },
    {
      id: 4,
      iconId: "discontinuedIcon",
      label: "Discontinued Details",
      action: () => setCurrent(6),
    },
    {
      id: 5,
      iconId: "formAIcon",
      label: "Form A",
      action: () => handleForm("forma"),
    },
    {
      id: 6,
      iconId: "formBIcon",
      label: "Form B",
      action: () => handleForm("formb"),
    },
    {
      id: 7,
      iconId: "formCIcon",
      label: "Form C",
      action: () => handleForm("formc"),
    },
    {
      id: 8,
      iconId: "formDIcon",
      label: "Form D",
      action: () => handleForm("formd"),
    },
    {
      id: 9,
      iconId: "formFGIcon",
      label: "Form FG",
      action: () => handleForm("formfg"),
    },
    {
      id: 10,
      iconId: "formLEAIcon",
      label: "Form LEA2025",
      action: () => handleForm("formlea"),
    },
    {
      id: 11,
      iconId: "formApproved",
      label: "Approved Details",
      action: () =>
        handleForm(
          "formApprv",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
    },
    {
      id: 12,
      iconId: "formNotApproved",
      label: "Not Approved Details",
      action: () =>
        handleForm(
          "formApprv",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
    },
  ];

  const adminMenuItems = [
    { id: 0, label: "Home", iconId: "homeIcon", action: () => setCurrent(0) },
    {
      id: 1,
      label: "Approved Details By college",
      iconId: "studentIcon",
      action: () => setCurrent(1),
    },
  ];
  const collegeCode = "5901";
  const adminFormItems = [
    {
      id: 2,
      label: "Form A",
      iconId: "formIcon",
      action: () => handleForm("forma", true, collegeCode),
    },
    {
      id: 3,
      label: "Form B",
      iconId: "formIcon",
      action: () => handleForm("formb", true, collegeCode),
    },
    {
      id: 4,
      label: "Form C",
      iconId: "formIcon",
      action: () => handleForm("formc", true, collegeCode),
    },
    {
      id: 5,
      label: "Form D",
      iconId: "formIcon",
      action: () => handleForm("formd", true, collegeCode),
    },
    {
      id: 6,
      label: "Form FG",
      iconId: "formIcon",
      action: () => handleForm("formfg", true, collegeCode),
    },
    { id: 7, label: "Abstract Form", iconId: "formIcon" },
    { id: 8, label: "Note Order", iconId: "formIcon" },
    { id: 9, label: "Note Order-Approved", iconId: "formIcon" },
    { id: 10, label: "Note Order-Approved/Pending", iconId: "formIcon" },
    { id: 11, label: "Principal/Letter", iconId: "formIcon" },
    {
      id: 12,
      label: "Principal-Approved",
      action: () => handleForm("principal-approved", admin),
    },
    {
      id: 13,
      label: "Principal-Not Approved",
      action: () => handleForm("principal-notapproved", admin),
    },
  ];

  const adminFgaItems = [
    {
      id: 14,
      label: "OC/BCM/BC/MBC/DNC",
      iconId: "formIcon",
      action: () =>
        handleForm(
          "fg_form",
          true,
          collegeCode,
          ["oc", "bc", "bcm", "mbc"],
          true
        ),
    },
    {
      id: 15,
      label: "SC/SCA",
      iconId: "formIcon",
      action: () =>
        handleForm("fg_form", true, collegeCode, ["sc", "sca"], true),
    },
    {
      id: 16,
      label: "ST",
      iconId: "formIcon",
      action: () => handleForm("fg_form", true, collegeCode, ["st"], true),
    },
  ];

  const adminFgItems = [
    {
      id: 17,
      label: "OC/BCM/BC/MBC/DNC",
      iconId: "formIcon",
      action: () =>
        handleForm(
          "fg_form",
          true,
          collegeCode,
          ["oc", "bc", "bcm", "mbc"],
          false
        ),
    },
    {
      id: 18,
      label: "SC/SCA",
      iconId: "formIcon",
      action: () =>
        handleForm("fg_form", true, collegeCode, ["sc", "sca"], false),
    },
    {
      id: 19,
      label: "ST",
      iconId: "formIcon",
      action: () => handleForm("fg_form", true, collegeCode, ["st"], false),
    },
  ];

  const adminSubItems = [
    {
      id: 20,
      label: "Student Details",
      iconId: "studentIcon",
      action: () => setCurrent(2),
    },
  ];
  const adminFormsItems = [
    { id: 21, label: "Note Order-Approved", iconId: "formIcon" },
  ];
  const adminFGItems = [
    {
      id: 22,
      label: "OC/BCM/BC/MBC/DNC",
      iconId: "formIcon",
      action: () =>
        handleForm(
          "fg_form",
          true,
          collegeCode,
          ["oc", "bc", "bcm", "mbc"],
          true,
          true
        ),
    },
    {
      id: 23,
      label: "SC/SCA",
      iconId: "formIcon",
      action: () =>
        handleForm("fg_form", true, collegeCode, ["sc", "sca"], true, true),
    },
    {
      id: 24,
      label: "ST",
      iconId: "formIcon",
      action: () =>
        handleForm("fg_form", true, collegeCode, ["st"], true, true),
    },
  ];

  const sideBarList = [
    [adminMenuItems, "MENU"],
    [adminFormItems, "FORM GENERATION"],
    [adminFgaItems, "FG APPROVED"],
    [adminFgItems, "FG NOT APPROVED"],
    [adminSubItems, "SUPPLEMENTARY APPROVAL"],
    [adminFormsItems, "FORMS"],
    [adminFGItems, "FG"],
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [activeAdminId, setActiveAdminId] = useState(0);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleItemClick = (index, action) => {
    if (!admin) {
      if (index < 7) setActiveAdminId(index);
      if (action) action();
    }
  };

  const handleAdminClick = (id, action) => {
    if (id === 0 || id === 1 || id === 20) {
      setActiveAdminId(id);
    }
    if (action) action();
  };

  return (
    <div
      id="sidebar"
      className={collapsed ? "collapsed" : ""}
      style={{ paddingRight: admin ? "0px" : collapsed ? "0px" : "13px" }}
    >
      <div id="iconDiv" onClick={toggleSidebar}>
        <div id="listIcon"></div>
      </div>
      {!admin ? (
        <>
          {items
            .filter((item) => {
              if (submitted) {
                if (
                  item.id === 1 ||
                  item.id === 2 ||
                  item.id === 3 ||
                  item.id === 4
                ) {
                  return false;
                }
                return true;
              } else {
                if (item.id === 11 || item.id === 12) {
                  return false;
                }
                return true;
              }
            })
            .map((item, index) => (
              <div
                style={{ fontWeight: "bold" }}
                key={item.id}
                className={`menuItems ${
                  activeAdminId === index ? "active" : ""
                }`}
                onClick={() => handleItemClick(index, item.action)}
              >
                <div id={item.iconId}></div>
                {!collapsed && item.label}
              </div>
            ))}
          {!collapsed && !submitted && (
            <div id="buttonDiv">
              <Button name="FREEZE" onClick={handleSubmit} />
            </div>
          )}
        </>
      ) : (
        <div id="sideMenu">
          <br />
          {sideBarList.map(([list, title], sectionIndex) => (
            <div key={sectionIndex}>
              {!collapsed && (
                <div className="sectionTitle" style={{ fontWeight: "bold" }}>
                  {title}
                </div>
              )}
              {list.map((item) => (
                <div
                  key={item.id}
                  className={`menuItems 
                    ${item.id === activeAdminId ? "active" : ""}
                    ${item.id !== 0 && item.id !== 20 ? "nonActive" : ""}
                  `}
                  onClick={() => handleAdminClick(item.id, item.action)}
                >
                  <div id={item.iconId}></div>
                  {!collapsed && item.label}
                </div>
              ))}
              <br />
            </div>
          ))}
          {!collapsed && (
            <>
              <div id="sideCollegeDetails">COLLEGE DETAILS</div>
              <div id="buttonDiv">
                <Button
                  name="College Details Pdf"
                  onClick={() => handleForm("collegeDetails", true, 5901, true)}
                />
              </div>
            </>
          )}
        </div>
      )}
      <Alert
        type={alertType}
        message={alertMessage}
        show={showAlert}
        okbutton={alertOkAction}
        cancelbutton={alertStage === "confirm" ? handlecloseAlert : null}
      />
    </div>
  );
}

export default Sidebar;
