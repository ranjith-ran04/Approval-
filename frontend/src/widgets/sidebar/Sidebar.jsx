import { useState } from "react";
import "./sidebar.css";
import Button from "../button/Button";
import handleForm from "../sidebar/pdfApi";

function Sidebar({ setCurrent }) {
  const items = [
    { id: 0, iconId: "homeIcon", label: "Home", action: () => setCurrent(0) },
    { id: 1, iconId: "collegeIcon", label: "College Details", action: () => setCurrent(1) },
    { id: 2, iconId: "branchIcon", label: "Branchwise Details", action: () => setCurrent(2) },
    { id: 3, iconId: "studentIcon", label: "Student Details", action: () => setCurrent(5)},
    { id: 4, iconId: "discontinuedIcon", label: "Discontinued Details" },
    { id: 5, iconId: "formIcon", label: "Form A", action: () => handleForm("forma") },
    { id: 6, iconId: "formIcon", label: "Form B", action: () => handleForm("formb") },
    { id: 7, iconId: "formIcon", label: "Form C", action: () => handleForm("formc") },
    { id: 8, iconId: "formIcon", label: "Form D" },
    { id: 9, iconId: "formIcon", label: "Form FG" },
    { id: 10, iconId: "formIcon", label: "Form LEA2025", action:()=> handleForm("formlea")},
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [activeItems, setActiveItems] = useState([true,false,false,false,false]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const handleItemClick = (index, action) => {
    if(index<5)
    setActiveItems(prev => prev.map((_, i) => i === index ? true : false));
    if (action) action();
  };

  return (
    <div id="sidebar" className={collapsed ? "collapsed" : ""}>
      <div id="iconDiv" onClick={toggleSidebar}>
        <div id="listIcon"></div>
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          className={`menuItems ${activeItems[index] ? "active" : ""}`}
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
    </div>
  );
}

export default Sidebar;
