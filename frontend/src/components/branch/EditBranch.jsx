import BranchForm from "./BranchForm";
import axios from "axios";
import { host } from "../../constants/backendpath";
import Alert from "../../widgets/alert/Alert";
import { useState } from "react";

function EditBranch({ state, setCurrent }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") setCurrent(2);
  };
  console.log("State passed to BranchForm", state);

  const normalizedState = { ...state, NBA_2020: state.NBA_2020 === 1 ? "yes" : "no"};
  console.log(state.Amount);


  const handleEditSubmit = async (data) => {
    try {
      const changedFields = {};
console.log(data.Amount);
      // state.NBA_2020 === 1 ? (state.NBA_2020 = "yes") : (state.NBA_2020 = "no");
      

      Object.keys(data).forEach((key) => {
        if (String(data[key]) !== String(state[key])) {
          changedFields[key] = data[key];
        }
      });

      if ("NBA_2020" in changedFields) {
        changedFields.NBA_2020 =
          changedFields.NBA_2020.toLowerCase() === "yes" ? 1 : 0;

        if (changedFields.NBA_2020 === 1) {
          if (String(data.Amount) !== String(state.Amount)) {
            changedFields.Amount = parseInt(data.Amount || "0");
          }
          if (
            String(data.accredition_valid_upto) !==
            String(state.accredition_valid_upto)
          ) {
            changedFields.accredition_valid_upto = data.accredition_valid_upto;
          }
        } else {
          if (state.amount !== 0) changedFields.amount = 0;
          if (state.accredition_valid_upto !== "")
            changedFields.accredition_valid_upto = "";
        }
      }

      console.log(changedFields);

      const res = await axios.put(`${host}branch`, {
        ...changedFields,
        collegeCode: state.c_code,
        b_code: state.b_code,
      });
      console.log("Fetched Branch Data:", res.data);

      if (res.status === 200 || res.status === 201) {
        setAlertType("success");
        setAlertMessage("Branch Edited Successfully");
        console.log("Branch Edited Successfully");
      } else {
        setAlertType("error");
        setAlertMessage("Something went wrong.");
        console.error("Failed to edit branch");
      }
      setShowAlert(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setAlertType("warning");
        setAlertMessage("No Fields to update!");
      } else {
        setAlertType("error");
        setAlertMessage("Server error. Please try again later.");
      }
      setShowAlert(true);
      console.error("update failed : ", err);
    }
  };

  return (
    <>
      <BranchForm
        heading="EDIT BRANCH"
        values={normalizedState}
        onSubmit={handleEditSubmit}
        buttonText="SAVE"
        isEditMode={true}
        setCurrent={setCurrent}
        showSubmitAlert={false}
      />
      <Alert
        type={alertType}
        message={alertMessage}
        show={showAlert}
        okbutton={handleCloseAlert}
      ></Alert>
    </>
  );
}
export default EditBranch;
