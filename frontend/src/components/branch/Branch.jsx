import "./branch.css";
import Alert from "../../widgets/alert/Alert";
import { useState, useEffect } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";

function Branch({ setCurrent, setState }) {
  const [alertStage, setAlertStage] = useState();
  const [branchData, setBranchData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showIndex, setShowIndex] = useState(null);

  const handleCancel = (index) => {
    setShowIndex(index);
    console.log(showIndex);
    console.log("inside handle cancel");
    setShowAlert(true);
    setAlertMessage("Confirm to Delete");
    setAlertType("warning");
    setAlertStage("confirm");
    console.log("lll");
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertStage === "success") {
      setBranchData((prev) =>
        prev.filter((b) => b.b_code !== branchData[showIndex].b_code)
      );
    }
  };
  const collegeCode = "4";
  useEffect(() => {
    console.log("useeffect is working");
    const fetchData = async () => {
      const res = await axios.get(`${host}branch?collegeCode=${collegeCode}`);
      setBranchData(res.data);
    };
    fetchData();
  }, []);

  const handleDeleteBranch = async (collegeCode, branch_code) => {
    console.log("inside handle delte branch");
    try {
      const res = await axios.delete(`${host}branch`, {
        data: { collegeCode, b_code: branch_code },
      });

      if (res.status === 200) {

        setAlertType("success");
        setAlertStage("success");
        setAlertMessage("Successfully Deleted Branch");
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Delete Failed", err);
      setAlertType("error");
      setAlertStage("error");
      setAlertMessage("Failed to Delete Branch!");
      setShowAlert(true);
    }
  };

  return (
    <div className="box">
      <div className="first">
        <h2 className="heading">BRANCH DETAILS</h2>
        <button className="addBranch-btn" onClick={() => setCurrent(3)}>
          Add Branch
        </button>
      </div>

      <div className="table">
        <div className="table-header">
          <div>Edit</div>
          <div>Branch Code</div>
          <div>Branch Name</div>
          <div>Approved In Take</div>
          <div>First Year Admitted</div>
          <div>Discontinued</div>
          <div>Transferred Students From Your College</div>
          <div>Transferred Students To Your College</div>
          <div>LAP</div>
          <div>Year of Starting the Course</div>
          <div>Accredition Valid Upto</div>
          <div>NBA Status</div>
          <div>Delete</div>
        </div>

        {branchData.map((branch, index) => (
          <div className="table-row" key={index} data-id={index}>
            <div>
              <button
                className="edit-btn"
                onClick={() => {
                  setCurrent(4);
                  setState(branch);
                }}
              >
                Edit
              </button>
            </div>
            <div>{branch.b_code}</div>
            <div>{branch.branch_name}</div>
            <div>{branch.approved_in_take}</div>
            <div>{branch.first_year_admitted}</div>
            <div>{branch.discontinued}</div>
            <div>{branch.transfered_from}</div>
            <div>{branch.transfered_to}</div>
            <div>{branch.LAP}</div>
            <div>{branch.year_of_start}</div>
            <div>{branch.accredition_valid_upto}</div>
            <div>{branch.NBA_2020 === 1 ? "yes" : "no"}</div>
            <div>
              <button
                className="delete-btn"
                onClick={() => handleCancel(index)}
              >
                Delete
              </button>
              <Alert
                type={alertType}
                message={alertMessage}
                show={showAlert}
                okbutton={
                  alertStage === "confirm"
                    ? () =>
                        handleDeleteBranch(
                          collegeCode,
                          branchData[showIndex].b_code
                        )
                    : alertStage === "success"
                    ? handleCloseAlert
                    : null
                }
                cancelbutton={
                  alertStage === "confirm" ? handleCloseAlert : null
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Branch;
