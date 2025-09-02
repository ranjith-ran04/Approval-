import BranchForm from "./BranchForm";
import axios from "axios";
import { host } from "../../constants/backendpath";
import Alert from "../../widgets/alert/Alert";
import { useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import {useNavigate} from 'react-router-dom';

function AddBranch({ setCurrent }) {
  const {showLoader, hideLoader} = useLoader();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === "success") setCurrent(2);
  };

  const handleAddSubmit = async (data) => {
    // // console.log("Data being sent:", data);
    showLoader();
    try {
      const formData = {
        ...data,
      };
      const res = await axios.post(`${host}branch`, formData, {
        withCredentials: true,
      });

      if (res.status === 200 || res.status === 201) {
        // console.log("Branch Added Successfully");
        setAlertType("success");
        setAlertMessage("Branch Added Successfully");
      } else {
        setAlertType("error");
        setAlertMessage("Something went wrong.");
      }
      setShowAlert(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setAlertType("warning");
        setAlertMessage("Branch Already exists!");
      }else if(err.response?.status === 401){
        navigate('/');
      } 
      else {
        setAlertType("error");
        setAlertMessage("Server error. Please try again later.");
      }
      setShowAlert(true);
      console.error("Add Branch error: ", err);
    }finally{
      hideLoader();
    }
  };
  return (
    <>
      <BranchForm
        heading="ADD BRANCH"
        onSubmit={handleAddSubmit}
        buttonText="Add Branch"
        isEditMode={false}
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
export default AddBranch;
