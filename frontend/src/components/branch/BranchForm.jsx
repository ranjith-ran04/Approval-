import React, { useState } from "react";
import "./form.css";
import Button from "../../widgets/button/Button";
import Alert from "../../widgets/alert/Alert";

function BranchForm({
  heading,
  values = {},
  onSubmit,
  buttonText,
  isEditMode = false,
  msg,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = () => {
    setShowAlert(true);
    setAlertType("success");
    setAlertMessage(msg);
  };
  const handleCancel = () => {
    setShowAlert(true);
    setAlertMessage("Confirm to Cancel");
    setAlertType("warning");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="box1">
      <div className="form-container" style={{ paddingTop: "10px" }}>
        <h2 className="head">{heading}</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="form-col">
            <label className="form-label">Branch Code</label>
            <input
              className="branchforminput"
              name="code"
              placeholder="Branch Code"
              defaultValue={values.code}
              required
              disabled={isEditMode}
            />

            <label className="form-label">Branch Name</label>
            <input
              className="branchforminput"
              name="name"
              placeholder="Branch Name"
              defaultValue={values.name}
              required
              disabled={isEditMode}
            />

            <label className="form-label">Approved Intake</label>
            <input
              className="branchforminput"
              name="approvedIntake"
              placeholder="Approved Intake"
              defaultValue={values.approvedIntake}
            />

            <label className="form-label">First Year Admitted</label>
            <input
              className="branchforminput"
              name="firstYearAdmitted"
              placeholder="First Year Admitted"
              defaultValue={values.firstYearAdmitted}
            />

            <label className="form-label">Discontinued</label>
            <input
              className="branchforminput"
              name="discontinued"
              placeholder="Discontinued"
              defaultValue={values.discontinued}
            />

            <label className="form-label">Transferred From</label>
            <input
              className="branchforminput"
              name="transferredFrom"
              placeholder="Transferred From"
              defaultValue={values.transferredFrom}
            />
          </div>

          <div className="form-col">
            <label className="form-label">Transferred To</label>
            <input
              className="branchforminput"
              name="transferredTo"
              placeholder="Transferred To"
              defaultValue={values.transferredTo}
            />

            <label className="form-label">LAP</label>
            <input
              className="branchforminput"
              name="lap"
              placeholder="LAP"
              defaultValue={values.lap}
            />

            <label className="form-label">Year of Start</label>
            <input
              className="branchforminput"
              name="yearStart"
              placeholder="Year of Start"
              defaultValue={values.yearStart}
            />

            <label className="form-label">Accreditation Upto</label>
            <input
              className="branchforminput"
              name="accUpto"
              placeholder="Accreditation Upto"
              defaultValue={values.accUpto}
            />

            <label className="form-label">NBA Status</label>
            <div className="radio-group">
              <label>
                <input
                  className="branchforminput"
                  type="radio"
                  name="nba"
                  value="Yes"
                  defaultChecked={values.nba === "Yes"}
                  required
                />
                Yes
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  className="branchforminput"
                  type="radio"
                  name="nba"
                  value="No"
                  defaultChecked={values.nba === "No"}
                />
                No
              </label>
            </div>

            <div id="branchbutton">
              <div>
                <Button name={"CANCEL"} onClick={handleCancel} />
                <Alert
                  type={alertType}
                  message={alertMessage}
                  show={showAlert}
                  close={handleCloseAlert}
                />
              </div>
              <Button name={buttonText} onClick={handleSubmit} />
              <Alert
                type={alertType}
                message={alertMessage}
                show={showAlert}
                close={handleCloseAlert}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BranchForm;
