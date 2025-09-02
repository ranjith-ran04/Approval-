import BranchForm from "./BranchForm";
import axios from "axios";
import { host } from "../../constants/backendpath";
import Alert from "../../widgets/alert/Alert";
import { useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import {useNavigate} from 'react-router-dom';

function EditBranch({ state, setCurrent }) {
  const {showLoader, hideLoader} = useLoader();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") setCurrent(2);
  };

  const normalizedState = {
    ...state,
  };

  const handleEditSubmit = async (data) => {
    showLoader();
    try {
      const changedFields = {};

      Object.keys(data).forEach((key) => {
        if (data.b_code || data.branch_name || data.year_of_start) {
          if (String(data[key]) !== String(state[key])) {
            changedFields[key] = data[key];
          }
        } else {
          if (Number(data[key]) !== Number(state[key])) {
            changedFields[key] = data[key];
          }
        }
      });

      if ("NBA_2020" in changedFields) {
        if (changedFields.NBA_2020 === 1) {
          if (Number(data.Amount) !== Number(state.Amount)) {
            changedFields.Amount = parseInt(data.Amount || "0");
          }
          if (
            Number(data.accredition_valid_upto) !==
            Number(state.accredition_valid_upto)
          ) {
            changedFields.accredition_valid_upto = data.accredition_valid_upto;
          }
        } else {
          if (state.amount !== 0) changedFields.amount = 0;
          if (state.accredition_valid_upto !== 0)
            changedFields.accredition_valid_upto = 0;
        }
      }

      const res = await axios.put(
        `${host}branch`,
        {
          ...changedFields,
          b_code: state.b_code,
        },
        { withCredentials: true }
      );

      if (res.status === 200 || res.status === 201) {
        setAlertType("success");
        setAlertMessage("Branch Edited Successfully");
        // console.log("Branch Edited Successfully");
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
      } 
      else if(err.response?.status === 401){
        navigate('/');
      }
      else {
        setAlertType("error");
        setAlertMessage("Server error. Please try again later.");
      }
      setShowAlert(true);
      console.error("update failed : ", err);
    } finally{
      hideLoader();
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
