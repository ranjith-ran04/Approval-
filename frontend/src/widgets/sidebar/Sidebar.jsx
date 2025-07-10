import "./sidebar.css";
import Button from "../button/Button";
import handleForm from '../sidebar/pdfApi'

function Sidebar({ setCurrent }) {
  return (
    <div id="sidebar">
      <div className="menuItems" onClick={() => setCurrent(0)}>
        Home
      </div>
      <div className="menuItems" onClick={() => setCurrent(1)}>
        College Details
      </div>
      <div className="menuItems" onClick={() => setCurrent(2)}>
        Branchwise Details
      </div>
      <div className="menuItems">Student Details</div>
      <div className="menuItems">Discontinued Details</div>
      <div className="menuItems">Form A</div>
      <div className="menuItems" onClick={()=>handleForm('formb',{collegeCode:1})}>
        Form B
      </div>
      <div className="menuItems">Form C</div>
      <div className="menuItems">Form D</div>
      <div className="menuItems">Form G</div>
      <div className="menuItems" onClick={()=>handleForm('formlea',{allot_coll_code:1315})}>Form LEA2025</div>
      <div>
        <Button name={"SUBMIT"} />
      </div>
    </div>
  );
}

export default Sidebar;
