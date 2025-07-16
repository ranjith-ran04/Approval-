import "./studentDetails.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath";

function StudentDetails() {
  const [selected, setSelected] = useState("");
  const [branch, setBranch] = useState([]);
  const [students,setStudents] = useState([]);
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
  async function handleSelect(branch){
    setSelected(branch);
    try{
      const result = await axios.post(`${host}studentBranch`,{branch:branch},{withCredentials:true});
      if(result.status === 200){
        setStudents(result.data);
      }
    }
    catch(error){
      console.log(error);
    }
  }
  console.log(students);
  return (
    <div className="student-container">
      <div className="studentdropdown">
        <label>Branch Name</label>
        <select onChange={(e) => handleSelect(e.target.value)} value={selected}>
          <option value="">--select--</option>
          {branch.map((item, index) => (
            <option key={index} value={String(item.slice(-2))}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="student-table">
        <div className="student-row">
          <div className="student-header sno">S.No</div>
          <div className="student-header app_no">Application Number</div>
          <div className="student-header name">Name</div>
          <div className="student-header action">Action</div>
        </div>

{students.map((item,index)=>
        (<div key={index} className="student-row cell">
          <div className="student-cell sno">{index+1}</div>
          <div className="student-cell app_no">{item.app_no}</div>
          <div className="student-cell name">{item.name}</div>
          <div className="student-cell action">
            <button className="student-button">view</button>
          </div>
        </div>))}
        {students.length === 0 && <div className='Unavailable'>No Students Found</div>}
      </div>
    </div>
  );
}

export default StudentDetails;
