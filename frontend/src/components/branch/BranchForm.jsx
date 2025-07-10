import { useState } from "react";
import "./form.css";
import Button from "../../widgets/button/Button";
import Alert from "../../widgets/alert/Alert";
import { branchConst } from "../../constants/branchConst";

function BranchForm({
  heading,
  values = {},
  onSubmit,
  buttonText,
  isEditMode = false,
  setCurrent,
  showSubmitAlert = true,
}) {
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStage, setAlertStage] = useState("");

  const branchArray = Array.from(branchConst.entries()).map(
    ([b_code, branch_name]) => ({
      b_code,
      branch_name,
    })
  );

  const handleCancel = () => {
    setShowAlert(true);
    setAlertMessage("Confirm to Cancel");
    setAlertType("warning");
    setAlertStage("cancel");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if(alertStage === "cancel" || "success"){
    setCurrent(2);}
    setAlertStage("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};

    if(!/^\d+$/.test(data.approved_in_take.trim())) {
      newErrors.approved_in_take = "Must be a number.";
    }

    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlertType("warning");
      setAlertMessage("Please correct the highlighted errors.");
      setShowAlert(true);
      return;  
    }setErrors({});

    if (!isEditMode && data.branch) {
      const [b_code, branch_name] = data.branch.split("|");
      data.b_code = b_code.trim();
      data.branch_name = branch_name.trim();
      data.NBA_2020 = data.NBA_2020 === "yes" ? 1 : 0;
      delete data.branch;
    }


    onSubmit(data);
    if (showSubmitAlert) {
      setAlertType("success");
      setAlertMessage(
        isEditMode ? "Branch Edited Successfully" : "Branch Added Successfully"
      );
      setShowAlert(true);
    }
  };

  return (
    <div className="box1">
      <div className="form-container">
        <h2 className="head">{heading}</h2>
        <form className="form-grid" onSubmit={handleFormSubmit}>
          <div className="form-rows">
            {/* Column 1 */}
            <div className="form-col">
              <label className="form-label">Branch Code & Name</label>
              {!isEditMode ? (
                <select className="branchforminput" name="branch" required>
                  <option value=""> -- Select Branch -- </option>
                  {branchArray.map(({ b_code, branch_name }) => (
                    <option
                      key={b_code}
                      value={`${b_code}|${branch_name}`}
                    >{`${b_code} - ${branch_name}`}</option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    className="branchforminput"
                    defaultValue={`${values.b_code} - ${values.branch_name}`}
                    disabled
                  />
                  <input type="hidden" name="b_code" value={values.b_code} />
                  <input
                    type="hidden"
                    name="branch_name"
                    value={values.branch_name}
                  />
                </>
              )}

              <label className="form-label">Approved Intake</label>
              <input
                className="branchforminput"
                name="approved_in_take"
                placeholder="Approved Intake"
                defaultValue={values.approved_in_take}
                required
              />
              {errors.approved_in_take && (<span className="branch-error">{errors.approved_in_take}</span>)}

              <label className="form-label">First Year Admitted</label>
              <input
                className="branchforminput"
                name="first_year_admitted"
                placeholder="First Year Admitted"
                defaultValue={values.first_year_admitted}
                required
              />

              <label className="form-label">Discontinued</label>
              <input
                className="branchforminput"
                name="discontinued"
                placeholder="Discontinued"
                defaultValue={values.discontinued}
                required
              />

              <label className="form-label">Transferred From</label>
              <input
                className="branchforminput"
                name="transfered_from"
                placeholder="Transferred From"
                defaultValue={values.transfered_from}
                required
              />
            </div>

            {/* Column 2 */}
            <div className="form-col">
              <label className="form-label">Transferred To</label>
              <input
                className="branchforminput"
                name="transfered_to"
                placeholder="Transferred To"
                defaultValue={values.transfered_to}
                required
              />

              <label className="form-label">LAP</label>
              <input
                className="branchforminput"
                name="LAP"
                placeholder="LAP"
                defaultValue={values.LAP}
                required
              />

              <label className="form-label">Year of Start</label>
              <input
                className="branchforminput"
                name="year_of_start"
                placeholder="Year of Start"
                defaultValue={values.year_of_start}
                required
              />

              <label className="form-label">Accreditation Upto</label>
              <input
                className="branchforminput"
                name="accredition_valid_upto"
                placeholder="Accreditation Upto"
                defaultValue={values.accredition_valid_upto}
                required
              />

              <label className="form-label">NBA Status</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="NBA_2020"
                    value="yes"
                    defaultChecked={
                      values.NBA_2020 === 1 || values.NBA_2020 === "yes"
                    }
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="NBA_2020"
                    value="no"
                    defaultChecked={
                      values.NBA_2020 === 0 || values.NBA_2020 === "no"
                    }
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <Button name={"CANCEL"} onClick={handleCancel} type="button" />
            <Button name={buttonText} type="submit" />
          </div>

          {/* Alert */}
          <Alert
            type={alertType}
            message={alertMessage}
            show={showAlert}
            okbutton={handleCloseAlert}
          />
        </form>
      </div>
    </div>
  );
}

export default BranchForm;
