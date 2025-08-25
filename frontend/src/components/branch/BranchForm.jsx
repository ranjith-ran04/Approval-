import { useState, useEffect } from "react";
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
}) {
  const [nbaValue, setNbaValue] = useState(
    isEditMode
      ? values.NBA_2020 === 1 || values.NBA_2020 === "yes"
        ? "yes"
        : "no"
      : ""
  );

  const [amount, setAmount] = useState(isEditMode ? values.Amount ?? "" : "");
  const [accto, setAccto] = useState(
    isEditMode ? values.accredition_valid_upto ?? "" : ""
  );

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

  useEffect(() => {
    if (!isEditMode) return;

    // if (nbaValue === "no") {
    //   setAmount("0");
    //   setAccto("0");
    // } else if (nbaValue === "yes") {

    // }
    // if (nbaValue === "no") {
    //   setAmount("");
    //   setAccto("");
    // } else {
    setAmount((values.Amount ?? "").toString());
    setAccto((values.accredition_valid_upto ?? "").toString());
    // }
  }, [nbaValue, isEditMode, values]);

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setNbaValue(value);
  };

  const handleCancel = () => {
    setCurrent(2);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertStage === "cancel") {
      setCurrent(2);
    }
    setAlertStage("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};

    const trim = (val) => (val || "").toString().trim();
    
    const helperErr = (val) => {
      const num = Number(val);
      return !trim(val) || isNaN(num) || num < 0 || !Number.isInteger(num);
    };

    if (helperErr(data.approved_in_take)) {
      newErrors.approved_in_take = "*Invalid value";
    }
    if (
      helperErr(data.first_year_admitted) ||
      Number(data.first_year_admitted) > Number(data.approved_in_take)
    ) {
      newErrors.first_year_admitted = "*Invalid value";
    }
    if (
      helperErr(data.first_year_admitted) ||
      Number(data.discontinued) + Number(data.transfered_to) >
        data.first_year_admitted
    ) {
      newErrors.discontinued = "*Invalid value";
    }
    if (helperErr(data.transfered_from)) {
      newErrors.transfered_from = "*Invalid value";
    }
    if (
      helperErr(data.discontinued) ||
      Number(data.discontinued) + Number(data.transfered_to) >
        Number(data.first_year_admitted)
    ) {
      newErrors.transfered_to = "*Invalid value";
    }
    if (helperErr(data.LAP)) {
      newErrors.LAP = "*Invalid value";
    }
    const current_year = new Date().getFullYear();

    if (
      helperErr(data.year_of_start) ||
      Number(data.year_of_start) > current_year ||
      Number(data.year_of_start) < 1500 
    ) {
      newErrors.year_of_start = "*Invalid value";
    }

    if (!["yes", "no"].includes(nbaValue)) {
      newErrors.NBA_2020 = "*Please select Yes or No";
    }

    // If NBA is yes, validate amount and accredition
    if (nbaValue === "yes") {
      if (!trim(amount)) {
        newErrors.amount = "*Amount required";
      } else if (helperErr(amount)) {
        newErrors.amount = "*Invalid value";
      }
      if (!trim(accto)) {
        newErrors.accredition_valid_upto = "*Accreditation valid upto required";
      } else if (
        helperErr(accto) ||
        Number(accto) - Number(data.year_of_start) <
          2||
          Number(accto) < current_year
      ) {
        newErrors.accredition_valid_upto = "*Invalid value";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlertType("warning");
      setAlertMessage("Please fill all the details correctly!");
      setShowAlert(true);
      return;
    }

    setErrors({});

    const numberFields = [
      "approved_in_take",
      "first_year_admitted",
      "discontinued",
      "transfered_from",
      "transfered_to",
      "LAP",
    ];

    numberFields.forEach((field) => {
      data[field] = parseInt(data[field] || 0, 10);
    });

    data.NBA_2020 = nbaValue === "yes" ? 1 : 0;

    if (nbaValue === "yes") {
      data.Amount = parseInt(amount || 0, 10);
      data.accredition_valid_upto = parseInt(accto || 0, 10);
    } else {
      data.Amount = 0;
      data.accredition_valid_upto = 0;
    }

    if (!isEditMode && data.branch) {
      const [b_code, branch_name] = data.branch.split("|");
      data.b_code = b_code.trim();
      data.branch_name = branch_name.trim();
      delete data.branch;
    }

    onSubmit(data);
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
              />
              {errors.approved_in_take && (
                <span className="branch-error">{errors.approved_in_take}</span>
              )}

              <label className="form-label">First Year Admitted</label>
              <input
                className="branchforminput"
                name="first_year_admitted"
                placeholder="First Year Admitted"
                defaultValue={values.first_year_admitted}
              />
              {errors.first_year_admitted && (
                <span className="branch-error">
                  {errors.first_year_admitted}
                </span>
              )}

              <label className="form-label">Discontinued</label>
              <input
                className="branchforminput"
                name="discontinued"
                placeholder="Discontinued"
                defaultValue={values.discontinued}
              />
              {errors.discontinued && (
                <span className="branch-error">{errors.discontinued}</span>
              )}

              <label className="form-label">Transferred From</label>
              <input
                className="branchforminput"
                name="transfered_from"
                placeholder="Transferred From"
                defaultValue={values.transfered_from}
              />
              {errors.transfered_from && (
                <span className="branch-error">{errors.transfered_from}</span>
              )}
            </div>

            {/* Column 2 */}
            <div className="form-col">
              <label className="form-label">Transferred To</label>
              <input
                className="branchforminput"
                name="transfered_to"
                placeholder="Transferred To"
                defaultValue={values.transfered_to}
              />
              {errors.transfered_to && (
                <span className="branch-error">{errors.transfered_to}</span>
              )}

              <label className="form-label">LAP</label>
              <input
                className="branchforminput"
                name="LAP"
                placeholder="LAP"
                defaultValue={values.LAP}
              />
              {errors.LAP && <span className="branch-error">{errors.LAP}</span>}

              <label className="form-label">Year of Start</label>
              <input
                className="branchforminput"
                name="year_of_start"
                placeholder="Year of Start"
                defaultValue={values.year_of_start}
              />
              {errors.year_of_start && (
                <span className="branch-error">{errors.year_of_start}</span>
              )}

              <div className="nba-label-group">
                <label className="form-label">NBA Status</label>
                <label className="form-label">Amount</label>
              </div>
              <div className="nba-row">
                <div className="radio-err">
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="NBA_2020"
                        value="yes"
                        checked={nbaValue === "yes"}
                        onChange={handleRadioChange}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="NBA_2020"
                        value="no"
                        checked={nbaValue === "no"}
                        onChange={handleRadioChange}
                      />
                      No
                    </label>
                  </div>
                  {errors.NBA_2020 && (
                    <span className="branch-error">{errors.NBA_2020}</span>
                  )}
                </div>

                <input
                  className="branchforminput"
                  name="Amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={nbaValue !== "yes"}
                  readOnly={nbaValue !== "yes"}
                />
                {errors.amount && (
                  <span className="branch-error">{errors.amount}</span>
                )}
              </div>
              <label className="form-label">Accreditation Upto</label>
              <input
                className="branchforminput"
                name="accredition_valid_upto"
                placeholder="Accreditation Upto"
                value={accto}
                onChange={(e) => setAccto(e.target.value)}
                disabled={nbaValue !== "yes"}
                readOnly={nbaValue !== "yes"}
              />
              {errors.accredition_valid_upto && (
                <span className="branch-error">
                  {errors.accredition_valid_upto}
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="button-row">
            <Button name={"BACK"} onClick={handleCancel} type="button" />
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