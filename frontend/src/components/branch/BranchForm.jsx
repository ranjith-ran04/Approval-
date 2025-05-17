import "./form.css";
import NavigationBar from "../../widgets/navigationBar/NavigationBar";
import MenuIcon from "../../widgets/menuicon/MenuIcon";
import {useState} from 'react'

function BranchForm({
  heading,
  values = {},
  onSubmit,
  buttonText,
  isEditMode = false,
}) {
  const [bool , setBool] = useState(false)

  return (
    <div>
    <MenuIcon bool={bool} setBool={setBool}/>
    <div id='main'>
      <NavigationBar
        text={
          "DIRECTORATE OF TECHNICAL EDUCATION \nTAMILNADU LATERAL ENTRY B.E/B.TECH ADMISSIONS-2025 \nAPPROVAL PROCESS"
        }
        profile={true}
      />
      <div className={`box1 ${bool ? 'shift' : ''}`}>
        <div className="form-container" style={{ paddingTop: "10px" }}>
          <h2 className="head">{heading}</h2>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="form-col">
              <label className="form-label">Branch Code</label>
              <input
                name="code"
                placeholder="Branch Code"
                defaultValue={values.code}
                required
                disabled={isEditMode}
              />

              <label className="form-label">Branch Name</label>
              <input
                name="name"
                placeholder="Branch Name"
                defaultValue={values.name}
                required
                disabled={isEditMode}
              />

              <label className="form-label">Approved Intake</label>
              <input
                name="approvedIntake"
                placeholder="Approved Intake"
                defaultValue={values.approvedIntake}
              />

              <label className="form-label">First Year Admitted</label>
              <input
                name="firstYearAdmitted"
                placeholder="First Year Admitted"
                defaultValue={values.firstYearAdmitted}
              />

              <label className="form-label">Discontinued</label>
              <input
                name="discontinued"
                placeholder="Discontinued"
                defaultValue={values.discontinued}
              />

              <label className="form-label">Transferred From</label>
              <input
                name="transferredFrom"
                placeholder="Transferred From"
                defaultValue={values.transferredFrom}
              />
            </div>

            <div className="form-col">
              <label className="form-label">Transferred To</label>
              <input
                name="transferredTo"
                placeholder="Transferred To"
                defaultValue={values.transferredTo}
              />

              <label className="form-label">LAP</label>
              <input name="lap" placeholder="LAP" defaultValue={values.lap} />

              <label className="form-label">Year of Start</label>
              <input
                name="yearStart"
                placeholder="Year of Start"
                defaultValue={values.yearStart}
              />

              <label className="form-label">Accreditation Upto</label>
              <input
                name="accUpto"
                placeholder="Accreditation Upto"
                defaultValue={values.accUpto}
              />

              <label className="form-label">NBA Status</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="nba"
                    value="Yes"
                    defaultChecked={values.nba === "Yes"}
                    required
                  />{" "}
                  Yes
                </label>
                <label style={{ marginLeft: "20px" }}>
                  <input
                    type="radio"
                    name="nba"
                    value="No"
                    defaultChecked={values.nba === "No"}
                  />{" "}
                  No
                </label>
              </div>

              <label className="spcllabel"></label>
              <button type="submit" className="submit-btn">
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default BranchForm;
