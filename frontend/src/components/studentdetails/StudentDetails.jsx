import "./studentDetails.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { host } from "../../constants/backendpath.js";
import StudentForm from "./StudentForm.jsx";
import "../college/CollegeInfo.css";
import Button from "../../widgets/button/Button.jsx";
import AddInput from '../../widgets/addinput/Input.jsx';
import { useLoader } from "../../context/LoaderContext.jsx";
import {useNavigate} from 'react-router-dom';

function StudentDetails({admin,supp}) {
  const { showLoader, hideLoader} = useLoader();
  const [selected, setSelected] = useState("");
  const [branch, setBranch] = useState([]);
  const [students, setStudents] = useState([]);
  const [appln_no, setAppln_no] = useState(false);
  const [clicked, setClicked] = useState(0);
  const [add,setAdd] = useState('');
  const formRef = useRef(null);
  const addRef = useRef(null);
  const collegeCode = 5901;
  const navigate = useNavigate();
  
  async function handleFetch() {
    showLoader();
    try {
      var result;
      if(admin){
        result = await axios.post(`${host}collegeBranchFetch`,{collegeCode:collegeCode},{ withCredentials:true});
      }
      else{
      result = await axios.get(`${host}collegeBranchFetch`, {
        withCredentials: true,
      });}
      if (result.status === 200) {
        // // console.log(result.data);
        setBranch(result.data);
      }
    } catch (error) {
      // console.log(error);
      navigate('/')
    } finally {
      hideLoader();
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

  useEffect(()=>{
    if(add){
      addRef.current.scrollIntoView({ behavior:'smooth'});
    }
  }, [add]);

  async function handleSelect(branch) {
    showLoader();
    setSelected(branch);
    if (branch === "") {
      setClicked(0);
      setStudents([]);
      return;
    }
    try {
      // console.log(supp);
      const result = await axios.post(
        `${host}studentBranch`,
        { branch: branch , ...(admin && {collegeCode:collegeCode}),supp:supp?true:false},
        { withCredentials: true }
      );
      if (result.status === 200) {
        setStudents(result.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      hideLoader();
    }
  }
  const handleClear = () => {
    setClicked(0);
    setAdd(false);
  };

  const deleteOne = (appln_no) => {
    setStudents(prev => prev.filter( students => students.app_no !== appln_no));
    setClicked(0);
  };
  // // console.log(students);
  return (
    <div className="student-container">
      <div className="head-studentdropdown">
        <label>STUDENT DETAILS : </label><br />
        <label>Branch Name</label>
        <select onChange={(e) => handleSelect(e.target.value)} value={selected}>
          <option value="">--select--</option>
          {branch.map((item, index) => (
            <option key={index} value={String(item.slice(-2))}>
              {item}
            </option>
          ))}
        </select>
        {selected != "" && (<Button name='ADD' onClick={()=>{setAdd(true); setClicked(0)}}></Button>)}
        {admin && (
        <div id="studentButton">
          <Button
            name={"College Details"}
            style={{ width: "130px" }}
          />
          <Button
            name={"Branch Details"}
            style={{
              width: "130px",
            }}
          />
        </div>)}
      </div>
      {selected!=="" &&(
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
                  // localStorage.setItem("fromView","true");
                  setAdd(false);
                  setAppln_no(item.app_no);
                  setClicked(1);
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
  
      {clicked > 0 && (
        <div ref={formRef}>
          <StudentForm handleClear={handleClear} appln_no={appln_no} b_code={selected} index={deleteOne} clicked={clicked}/>
        </div>
      )}
      {add && (
        <div ref={addRef} >
        <AddInput add={setAdd} clicked={setClicked} click={clicked} appln_no={setAppln_no} branchCode={selected}/>
        </div>
      )
      }
    </div>
  );
}

export default StudentDetails;
