import "./sidebar.css";
import Button from "../button/Button";
import handleForm from '../sidebar/pdfApi';

function Sidebar({ setCurrent }) {
  return (
    <div id="sidebar">
    <div id='iconDiv'>
      <div id="listIcon"></div></div>
      <div className="menuItems" onClick={() => setCurrent(0)}>
      <div id='homeIcon'></div>
        Home
      </div>
      <div className="menuItems" onClick={() => setCurrent(1)}>
      <div id='collegeIcon'></div>
        College Details
      </div>
      <div className="menuItems" onClick={() => setCurrent(2)}>
      <div id='branchIcon'></div>
        Branchwise Details
      </div>
      <div className="menuItems">
      <div id='studentIcon'></div>
      Student Details</div>
      <div className="menuItems">
      <div id='discontinuedIcon'></div>
      Discontinued Details</div>
      <div className="menuItems">
      <div id='formIcon'></div>
      Form A</div>
      <div className="menuItems" onClick={()=>handleForm('formb')}>
      <div id='formIcon'></div>
        Form B
      </div>
      <div className="menuItems">
      <div id='formIcon'></div>
      Form C</div>
      <div className="menuItems">
      <div id='formIcon'></div>
      Form D</div>
      <div className="menuItems" onClick={()=>handleForm('formd')}>
      <div id='formIcon'></div>
      Form G</div>
      <div className="menuItems" onClick={()=>handleForm('formfg')}>
      <div id='formIcon'></div>
      Form LEA2025</div>
      <div id='buttonDiv'>
        <Button name={"SUBMIT"} />
      </div>
    </div>
  );
}

export default Sidebar;
