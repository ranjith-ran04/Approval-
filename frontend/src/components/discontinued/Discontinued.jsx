import React, { useEffect, useState } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";
import Button from "../../widgets/button/Button";
import Inputfield from "../../widgets/college/Inputfield";
import { useLoader } from "../../context/LoaderContext";
import Alert from "../../widgets/alert/Alert";
import { useNavigate } from "react-router-dom";

const Discontinued = ({ admin, supp }) => {
  const [selected, setSelected] = useState("");
  const [clicked, setClicked] = useState(0);
  const [students, setStudents] = useState([]);
  const [appln_no, setAppln_no] = useState(0);
  const [add, setAdd] = useState("");
  const [branch, setBranch] = useState([]);
  const[error,setError]=useState({});
  const [studentData, setStudentData] = useState({
    NAME: "",
    APPROVE_STATE: "0",
    TC_STATE: "0",
  });
  const { showLoader, hideLoader } = useLoader();
  const collegeCode = 5901;
  const [alertStage, setAlertStage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});
  const [alertCancelAction, setAlertCancelAction] = useState(() => () => {});
  
  const navigate = useNavigate();

  // const requiredFields=["appln_no","NAME","TC_STATE","APPROVE_STATE"];
  const requiredFields = ["appln_no", "NAME", "TC_STATE", "APPROVE_STATE"];

const validateFields = () => {
  const newErrors = {};

  requiredFields.forEach((field) => {
    const value = field === "appln_no" ? appln_no : studentData[field];
    if (value === undefined || value === null || value === "") {
      newErrors[field] = "This field is required";
    }
    if (field==="NAME" && /\d/.test(value)) {
        newErrors[field] = "Only letters are allowed";
      }

  });

  setError(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name == "appln_no") {
      setAppln_no(value);
    }

    setStudentData((prev) => ({
      ...prev,
      [name]: type === "radio" ? Number(value) : value, // force numbers for radios
    }));
    console.log(studentData);
  };

  const handlecloseAlert = () => {
    setShowAlert(false);
  };

  const deleteOne = (appln_no) => {
    setStudents((prev) =>
      prev.filter((students) => students.app_no !== appln_no)
    );
    setClicked(0);
  };

  const confirmUpdate = async () => {
    if (
      !studentData.NAME ||
      studentData.APPROVE_STATE === null ||
      studentData.APPROVE_STATE === undefined ||
      studentData.TC_STATE === null ||
      studentData.TC_STATE === undefined
    ) {
      alert("Fill all the details");
      return;
    }
    setShowAlert(true);
    setAlertMessage("Confirm to update");
    setAlertType("warning");
    setAlertStage("confirm")
    setAlertOkAction(() => handleUpdate);
  };

  const confirmDelete = async () => {
    setShowAlert(true);
    setAlertMessage("Confirm to delete");
    setAlertStage("confirm")
    setAlertType("warning");
    setAlertOkAction(() => handleDelete);
  };

  const handleUpdate = async () => {
    // showLoader();
    const noErrors=validateFields();

    if(noErrors){
      console.log(noErrors)
      setShowAlert(true);
      setAlertMessage("Confirm to update");
      setAlertType("warning");
      setAlertStage("confirm")
      setAlertOkAction(() => async () => {
        showLoader();
        try {
        const response = await axios.put(
            `${host}discontinued-student`,
            { appln_no, studentData, selected },
            {
              withCredentials: true,
            }
          );
  
          
      if (response.status === 200) {
        setShowAlert(true);
        setAlertMessage("Updated Successfully");
        setAlertStage("success");
        setAlertType("success");
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
        setAlertCancelAction(null)
      }
    } catch (error) {
      if(error.reponse?.status === 401) navigate('/')
        else{
      setShowAlert(true);
      setAlertMessage("Unable to delete kindly try again...");
      setAlertType("error");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    } 
  }
  finally {
      hideLoader();
    }}
);
    }
    else{
      setShowAlert(true);
      setAlertMessage("Please fill all fields");
      setAlertStage("error");
      setAlertType("warning");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
      setAlertCancelAction(null);
    }
  };

  const handleDelete = async () => {
    showLoader();
    try {
      const response = await axios.delete(`${host}discontinued-student`, {
        data: { appln_no },
        withCredentials: true,
      });
      if (response.status === 200) {
      setShowAlert(true);
      setAlertMessage("deleted Successfully");
      setAlertType("success");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
      setAppln_no(0);
      deleteOne(appln_no);}
      else{
      setShowAlert(true);
      setAlertMessage("Failed to delete");
      setAlertType("success");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
      }
      // }
    } catch (error) {
      if(error.response?.status === 401) navigate('/')
        else{
      setShowAlert(true);
      setAlertMessage("Unable to connnect to server...");
      setAlertType("error");
      setAlertStage("success")
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    } }finally {
      hideLoader();
    }
  };

  async function handleFetch() {
    showLoader();
    try {
      var result;
      if (admin) {
        result = await axios.post(
          `${host}collegeBranchFetch`,
          { collegeCode: collegeCode },
          { withCredentials: true }
        );
      } else {
        result = await axios.get(`${host}collegeBranchFetch`, {
          withCredentials: true,
        });
      }
      if (result.status === 200) {
        setBranch(result.data);
      }
    } catch (error) {
      // console.log(error);
      navigate("/");
    } finally {
      hideLoader();
    }
  }

  async function handleSelect(branch) {
    showLoader();
    setSelected(branch);
    setAdd(false);
    setAppln_no(0);
    if (branch === "") {
      setClicked(0);
      setStudents([]);
      hideLoader();
      return;
    }
    try {
      // console.log(supp);
      const result = await axios.post(
        `${host}discontinuedBranch`,
        {
          branch: branch,
          ...(admin && { collegeCode: collegeCode }),
          supp: supp ? true : false,
        },
        { withCredentials: true }
      );
      if (result.status === 200) {
        setStudents(result.data);
      }
    } catch (error) {
      if(error.response?.status === 401) navigate('/')
      console.warn(error);
    } finally {
      hideLoader();
    }
  }

  async function studentInfo(appln_no) {
    showLoader();
    try {
      const result = await axios.post(
        `${host}discontinued-student`,
        { appln_no: appln_no },
        { withCredentials: true }
      );
      const raw = result.data?.[0]?.[0];
      // console.log("Raw API:", raw);
      // console.log("API catogory:", raw.catogory);
      // console.log(result.data?.[0]?.[0]);
      if (!raw) {
        console.warn("No student found in response", result.data);
        setStudentData({});
        return;
      }

      // // console.log(result.data?.[0]?.[0]);
      setStudentData(raw);
    } catch (err) {
      if(err.response?.status === 401) navigate('/')
      // console.log(err);
    } finally {
      hideLoader();
    }
  }

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="student-container">
      <div className="head-studentdropdown">
        <label>DISCONTINUED DETAILS : </label>
        <br />
        <label>Branch Name</label>
        <select onChange={(e) => handleSelect(e.target.value)} value={selected}>
          <option value="">--select--</option>
          {branch.map((item, index) => (
            <option key={index} value={String(item.slice(-2))}>
              {item}
            </option>
          ))}
        </select>
        {selected != "" && (
          <Button
            name="ADD"
            onClick={() => {
              setAdd(true);
              setClicked(0);
              setStudentData({
                NAME: "",
                APPROVE_STATE: 0,
                TC_STATE: 0,
              });
              setAppln_no("");
            }}
          ></Button>
        )}
      </div>
      {!add && selected !== "" && (
        <div className="student-table">
          <div className="student-row">
            <div className="student-header sno">S.No</div>
            <div className="student-header app_no">Application Number</div>
            <div className="student-header name">Name</div>
            <div className="student-header action">Action</div>
          </div>

          {students.map((item, index) => (
            <div key={index} className="student-row cell">
              <div className="student-cell sno">{index + 1}</div>
              <div className="student-cell app_no">{item.app_no}</div>
              <div className="student-cell name">{item.name}</div>
              <div className="student-cell action">
                <button
                  className="student-button"
                  onClick={() => {
                    setAdd(false);
                    setAppln_no(item.app_no);
                    studentInfo(item.app_no);
                  }}
                >
                  view
                </button>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="Unavailable">No Students Found</div>
          )}
        </div>
      )}

      {(appln_no != 0 || add) && (
        <div> 
          <div id="appln_no" style={{ display: "flex", gap: "8%" }}>
            <Inputfield
              eltname={"appln_no"}
              type={"text"}
              placeholder={"Application Number"}
              onchange={handleChange}
              value={appln_no}
              disabled={!add}
              error={error["appln_no"]}
            />
            <div style={{ marginTop: "20px" }}>
              <Button
                name={"CLEAR"}
                style={{
                  width: "130px",
                  backgroundColor: "red",
                }}
                onClick={() => {
                  setAppln_no(0);
                  setAdd(false);
                }}
              />
            </div>
          </div>
          <div>
            <fieldset className="collegefieldset">
              <legend className="collegelegend">DISCONTINUED DETAILS</legend>
              <div className="field-row-single">
                <Inputfield
                  label={"Candidate's Name"}
                  id={"candidatename"}
                  eltname={"NAME"}
                  type={"text"}
                  htmlfor={"candidatename"}
                  classname={"field-block"}
                  value={studentData.NAME}
                  error={error["NAME"]}
                  required={true}
                  onchange={handleChange}
                />
              </div>
              <div className="field-row">
                <Inputfield
                  eltname={"APPROVE_STATE"}
                  type={"radio"}
                  radiolabel={"Whether Approved By Dote ?"}
                  onchange={handleChange}
                  classname={"field-block"}
                  options={[
                    { label: "Yes", value: 1 },
                    { label: "No", value: 0 },
                  ]}
                  id={"appr-dote"}
                  htmlfor={"appr-dote"}
                  required={true}
                  value={Number(studentData.APPROVE_STATE)}
                  error={error["APPROVE_STATE"]}
                />
                <Inputfield
                  eltname={"TC_STATE"}
                  type={"radio"}
                  radiolabel={"Whether TC issued ?"}
                  onchange={handleChange}
                  classname={"field-block"}
                  options={[
                    { label: "Yes", value: 1 },
                    { label: "No", value: 0 },
                  ]}
                  id={"tc-issued"}
                  htmlfor={"tc-issued"}
                  required={true}
                  value={Number(studentData.TC_STATE)}
                  error={error["TC_STATE"]}
                />
              </div>
            </fieldset>
            <div id="studentbutton">
              <Button name={"UPDATE"} onClick={handleUpdate} />
              <Button name={"DELETE"} onClick={confirmDelete} />
            </div>
          </div>
        </div>
      )}
      <Alert
        type={alertType}
        message={alertMessage}
        show={showAlert}
        okbutton={alertOkAction}
        cancelbutton={alertStage === "confirm" ? handlecloseAlert : null}
      />
    </div>
  );
};

export default Discontinued;
