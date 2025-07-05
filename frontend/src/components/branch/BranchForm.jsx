import { useState } from "react";
import "./form.css";
import Button from "../../widgets/button/Button";
import Alert from "../../widgets/alert/Alert";

function BranchForm({
  heading,
  values = {},
  onSubmit,
  buttonText,
  isEditMode = false,
  setCurrent 
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleCancel = () => {
    setShowAlert(true);
    setAlertMessage("Confirm to Cancel");
    setAlertType("warning");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setCurrent(2)
  };

  const handleFormSubmit = (e) => {    
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    setAlertType("success");
    setAlertMessage(isEditMode ? "Branch Edited Successfully" : "Branch Added Successfully");
    setShowAlert(true);
  };

  return (
    <div className="box1">
      <div className="form-container" >
        <h2 className="head">{heading}</h2>
        <form className="form-grid" onSubmit={handleFormSubmit}>
          <div className="form-col">
            <label className="form-label">Branch Code</label>
            <input
              className="branchforminput"
              name="b_code"
              placeholder="Branch Code"
              defaultValue={values.b_code}
              required
              disabled={isEditMode}
            />

            <label className="form-label">Branch Name</label>
            <input
              className="branchforminput"
              name="branch_name"
              placeholder="Branch Name"
              defaultValue={values.branch_name}
              required
              disabled={isEditMode}
            />

            <label className="form-label">Approved Intake</label>
            <input
              className="branchforminput"
              name="approved_in_take"
              placeholder="Approved Intake"
              defaultValue={values.approved_in_take}
            />

            <label className="form-label">First Year Admitted</label>
            <input
              className="branchforminput"
              name="first_year_admitted"
              placeholder="First Year Admitted"
              defaultValue={values.first_year_admitted}
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
              name="transfered_from"
              placeholder="Transferred From"
              defaultValue={values.transfered_from}
            />
          </div>

          <div className="form-col">
            <label className="form-label">Transferred To</label>
            <input
              className="branchforminput"
              name="transfered_to"
              placeholder="Transferred To"
              defaultValue={values.transfered_to}
            />

            <label className="form-label">LAP</label>
            <input
              className="branchforminput"
              name="LAP"
              placeholder="LAP"
              defaultValue={values.LAP}
            />

            <label className="form-label">Year of Start</label>
            <input
              className="branchforminput"
              name="year_of_start"
              placeholder="Year of Start"
              defaultValue={values.year_of_start}
            />

            <label className="form-label">Accreditation Upto</label>
            <input
              className="branchforminput"
              name="accredition_valid_upto"
              placeholder="Accreditation Upto"
              defaultValue={values.accredition_valid_upto}
            />

            <label className="form-label">NBA Status</label>
            <div className="radio-group">
              <label>
                <input
                  className="branchforminput"
                  type="radio"
                  name="NBA_2020"
                  value="yes"
                  defaultChecked={values.NBA_2020 === 1}
                  required
                />
                Yes
              </label>
              <label>
                <input
                  className="branchforminput"
                  type="radio"
                  name="NBA_2020"
                  value="no"
                  defaultChecked={values.NBA_2020 === 0}
                />
                No
              </label>
            </div>

            <div id="branchbutton">
              <Button name={"CANCEL"} onClick={handleCancel} type="button" />
              <Button name={buttonText} type="submit" />
              <Alert
                type={alertType}
                message={alertMessage}
                show={showAlert}
                okbutton={handleCloseAlert}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BranchForm;