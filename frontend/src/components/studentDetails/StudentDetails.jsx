import "./studentDetails.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";
import StudentForm from "./Studentform";
import "../college/CollegeInfo.css";
import Button from "../../widgets/button/Button";

function StudentDetails() {
  const [selected, setSelected] = useState("");
  const [branch, setBranch] = useState([]);
  const [students, setStudents] = useState([]);
  const [view, setView] = useState(false);
  const [clicked, setClicked] = useState(0);
  const formRef = useRef(null);
  async function handleFetch() {
    try {
      const result = await axios.get(`${host}collegeBranchFetch`, {
        withCredentials: true,
      });
      if (result.status === 200) {
        console.log(result.data);
        setBranch(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleFetch();
  }, []);
  useEffect(() => {
    if (clicked > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [clicked]);
  async function handleSelect(branch) {
    setSelected(branch);
    if (branch === "") {
      setClicked(0);
      setStudents([]);
      return;
    }
    try {
      const result = await axios.post(
        `${host}studentBranch`,
        { branch: branch },
        { withCredentials: true }
      );
      if (result.status === 200) {
        setStudents(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleClear = () => {
    setSelected("");
    setClicked(0);
    setStudents([]);
  };
  console.log(students);
  return (
    <div className="student-container">
      <div className="head-studentdropdown">
        <label>Branch Name</label>
        <select onChange={(e) => handleSelect(e.target.value)} value={selected}>
          <option value="">--select--</option>
          {branch.map((item, index) => (
            <option key={index} value={String(item.slice(-2))}>
              {item}
            </option>
          ))}
        </select>
        <div id="studentButton">
          <Button
            name={"ADD"}
            style={{ width: "130px" }}
          />
          <Button
            name={"Clear"}
            style={{
              width: "130px",
              backgroundColor: "red", 
            }}
            onClick={handleClear}
          />
        </div>
      </div>
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
                  setClicked(clicked + 1);
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
      {clicked > 0 && (
        <div ref={formRef}>
          <StudentForm />
        </div>
      )}
    </div>
  );
}

export default StudentDetails;
