import Inputfield from "../../../src/widgets/college/Inputfield";
import {useState} from 'react';
import '../../components/college/CollegeInfo.css';
import Alert from "../../widgets/alert/Alert";
import Button from "../../widgets/button/Button";
import tamilnaduDistricts from "../../../src/constants/Tndistricts"

const Addstudent = ({handleClear,appln_no}) => {
const [studentData,setStudentData]=useState({});
const [caste,setCastes]=useState([])
const [showAlert, setShowAlert] = useState(false);
const [alertStage,setAlertStage]=useState('');
const [alertType,setAlertType]=useState('');
const [alertMessage,setAlertMessage]=useState('');
const [error,setError]=useState({});
const [alertOkAction,setAlertOkAction]=useState(()=>()=>{});
// const [error,setError] = useState('');
const [certificates, setCertificates] = useState([
  { id: 1, name: "Community Certificate", file: null },
  { id: 2, name: "Provisional/Degree Certificate", file: null },
  { id: 3, name: "Consolidated Mark Sheet", file: null },
  { id: 4, name: "Transfer Certificate", file: null },
  { id: 5, name: "Equivalency", file: null },
  { id: 6, name: "First Graduate Certificate", file: null },
]);
const requiredFields=["appln_no", "CATEGORY", "candidatename", "dob","files", "gender", "mobile", "email", "Aadhar", "Nationality", "Nativity", "Religion", "Community", "Caste Name", "Parent Occupation", "state", "district", "otherStateName", "studied in TN", "Qualifying Examination", "Year of Passing", "Univ Reg Num", "Board of Exam", "coursetype", "mathsstudied", "Annual Income", "First Graduate", "AICTE Tuition fee", "PMS", "FG Cert Issued District", "FG Certificate Number", "fg fees", "sem1max", "sem1obt", "sem2max", "sem2obt", "sem3max", "sem3obt", "sem4max", "sem4obt", "Remarks", "overallmax", "overallobt", "Percentage"
]
const handlecloseAlert=()=>{
  setShowAlert(false);
  // setAlertStage('')
}
const validateFields=()=>{
  console.log("Entered validation")
  const letterfields=["candidatename", "Religion", "Caste Name", "Parent Occupation", "state", "district", "otherStateName", "Board of Exam", "FG Cert Issued District", "Remarks"];
  const newErrors={};
  requiredFields.forEach((field)=>{
    const value=studentData[field];
    if (!value || studentData[field]==="") {
      newErrors[field] = "This field is required";
    }

    else{
      if (letterfields.includes(field) &&/\d/.test(value)) {
      newErrors[field] = "Only letters are allowed";
    }
    else if(letterfields.includes(field)&& /[!@#$%]/.test(value)){
      newErrors[field]="Special characters not allowed";
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors[field] = "Enter correct email format";
    }
    if(field==="mobile"&&isNaN(value)){
      newErrors[field]="Only numbers are allowed";
    }
    else if(field==="mobile"&&!/^\d{10}$/.test(value)){
      newErrors[field]="Enter 10 digit valid mobile number";
    }
     const numericFields = [
      "appln_no", "Aadhar", "Univ Reg Num", "Annual Income", "FG Certificate Number", "sem1max", "sem1obt", "sem2max", "sem2obt", "sem3max", "sem3obt", "sem4max", "sem4obt", "overallmax", "overallobt"];
    if (numericFields.includes(field) && isNaN(value)) {
      newErrors[field] = "Only numbers are allowed";
    }
    else if(numericFields.includes(field)&&value<=0){
      newErrors[field]="Negative numbers not allowed";
    }
    const maxObtPairs = [
    ["sem1max", "sem1obt"],
    ["sem2max", "sem2obt"],
    ["sem3max", "sem3obt"],
    ["sem4max", "sem4obt"],
  ];
    maxObtPairs.forEach(([maxField, obtField]) => {
    const maxVal = parseFloat(studentData[maxField]);
    const obtVal = parseFloat(studentData[obtField]);

    if (!isNaN(maxVal) && !isNaN(obtVal)) {
      if(maxVal < obtVal){
        newErrors[maxField] = "Maximum marks should be greater than or equal to obtained marks";
      }
    }
  });
    }  
  })
    setError(newErrors);
    if(Object.keys(newErrors).length===0){
      return true;
    } 
    else{
      return false;
    }
}
const handleAddStudent=()=>{
  console.log("hii");
  const noerrors=validateFields();
  if(noerrors){
    setShowAlert(true);
   setAlertStage("confirm");
  setAlertMessage("Confirm to Add")
  setAlertType("warning")
  setAlertOkAction(()=>()=>{
    setShowAlert(true);
    setAlertMessage("Updated Successfully");
    setAlertStage("success");
    setAlertType("success");
    setAlertOkAction(()=>()=>{setShowAlert(false)})
  })
  }else{
  setShowAlert(true);
  setAlertStage("success");
  setAlertMessage("You have errors")
  setAlertType("warning")
  setAlertOkAction(()=>()=>{
    setShowAlert(false);
  })
  }

}
const handleUpdate=()=>{
  setShowAlert(true);
  setAlertStage("confirm");
  setAlertMessage("Confirm to update")
  setAlertType("warning")
  setAlertOkAction(()=>()=>{
    setShowAlert(true);
    setAlertMessage("Updated Successfully");
    setAlertStage("success");
    setAlertType("success");
    setAlertOkAction(()=>()=>{setShowAlert(false)})
  })
}
const handleStuDelete=()=>{
  setShowAlert(true);
  setAlertStage("confirm");
  setAlertMessage("Confirm to Delete")
  setAlertType("warning")
  setAlertOkAction(()=>()=>{
    setShowAlert(true);
    setAlertMessage("Deleted Successfully");
    setAlertStage("success");
    setAlertType("success");
    setAlertOkAction(()=>()=>{setShowAlert(false)});
  })
}

const handleFileChange = (e, index) => {
  const file = e.target.files[0];
  setCertificates(prev => {
    const updated = [...prev];
    updated[index].file = file;
    return updated;
  });
  setShowAlert(true);
  setAlertMessage("File Uploaded Successfully");
  setAlertType("success");
  setAlertStage("success")
  setAlertOkAction(()=>()=>{
    setShowAlert(false);
  })
};

const handleView = (file) => {
  if (file) {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  }
};

const handleDelete = (index) => {
  setCertificates(prev => {
    const updated = [...prev];
    updated[index].file = null;
    return updated;
  });
  setShowAlert(true);
  setAlertMessage("Confirm to Delete");
  setAlertStage("confirm");
  setAlertType("warning");
  setAlertOkAction(()=>()=>{
    setShowAlert(true);
    setAlertMessage("File Deleted Successfully");
    setAlertStage("success");
    setAlertType("success");
    setAlertOkAction(()=>()=>{
      setShowAlert(false);
    })
  })
};

const handleChange = async(e) => {
  const { name, value } = e.target;
  if(name=="Community"){
    try{
    let castelist=[];
    if(value==='BC'){
      castelist=await import('../../../src/constants/bc.json');
    }
    else if(value==='BCM'){
      castelist=await import('../../../src/constants/bcm.json')
    }
    else if(value==='SC'){
      castelist=await import('../../../src/constants/sc.json')
    }
    else if(value==='SCA'){
      castelist=await import('../../../src/constants/sca.json')
    }
    else if(value==='ST'){
      castelist=await import('../../../src/constants/st.json')
    }
    else{
      castelist=await import('../../../src/constants/mbc.json')
    }
    setCastes(castelist.default);
    setStudentData((prev) => ({
      ...prev,
      "Community": value,
      "Caste Name": "", 
    }));


  }catch(err){
    console.log(err);
    setCastes([]);
  }
  };
 
  setStudentData((prev)=>({
    ...prev,[name]:value,
  }))
  setError((prevErrors)=>{
    const updatedErrors={...prevErrors};
    if(updatedErrors[name]){
      let isvalid=true;
      if(value.trim()===""){
        isvalid=false;
      }
      if (["candidatename", "Religion", "Community", "Caste Name", "Parent Occupation", "state", "district", "otherStateName", "Board of Exam", "FG Cert Issued District", "Remarks"
].includes(name) &&/\d/.test(value)) {
      isvalid=false;
    }
     if(name==="mobile"&&isNaN(value)){
      isvalid=false;
    }
    else if(name==="mobile"&&!/^\d{10}$/.test(value)){
      isvalid=false;
    }
     const numericFields = [
      "appln_no", "Aadhar", "Univ Reg Num", "Annual Income", "FG Certificate Number", "sem1max", "sem1obt", "sem2max", "sem2obt", "sem3max", "sem3obt", "sem4max", "sem4obt", "overallmax", "overallobt"];
    if (numericFields.includes(name) && isNaN(value)) {
      isvalid=false;
    }
      if(isvalid){
        delete updatedErrors[name];
      }
    }
    return updatedErrors;
  })
};

// const handleCommunityChange=async(e)=>{
//   const selectedCommunity=e.target.value;
//   setStudentData((prev) => ({
//     ...prev,
//     community: selectedCommunity,
//     caste: '', 
//   }));
//   delete error[e.target.name];
//   try{
//     let castelist=[];
//     if(selectedCommunity==='BC'){
//       castelist=await import('../../../src/constants/bc.json');
//     }
//     else if(selectedCommunity==='BCM'){
//       castelist=await import('../../../src/constants/bcm.json')
//     }
//     else if(selectedCommunity==='SC'){
//       castelist=await import('../../../src/constants/sc.json')
//     }
//     else if(selectedCommunity==='SCA'){
//       castelist=await import('../../../src/constants/sca.json')
//     }
//     else if(selectedCommunity==='ST'){
//       castelist=await import('../../../src/constants/st.json')
//     }
//     else{
//       castelist=await import('../../../src/constants/mbc.json')
//     }
//     setCastes(castelist.default);

//   }catch(err){
//     console.log(err);
//     setCastes([]);
//   }
// }

const currentyear=new Date().getFullYear();
const fromYear=1950;
const Yearlist=[];
for (let year=fromYear;year<=currentyear;year++){
   Yearlist.push({ label: year.toString(), key: year.toString(), value: year.toString() });
}
  return (
    <div className="collegewholediv">
      <div id="appln_no">
        <Inputfield name={"appln_no"} type={"text"} placeholder={"Application Number"} onchange={handleChange} value={appln_no} disabled={true}/>
      </div>
      <div id="category" style={{gap:'50px'}}>
        <Inputfield label={"CATEGORY"} id={"CATEGORY"} eltname={"CATEGORY"} type={"dropdown"} htmlfor={"CATEGORY"} options={[{label:"Government",value:"Government"},{label:"Government-Aided",value:"Government-Aided"}]} value={studentData.CATEGORY} onchange={handleChange} error={error["CATEGORY"]}/>
                  <div style={{display:'flex',gap:'10px'}}>
          <Button
            name={"ADD"}
            style={{ width: "130px" }}
          />
          <Button
            name={"CLEAR"}
            style={{
              width: "130px",
              backgroundColor: "red", 
            }}
            onClick={handleClear}
          /></div>
      </div>
      <div>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">PERSONAL DETAILS</legend>
          <div className="field-row">
            <Inputfield label={"Candidate's Name"} id={"candidatename"} eltname={"candidatename"} type={"text"} htmlfor={"candidatename"} classname={"field-block"} value={studentData["candidatename"]} error={error["candidatename"]} onchange={handleChange}/>
            <Inputfield label={"Date of Birth"} id={"dob"} eltname={"dob"} type={"date"} htmlfor={"dob"} classname={"field-block"} value={studentData["dob"]} onchange={handleChange} error={error["dob"]}/>
          </div>
          <div className="field-row">
            <Inputfield eltname={"gender"} type={"radio"} radiolabel={"Gender :"} classname={"field-block"} onchange={handleChange} options={[{label:"Male",value:"Male"},{label:"Female",value:"Female"},{label:"Transgender",value:"Transgender"}]} value={studentData["gender"]} error={error["gender"]}/>
            <Inputfield eltname={"mobile"} type={"text"} label={"Mobile"} classname={"field-block"} id={"mobile"} onchange={handleChange} htmlfor={"mobile"} value={studentData["mobile"]} error={error["mobile"]}/>
          </div>
          <div className="field-row">
            <Inputfield eltname={"email"} type={"text"} label={"Email"} classname={"field-block"} onchange={handleChange} id={"email"} htmlfor={"email"} value={studentData["email"]} error={error["email"]}/>
            <Inputfield eltname={"Aadhar"} type={"text"} label={"Aadhar No"} classname={"field-block"} id={"Aadhar"} onchange={handleChange} htmlfor={"Aadhar"} value={studentData["Aadhar"]} error={error["Aadhar"]}/>
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
            <legend className="collegelegend">ELIGIBILITY DETAILS</legend>
            <div className="field-row">
                <Inputfield eltname={"Nationality"} type={"radio"} radiolabel={"Nationality :"} onchange={handleChange} classname={"field-block"} options={[{label:"Indian",value:"Indian"},{label:"Srilankan Refugee",value:"Srilankan Refugee"},{label:"Others",value:"Others"}]} id={"Nationality"} htmlfor={"Nationality"} value={studentData["Nationality"]} error={error["Nationality"]}/>
                <Inputfield eltname={"Nativity"} type={"radio"} radiolabel={"Nativity :"} onchange={handleChange} options={[{label:"Tamilnadu",value:"Tamilnadu"},{label:"Others",value:"Others"}]} classname={"field-block"} id={"Nativity"} htmlfor={"Nativity"} value={studentData["Nativity"]} error={error["Nativity"]}/>
            </div>
        <div className="field-row">
          <Inputfield eltname={"Religion"} type={"dropdown"} label={"Religion"} classname={"field-block"} onchange={handleChange} id={"Religion"} htmlfor={"Religion"} options={[{label:"Hindu",key:"Hindu",value:"Hindu"},{label:"Muslim",key:"Muslim",value:"Muslim"},{label:"Christian",key:"Christian",value:"Christian"}]} value={studentData["Religion"]} error={error["Religion"]}/>
          {(studentData["Religion"]==="Hindu"|| studentData["Religion"]==="Christian")&&(
            <Inputfield eltname={"Community"} type={"dropdown"} label={"Community"} classname={"field-block"} id={"Community"} htmlfor={"Community"} options={[{label:"BC",key:"BC",value:"BC"},{label:"SC",key:"SC",value:"SC"},{label:"SCA",key:"SCA",value:"SCA"},{label:"ST",key:"ST",value:"ST"},{label:"MBC",key:"MBC",value:"MBC"}]} onchange={handleChange} value={studentData["Community"]} error={error["Community"]}/>
          )}
          {studentData["Religion"]==="Muslim" &&(
            <Inputfield eltname={"Community"} type={"dropdown"} label={"Community"} classname={"field-block"} id={"Community"} htmlfor={"Community"} options={[{label:"BCM",key:"BCM",value:"BCM"}]} onchange={handleChange} value={studentData["Community"]} error={error["Community"]}/>
          )}
        </div>
        <div className="field-row">
          <Inputfield eltname={"Caste Name"} type={"dropdown"} label={"Caste Name"} classname={"field-block"} id={"CasteName"} htmlfor={"CasteName"} options={caste.map((c) => ({label: c.name,key:c.name,value: c.name}))} onchange={handleChange} value={studentData["Caste Name"]} error={error["Caste Name"]}/>
          <Inputfield eltname={"Parent Occupation"} type={"dropdown"} label={"Parent Occupation"} options={[{label:"Agriculture",value:"Agriculture",key:"Agriculture"},{label:"Others",value:"Others",key:"Others"}]} classname={"field-block"} id={"ParentOccupation"} htmlfor={"ParentOccupation"} value={studentData["ParentOccupation"]} onchange={handleChange} error={error["Parent Occupation"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"state"} type={"dropdown"} id={"state"} label={"State"} htmlfor={"state"} options={[ { label: "Tamilnadu", value: "Tamilnadu" }, { label: "Others", value: "Others" } ]} onchange={(e) =>
    setStudentData({ ...studentData, state: e.target.value, district: "" }) 
  } classname={"field-block"} value={studentData["state"]} error={error["state"]}/>
      {studentData["state"] === "Tamilnadu" && (
          <Inputfield eltname={"district"} type={"dropdown"} id={"district"} label={"District"} htmlfor={"district"} options={tamilnaduDistricts} onchange={(e)=>setStudentData({...studentData,district:e.target.value})} classname={"field-block"} value={studentData["district"]} error={error["district"]}/>
      )}

      {studentData["state"] === "Others" && (
          <Inputfield eltname={"otherState"} type={"text"} id={"otherState"} label={"State Name"} htmlfor={"otherState"} onchange={(e)=>setStudentData({...studentData,otherStateName:e.target.value})} classname={"field-block"} value={studentData["otherState"]} error={error["otherState"]}/>
      )}
    </div>
        <div className="field-row">
            <Inputfield eltname={"studied in TN"} type={"radio"} radiolabel={"Last 5 Years Studied in TamilNadu?"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"studied in TN"} htmlfor={"studied in TN"} value={studentData["studied in TN"]} onchange={handleChange} error={error["studied in TN"]}/>

        </div>
      </fieldset>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">ACADEMIC DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"Qualifying Examination"} type={"dropdown"} label={"Qualifying Examination"} classname={"field-block"} options={[{label:"DIPLOMO",key:"DIPLOMO",value:"DIPLOMO"},{label:"BSC",key:"BSC",value:"BSC"},{label:"OTHERS",key:"OTHERS",value:"OTHERS"}]} id={"QualifyingExam"} value={studentData["Qualifying Examination"]} htmlfor={"QualifyingExam"} onchange={handleChange} error={error["Qualifying Examination"]}/>
          <Inputfield eltname={"Year of Passing"} type={"dropdown"} label={"Year of Passing"} classname={"field-block"} id={"YearOfPassing"} htmlfor={"YearOfPassing"} options={Yearlist} value={studentData["Year of Passing"]} onchange={handleChange} error={error["Year of Passing"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"Univ Reg Num"} type={"text"} label={"University Reg. Number"} classname={"field-block"} id={"UnivRegNum"} htmlfor={"UnivRegNum"} value={studentData["Univ Reg Num"]} onchange={handleChange} error={error["Univ Reg Num"]}/>
          <Inputfield eltname={"Board of Exam"} type={"dropdown"} label={"Board of Examination"} classname={"field-block"} id={"BoardExam"} htmlfor={"BoardExam"} options={[{label:"DOTE",key:"DOTE",value:"DOTE"},{label:"Autonomous",key:"Autonomous",value:"Autonomous"},{label:"University",key:"University",value:"University"},{label:"Others",key:"Others",value:"Others"}]} value={studentData["Board of Exam"]} onchange={handleChange} error={error["Board of Exam"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"coursetype"} type={"radio"} radiolabel={"Course Type"} classname={"field-block"} options={[{label:"Regular",key:"Regular",value:"Regular"},{label:"Lateral",key:"Lateral",value:"Lateral"},{label:"Part time",key:"Part time",value:"Part time"},{label:"Sandwich (7 Semesters)",key:"Sandwich (7 Semesters)",value:"Sandwich (7 Semesters)"},{label:"Sandwich (8 Semesters)",key:"Sandwich (8 Semesters)",value:"Sandwich (8 Semesters)"},{label:"BSC",key:"BSC",value:"BSC"}]} id={"QualifyingExam"} value={studentData["coursetype"]} htmlfor={"QualifyingExam"} onchange={handleChange} error={error["coursetype"]}/>
        </div>
        <div>
          <Inputfield eltname={"mathsstudied"} type={"radio"} radiolabel={"Maths Studied in 12th or Degree Level"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"mathsstudied"} htmlfor={"mathsstudied"} value={studentData["mathsstudied"]} onchange={handleChange} error={error["mathsstudied"]}/>
        </div>
      </fieldset>

      <fieldset className="collegefieldset">
        <legend className="collegelegend">SCHOLARSHIP DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"Annual Income"} type={"text"} label={"Annual Income"} classname={"field-block"} id={"AnnualIncome"} htmlfor={"AnnualIncome"} value={studentData["Annual Income"]} onchange={handleChange} error={error["Annual Income"]}/>
          <Inputfield eltname={"First Graduate"} type={"radio"} radiolabel={"First Graduate :"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"FirstGraduate"} htmlfor={"FirstGraduate"} value={studentData["First Graduate"]} onchange={handleChange} error={error["First Graduate"]}/>
        </div>
          <div className="field-row">
          <Inputfield eltname={"AICTE Tuition fee"} type={"radio"} radiolabel={"AICTE Tuition Fee Waiver (TFW) Scheme :"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"AICTE Tuition Fee"} htmlfor={"AICTE Tuition Fee"} value={studentData["AICTE Tuition fee"]} onchange={handleChange} error={error["AICTE Tuition fee"]}/>
          <Inputfield eltname={"PMS"} type={"radio"} radiolabel={"Postmatric Scholarship(SC/ST/SCA/Converted Christians) :"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"PMS"} htmlfor={"PMS"} value={studentData["PMS"]} onchange={handleChange} error={error["PMS"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"FG Cert Issued District"} type={"dropdown"} label={"FG Cert Issued District"} classname={"field-block"} id={"FGDistrict"} htmlfor={"FGDistrict"} options={tamilnaduDistricts} onchange={handleChange} value={studentData["FG Cert Issued District"]} error={error["FG Cert Issued District"]}/>
          <Inputfield eltname={"FG Certificate Number"} type={"text"} label={"FG Certificate Number"} classname={"field-block"} id={"FGCertificateNumber"} htmlfor={"FGCertificateNumber"} value={studentData["FG Certificate Number"]} onchange={handleChange} error={error["FG Certificate Number"]}/>
        </div>
        <div className="field-row-single">
          <Inputfield eltname={"fg fees"} type={"text"} label={"First Graduate Fees"} classname={"field-block"} id={"fg fees"} htmlfor={"fg fees"} value={studentData["fg fees"]} onchange={handleChange} error={error["fg fees"]}/>
        </div>
      </fieldset>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">MARK DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"sem1max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 1"} classname={"field-block"} id={"sem1max"} htmlfor={"sem1max"} value={studentData["sem1max"]} onchange={handleChange} error={error["sem1max"]}/>
          <Inputfield eltname={"sem1obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 1"} classname={"field-block"} id={"sem1obt"} htmlfor={"sem1obt"} value={studentData["sem1obt"]} onchange={handleChange} error={error["sem1obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem2max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 2"} classname={"field-block"} id={"sem2max"} htmlfor={"sem2max"} value={studentData["sem2max"]} onchange={handleChange} error={error["sem2max"]}/>
          <Inputfield eltname={"sem2obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 2"} classname={"field-block"} id={"sem2obt"} htmlfor={"sem2obt"} value={studentData["sem2obt"]} onchange={handleChange} error={error["sem2obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem3max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 3"} classname={"field-block"} id={"sem3max"} htmlfor={"sem3max"} value={studentData["sem3max"]} onchange={handleChange} error={error["sem3max"]}/>
          <Inputfield eltname={"sem3obt"} placeholder={"Obtained Marks"} type={"text"} classname={"field-block"} label={"SEMESTER 3"} id={"sem3obt"} htmlfor={"sem3obt"} value={studentData["sem3obt"]} onchange={handleChange} error={error["sem3obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem4max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 4"} classname={"field-block"} id={"sem4max"} htmlfor={"sem4max"} value={studentData["sem4max"]} onchange={handleChange} error={error["sem4max"]}/>
          <Inputfield eltname={"sem4obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 4"} classname={"field-block"} id={"sem4obt"} htmlfor={"sem4obt"} value={studentData["sem4obt"]} onchange={handleChange} error={error["sem4obt"]}/>
        </div>
      </fieldset>
      <div>
        <fieldset className="collegefieldset">
          <h3 className="fileinstruction">(All Certificates should be in the format of JPG/JPEG/PNG/GIF/PDF)</h3>
          <h3 className="fileinstruction">Other than this format should not be viewable</h3>
  <legend className="collegelegend">UPLOAD CERTIFICATES</legend>
  {certificates.map((cert, index) => (
    <div id= "fileuploaddiv" className="field-row" key={cert.id}>
      <label>{cert.name} (size-limit: 500kb)</label>
      {cert.file ? (
        <div className="viewdelbuttonupload">
          <p className="status">File uploaded successfully</p>
          <button className="view" type="button" onClick={() => handleView(cert.file)}>View</button>
          <button className="remove" type="button" onClick={() => handleDelete(index)}>Remove</button>
          <input id="studentfiles" style={{color:"blue"}} type="file" disabled onChange={handleChange}/>
          <Alert
          type={alertType}
          message={alertMessage}
          show={showAlert}
          okbutton={alertOkAction}
          cancelbutton={alertStage==='confirm'?handlecloseAlert:null}
          />
        </div>
      ) : (
        <div className="viewdelbuttonnot">
          <p className="status">To be upload</p>
          <button className="view" type="button" disabled>View</button>
          <button className="remove" type="button" disabled>Remove</button>
          <input type="file" name="files" onChange={(e) => handleFileChange(e, index)} /><br></br>
          {error["files"] && <span className="error-message">{error["files"]}</span>}

        </div>
      )}
    </div>
  ))} 
</fieldset>
    <div>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">REMARKS</legend>
        <h4>Remarks on student (if any)</h4>
        <textarea name="Remarks" id="studentRemarks" cols="80" rows="10" value={studentData["Remarks"]} onChange={handleChange}></textarea><br></br>
        {error["Remarks"] && <p className="error-message">{error["Remarks"]}</p>}
      </fieldset>
    </div>
    <div id="studentbutton">
          <Button name={"UPDATE"} onClick={handleAddStudent}  />
          <Button name={"DELETE"} onClick={handleStuDelete}  />
          <Alert
          type={alertType}
          message={alertMessage}
          show={showAlert}
          okbutton={alertOkAction}
          cancelbutton={alertStage==='confirm'?handlecloseAlert:null}
          />
      </div> 
      </div>
      </div>
    </div>
  )
}
export default Addstudent;