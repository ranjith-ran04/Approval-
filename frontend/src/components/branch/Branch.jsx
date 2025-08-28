import "./branch.css";
import Alert from "../../widgets/alert/Alert";
import { useState, useEffect } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";
import { useLoader } from "../../context/LoaderContext";

function Branch({ setCurrent, setState }) {
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState(false);
  const [alertStage, setAlertStage] = useState();
  const [branchData, setBranchData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showIndex, setShowIndex] = useState(null);

  const handleCancel = (index) => {
    setShowIndex(index);
    // console.log(showIndex);
    setShowAlert(true);
    setAlertMessage("Confirm to Delete");
    setAlertType("warning");
    setAlertStage("confirm");
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const collegeCode = "1";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const res = await axios.get(`${host}branch`,{withCredentials : true});
        setBranchData(res.data);
        setError(false);
      } catch (err) {
        console.error("Fetching data failed", err);
        setBranchData([]);
        setError(true);
      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);

  const handleDeleteBranch = async (collegeCode, branch_code) => {
    try {
      const res = await axios.delete(`${host}branch`, {
        data: { collegeCode, b_code: branch_code },withCredentials:true
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
    setBranchData((prev) =>
      prev.filter((b) => b.b_code !== branchData[showIndex].b_code)
    );
  };

  return (
    <div className="box">
      
      <>
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

          {error ? (
            <div className="table-row">
              <div
                className="error-msg"
                style={{ gridColumn: "1 / -1", color: "red" }}
              >
                Failed to load branches. Please check your internet connection.
              </div>
            </div>
          ) : branchData.length === 0 ? (
            <div className="table-row">
              <div className="no-data-msg" style={{ gridColumn: "1 / -1" }}>
                No branches available.
              </div>
            </div>
          ) : (
            branchData.map((branch, index) => (
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
                </div>
              </div>
            ))
          )}
        </div>

        <Alert
          key={`${alertStage}-${showAlert}`}
          type={alertType}
          message={alertMessage}
          show={showAlert}
          okbutton={
            alertStage === "confirm"
              ? () =>
                  handleDeleteBranch(collegeCode, branchData[showIndex]?.b_code)
              : alertStage === "success" || "cancel"
              ? handleCloseAlert
              : null
          }
          cancelbutton={alertStage === "confirm" ? handleCloseAlert : null}
        />
      </>
      
    </div>
  );
}

export default Branch;