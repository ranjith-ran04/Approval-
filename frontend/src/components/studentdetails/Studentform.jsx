import Inputfield from "../../../src/widgets/college/Inputfield";
import {useState} from 'react';
import '../../components/College/CollegeInfo.css';
import Alert from "../../widgets/alert/Alert";
import Button from "../../widgets/button/Button";
import tamilnaduDistricts from "../../../src/constants/Tndistricts"

const Addstudent = () => {
const [studentData,setStudentData]=useState({});
const [caste,setCastes]=useState([])
const [showAlert, setShowAlert] = useState(false);
const [alertStage,setAlertStage]=useState('');
const [alertType,setAlertType]=useState('');
const [alertMessage,setAlertMessage]=useState('');
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
const handlecloseAlert=()=>{
  setShowAlert(false);
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

const handleChange = (e) => {
    const { name, value }=e.target;
    setStudentData((prev) => ({
        ...prev,
        [name]: value
    }));
};
const handleCommunityChange=async(e)=>{
  const selectedCommunity=e.target.value;
  setStudentData((prev) => ({
    ...prev,
    community: selectedCommunity,
    caste: '', 
  }));
  try{
    let castelist=[];
    if(selectedCommunity==='BC'){
      castelist=await import('../../../src/constants/bc.json');
    }
    else if(selectedCommunity==='BCM'){
      castelist=await import('../../../src/constants/bcm.json')
    }
    else if(selectedCommunity==='SC'){
      castelist=await import('../../../src/constants/sc.json')
    }
    else if(selectedCommunity==='SCA'){
      castelist=await import('../../../src/constants/sca.json')
    }
    else if(selectedCommunity==='ST'){
      castelist=await import('../../../src/constants/st.json')
    }
    else{
      castelist=await import('../../../src/constants/mbc.json')
    }
    setCastes(castelist.default);
  }catch(err){
    console.log(err);
    setCastes([]);
  }
}

const currentyear=new Date().getFullYear();
const fromYear=1950;
const Yearlist=[];
for (let year=fromYear;year<=currentyear;year++){
   Yearlist.push({ label: year.toString(), key: year.toString(), value: year.toString() });
}
  return (
    <div className="collegewholediv">
      <div id="appln_no">
        <input name="appln_no" type="text" placeholder="Application Number" />
      </div>
      <div id="category">
        <Inputfield label={"CATEGORY"} id={"CATEGORY"} eltname={"CATEGORY"} type={"dropdown"} htmlfor={"CATEGORY"} options={[{label:"Government",value:"Government"},{label:"Government-Aided",value:"Government-Aided"}]} value={studentData["CATEGORY"]}/>
      </div>
      <div>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">PERSONAL DETAILS</legend>
          <div className="field-row">
            <Inputfield label={"Candidate's Name"} id={"candidatename"} eltname={"candidatename"} type={"text"} htmlfor={"candidatename"} classname={"field-block"} value={studentData["candidatename"]}/>
            <Inputfield label={"Date of Birth"} id={"dob"} eltname={"dob"} type={"date"} htmlfor={"dob"} classname={"field-block"} value={studentData["dob"]}/>
          </div>
          <div className="field-row">
            <Inputfield eltname={"gender"} type={"radio"} radiolabel={"Gender :"} classname={"field-block"} options={[{label:"Male",value:"Male"},{label:"Female",value:"Female"},{label:"Transgender",value:"Transgender"}]} value={studentData["gender"]}/>
            <Inputfield eltname={"mobile"} type={"text"} label={"Mobile"} classname={"field-block"} id={"mobile"} htmlfor={"mobile"} value={studentData["mobile"]}/>
          </div>
          <div className="field-row">
            <Inputfield eltname={"email"} type={"text"} label={"Email"} classname={"field-block"} id={"email"} htmlfor={"email"} value={studentData["email"]}/>
            <Inputfield eltname={"Aadhar"} type={"text"} label={"Aadhar No"} classname={"field-block"} id={"Aadhar"} htmlfor={"Aadhar"} value={studentData["Aadhar"]}/>
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
            <legend className="collegelegend">ELIGIBILITY DETAILS</legend>
            <div className="field-row">
                <Inputfield eltname={"Nationality"} type={"radio"} radiolabel={"Nationality :"} classname={"field-block"} options={[{label:"Indian",value:"Indian"},{label:"Srilankan Refugee",value:"Srilankan Refugee"},{label:"Others",value:"Others"}]} id={"Nationality"} htmlfor={"Nationality"} value={studentData["Nationality"]}/>
                <Inputfield eltname={"Nativity"} type={"radio"} radiolabel={"Nativity :"} options={[{label:"Tamilnadu",value:"Tamilnadu"},{label:"Others",value:"Others"}]} classname={"field-block"} id={"Nativity"} htmlfor={"Nativity"} value={studentData["Nativity"]}/>
            </div>
        <div className="field-row">
          <Inputfield eltname={"Religion"} type={"dropdown"} label={"Religion"} classname={"field-block"} id={"Religion"} htmlfor={"Religion"} options={[{label:"Hindu",key:"Hindu",value:"Hindu"},{label:"Muslim",key:"Muslim",value:"Muslim"},{label:"Christian",key:"Christian",value:"Christian"},{label:"Others",key:"Others",value:"Others"}]} value={studentData["Religion"]}/>
          <Inputfield eltname={"Community"} type={"dropdown"} label={"Community"} classname={"field-block"} id={"Community"} htmlfor={"Community"} options={[{label:"BC",key:"BC",value:"BC"},{label:"BCM",key:"BCM",value:"BCM"},{label:"SC",key:"SC",value:"SC"},{label:"SCA",key:"SCA",value:"SCA"},{label:"ST",key:"ST",value:"ST"},{label:"MBC",key:"MBC",value:"MBC"}]} onchange={handleCommunityChange} value={studentData["Community"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"Caste Name"} type={"dropdown"} label={"Caste Name"} classname={"field-block"} id={"CasteName"} htmlfor={"CasteName"} options={caste.map((c) => ({label: c.name,key:c.name,value: c.name}))} onchange={handleChange} value={studentData["Caste Name"]}/>
          <Inputfield eltname={"Parent Occupation"} type={"dropdown"} label={"Parent Occupation"} options={[{label:"Agriculture",value:"Agriculture",key:"Agriculture"},{label:"Others",value:"Others",key:"Others"}]} classname={"field-block"} id={"ParentOccupation"} htmlfor={"ParentOccupation"} value={studentData["ParentOccupation"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"state"} type={"dropdown"} id={"state"} label={"State"} htmlfor={"state"} options={[ { label: "Tamilnadu", value: "Tamilnadu" }, { label: "Others", value: "Others" } ]} onchange={(e) =>
    setStudentData({ ...studentData, state: e.target.value, district: "" }) 
  } classname={"field-block"} value={studentData["state"]}/>
      {studentData["state"] === "Tamilnadu" && (
          <Inputfield eltname={"district"} type={"dropdown"} id={"district"} label={"District"} htmlfor={"district"} options={tamilnaduDistricts} onchange={(e)=>setStudentData({...studentData,district:e.target.value})} classname={"field-block"} value={studentData["district"]}/>
      )}

      {studentData["state"] === "Others" && (
          <Inputfield eltname={"otherState"} type={"text"} id={"otherState"} label={"Enter State Name"} htmlfor={"otherState"} onchange={(e)=>setStudentData({...studentData,otherStateName:e.target.value})} classname={"field-block"} value={studentData["otherState"]}/>
      )}
    </div>
        <div className="field-row">
            <Inputfield eltname={"studied in TN"} type={"radio"} radiolabel={"Last 5 Years Studied in TamilNadu?"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"studied in TN"} htmlfor={"studied in TN"} value={studentData["studied in TN"]}/>

        </div>
      </fieldset>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">ACADEMIC DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"Qualifying Examination"} type={"dropdown"} label={"Qualifying Examination"} classname={"field-block"} options={[{label:"DIPLOMO",key:"DIPLOMO",value:"DIPLOMO"},{label:"BSC",key:"BSC",value:"BSC"},{label:"OTHERS",key:"OTHERS",value:"OTHERS"}]} id={"QualifyingExam"} value={studentData["Qualifying Examination"]} htmlfor={"QualifyingExam"} onchange={handleChange}/>
          <Inputfield eltname={"Year of Passing"} type={"dropdown"} label={"Year of Passing"} classname={"field-block"} id={"YearOfPassing"} htmlfor={"YearOfPassing"} options={Yearlist} value={studentData["Year of Passing"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"Univ Reg Num"} type={"text"} label={"University Reg. Number"} classname={"field-block"} id={"UnivRegNum"} htmlfor={"UnivRegNum"} value={studentData["Univ Reg Num"]}/>
          <Inputfield eltname={"Board of Exam"} type={"dropdown"} label={"Board of Examination"} classname={"field-block"} id={"BoardExam"} htmlfor={"BoardExam"} options={[{label:"DOTE",key:"DOTE",value:"DOTE"},{label:"Autonomous",key:"Autonomous",value:"Autonomous"},{label:"University",key:"University",value:"University"},{label:"Others",key:"Others",value:"Others"}]} value={studentData["Board of Exam"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"coursetype"} type={"radio"} radiolabel={"Course Type"} classname={"field-block"} options={[{label:"Regular",key:"Regular",value:"Regular"},{label:"Lateral",key:"Lateral",value:"Lateral"},{label:"Part time",key:"Part time",value:"Part time"},{label:"Sandwich (7 Semesters)",key:"Sandwich (7 Semesters)",value:"Sandwich (7 Semesters)"},{label:"Sandwich (8 Semesters)",key:"Sandwich (8 Semesters)",value:"Sandwich (8 Semesters)"},{label:"BSC",key:"BSC",value:"BSC"}]} id={"QualifyingExam"} value={studentData["coursetype"]} htmlfor={"QualifyingExam"} onchange={handleChange}/>
        </div>
        <div>
          <Inputfield eltname={"mathsstudied"} type={"radio"} radiolabel={"Maths Studied in 12th or Degree Level"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"mathsstudied"} htmlfor={"mathsstudied"} value={studentData["mathsstudied"]}/>
        </div>
      </fieldset>

      <fieldset className="collegefieldset">
        <legend className="collegelegend">SCHOLARSHIP DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"Annual Income"} type={"text"} label={"Annual Income"} classname={"field-block"} id={"AnnualIncome"} htmlfor={"AnnualIncome"} value={studentData["Annual Income"]}/>
          <Inputfield eltname={"First Graduate"} type={"radio"} radiolabel={"First Graduate :"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"FirstGraduate"} htmlfor={"FirstGraduate"} value={studentData["First Graduate"]}/>
        </div>
          <div className="field-row">
          <Inputfield eltname={"AICTE Tuition fee"} type={"radio"} radiolabel={"AICTE Tuition Fee Waiver (TFW) Scheme :"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"AICTE Tuition Fee"} htmlfor={"AICTE Tuition Fee"} value={studentData["AICTE Tuition fee"]}/>
          <Inputfield eltname={"PMS"} type={"radio"} radiolabel={"Postmatric Scholarship(SC/ST/SCA/Converted Christians) :"} options={[{ label: "Yes", value: "Yes" },{ label: "No", value: "No" }]} id={"PMS"} htmlfor={"PMS"} value={studentData["PMS"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"FG Cert Issued District"} type={"dropdown"} label={"FG Cert Issued District"} classname={"field-block"} id={"FGDistrict"} htmlfor={"FGDistrict"} options={tamilnaduDistricts} onchange={handleChange} value={studentData["FG Cert Issued District"]}/>
          <Inputfield eltname={"FG Certificate Number"} type={"text"} label={"FG Certificate Number"} classname={"field-block"} id={"FGCertificateNumber"} htmlfor={"FGCertificateNumber"} value={studentData["FG Certificate Number"]}/>
        </div>
        <div className="field-row-single">
          <Inputfield eltname={"fg fees"} type={"text"} label={"First Graduate Fees"} classname={"field-block"} id={"fg fees"} htmlfor={"fg fees"} value={studentData["fg fees"]}/>
        </div>
      </fieldset>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">MARK DETAILS</legend>
        <div className="field-row">
          <Inputfield eltname={"sem1max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 1"} classname={"field-block"} id={"sem1max"} htmlfor={"sem1max"} value={studentData["sem1max"]}/>
          <Inputfield eltname={"sem1obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 1"} classname={"field-block"} id={"sem1obt"} htmlfor={"sem1obt"} value={studentData["sem1obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem2max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 2"} classname={"field-block"} id={"sem2max"} htmlfor={"sem2max"} value={studentData["sem2max"]}/>
          <Inputfield eltname={"sem2obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 2"} classname={"field-block"} id={"sem2obt"} htmlfor={"sem2obt"} value={studentData["sem2obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem3max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 3"} classname={"field-block"} id={"sem3max"} htmlfor={"sem3max"} value={studentData["sem3max"]}/>
          <Inputfield eltname={"sem3obt"} placeholder={"Obtained Marks"} type={"text"} classname={"field-block"} label={"SEMESTER 3"} id={"sem3obt"} htmlfor={"sem3obt"} value={studentData["sem3obt"]}/>
        </div>
        <div className="field-row">
          <Inputfield eltname={"sem4max"} placeholder={"Maximum Marks"} type={"text"} label={"SEMESTER 4"} classname={"field-block"} id={"sem4max"} htmlfor={"sem4max"} value={studentData["sem4max"]}/>
          <Inputfield eltname={"sem4obt"} placeholder={"Obtained Marks"} type={"text"} label={"SEMESTER 4"} classname={"field-block"} id={"sem4obt"} htmlfor={"sem4obt"} value={studentData["sem4obt"]}/>
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
          <input type="file" disabled />
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
          <input type="file" onChange={(e) => handleFileChange(e, index)} />
    
        </div>
      )}
    </div>
  ))} 
</fieldset>
    <div>
      <fieldset className="collegefieldset">
        <legend className="collegelegend">REMARKS</legend>
        <h4>Remarks on student (if any)</h4>
        <textarea name="Remarks" id="studentRemarks" cols="80" rows="10" value={studentData["Remarks"]}></textarea>
      </fieldset>
    </div>
    <div id="studentbutton">
          <Button name={"UPDATE"} onClick={handleUpdate}  />
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