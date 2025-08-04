import { useState } from "react";
import "./sidebar.css";
import Button from "../button/Button";
import handleForm from "../sidebar/pdfApi";

function Sidebar({ setCurrent, admin }) {
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
    { id: 4, iconId: "discontinuedIcon", label: "Discontinued Details" },
    {
      id: 5,
      iconId: "formIcon",
      label: "Form A",
      action: () => handleForm("forma"),
    },
    {
      id: 6,
      iconId: "formIcon",
      label: "Form B",
      action: () => handleForm("formb"),
    },
    {
      id: 7,
      iconId: "formIcon",
      label: "Form C",
      action: () => handleForm("formc"),
    },
    { id: 8, iconId: "formIcon", label: "Form D", action: () => handleForm("formd")},
    { id: 9, iconId: "formIcon", label: "Form FG", action: () => handleForm("formfg")},
    {
      id: 10,
      iconId: "formIcon",
      label: "Form LEA2025",
      action: () => handleForm("formlea"),
    },
  ];

  const adminMenuItems = [{ id: 0, label: "Home" ,action: () => setCurrent(0)},
    { id: 1, label: "Approved Details By college" ,action: () => setCurrent(1)}
  ];
  const collegeCode = '5901';
  const adminFormItems = [
    { id: 2, label: "Form A", action : () => handleForm("forma",true,collegeCode) },
    { id: 3, label: "Form B", action : () => handleForm("formb",true,collegeCode) },
    { id: 4, label: "Form C",action : () => handleForm("formc",true,collegeCode) },
    { id: 5, label: "Form D",action : () => handleForm("formd",true,collegeCode)},
    { id: 6, label: "Form FG",action : () => handleForm("formfg",true,collegeCode) },
    { id: 7, label: "Abstract Form" },
    { id: 8, label: "Note Order" },
    { id: 9, label: "Note Order-Approved" },
    { id: 10, label: "Note Order-Approved/Pending" },
    { id: 11, label: "Principal/Letter" },
    { id: 12, label: "Principal-Approved" },
    { id: 13, label: "Principal-Not Approved" },
  ];

  const adminFgaItems = [
    { id: 14, label: "OC/BCM/BC/MBC/DNC" },
    { id: 15, label: "SC/SCA" },
    { id: 16, label: "ST" },
  ];

  const adminFgItems = [
    { id: 17, label: "OC/BCM/BC/MBC/DNC" },
    { id: 18, label: "SC/SCA" },
    { id: 19, label: "ST" },
  ];

  const adminSubItems = [{ id: 20, label: "Student Details" }];
  const adminFormsItems = [{ id: 21, label: "Note Order-Approved" }];
  const adminFGItems = [
    { id: 22, label: "OC/BCM/BC/MBC/DNC" },
    { id: 23, label: "SC/SCA" },
    { id: 24, label: "ST" },
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
      if (index < 5) setActiveAdminId(index);
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
    <div id="sidebar" className={collapsed ? "collapsed" : ""} >
      <div id="iconDiv" onClick={toggleSidebar}>
        <div id="listIcon"></div>
      </div>

      {!admin ? (
        <>
          {items.map((item, index) => (
            <div
              style={{ fontWeight: "bold" }}
              key={item.id}
              className={`menuItems ${activeAdminId === index ? "active" : ""}`}
              onClick={() => handleItemClick(index, item.action)}
            >
              <div id={item.iconId}></div>
              {!collapsed && item.label}
            </div>
          ))}
          {!collapsed && (
            <div id="buttonDiv">
              <Button name="SUBMIT" />
            </div>
          )}
        </>
      ) : (
        <div id='sideMenu'>
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
                <Button name="College Details Pdf" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
