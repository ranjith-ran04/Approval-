import { useEffect, useState } from 'react'
import './CollegeInfo.css'
import axios from 'axios';
import Button from '../../widgets/button/Button';
import Alert from '../../widgets/alert/Alert';
import Inputfield from '../../widgets/college/Inputfield';
import {adminhost, host} from '../../../src/constants/backendpath';

const CollegeInfo = ({admin}) => {
  const[selectedSection,setSelectedSection]=useState('All')
  const[showAlert, setShowAlert] = useState(false);
  const[alertType,setAlertType]=useState('');
  const[alertMessage,setAlertMessage]=useState('');
  const[formdata,setFormdata]=useState({})
  const[error,setError]=useState({})
  const[alertStage,setAlertStage]=useState('');
  const[changedFields,setchangedFields]=useState({})
  

const requiredFields = ["chairman","chairmancontact","principalname","principalcontact","address","taluk","district","constituency","pincode","collegephone","collegeemail","websitecollege","antiraggingNo","bankaccountno","bankname","minoritystatus", "autonomousstatus","distance","nearestrailway","distancefromrailway","transportfacility","transport","mintransportcharge","maxtransportcharge","accomodationavailableboys","hostelstaytypeboys","typeofmessboys","messbillboys","roomrentboys","electricityboys","cautiondepositboys",
  "establishmentboys",
  "admissionfeesboys",
  "accomodationavailablegirls",
  "hostelstaytypegirls",
  "typeofmessgirls",
  "messbillgirls",
  "roomrentgirls",
  "electricitygirls",
  "cautiondepositgirls",
  "establishmentgirls",
  "admissionfeesgirls"
];
const validateFields = () => {
  const newErrors = {};
  requiredFields.forEach((field) => {
    const value = formdata[field];

    if (!value || value.trim() === "") {
      newErrors[field] = "This field is required";
      return; 
    }

    if (["collegenameWithdistrict", "chairman", "principalname", "district", "taluk", "constituency", "nearestrailway"].includes(field) &&/\d/.test(value)) {
      newErrors[field] = "Only letters are allowed";
    }
    const telephone=["chairmancontact", "principalcontact", "collegephone"];
    if(telephone.includes(field)&&isNaN(value)){
      newErrors[field]="Only numbers are allowed";
    }
    else if(telephone.includes(field) &&!/^\d{10}$/.test(value)) {
      newErrors[field] = "Enter a valid 10-digit phone number";
    }
    // if (field === "collegeemail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    //   newErrors[field] = "Invalid email format";
    // }
    if (field === "pincode" && !/^\d{6}$/.test(value)) {
      newErrors[field] = "Enter a valid 6-digit pincode";
    }
    const numericFields = [
      "bankaccountno", "distance", "distancefromrailway",
      "mintransportcharge", "maxtransportcharge",
      "messbillboys", "roomrentboys", "electricityboys", "cautiondepositboys", "establishmentboys", "admissionfeesboys",
      "messbillgirls", "roomrentgirls", "electricitygirls", "cautiondepositgirls", "establishmentgirls", "admissionfeesgirls"];
    if (numericFields.includes(field) && isNaN(value)) {
      newErrors[field] = "Only numbers are allowed";
    }
    else if(field==="collegecode" && value.length!==1&&value.length!==4){
      newErrors[field]="College code must be 1 or 4";
    }
  });
  setError(newErrors);
  if(Object.keys(newErrors).length === 0){
    return true;
  }
  else{
    return false;
  }
};
const handleChange =(e)=>{
      const{name,value}=e.target;
      console.log(formdata.minoritystatus);
      setFormdata((prev)=>({
        ...prev,
        [name]:value,
      }));
      setchangedFields((prev)=>({...prev,[name]:value}));
      setError((prevErrors) => {
    const updatedErrors = { ...prevErrors };

    if (updatedErrors[name]) {
      let isValid = true;
      if (value.trim() === "") {
        isValid = false;
      }
      if(["collegenameWithdistrict", "chairman", "principalname", "district", "taluk", "constituency", "nearestrailway"].includes(name) &&/\d/.test(value)){
        isValid = false;
      }
      const telephone = ["chairmancontact", "principalcontact", "collegephone"];
      if (telephone.includes(name)) {
        if (isNaN(value) || !/^\d{10}$/.test(value)) {
          isValid = false;
        }
      }
      if (name === "collegeemail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
      }
      if (name === "pincode" && !/^\d{6}$/.test(value)) {
        isValid = false;
      }
      const numericFields = [
        "collegecode", "bankaccountno", "distance", "distancefromrailway",
        "mintransportcharge", "maxtransportcharge",
        "messbillboys", "roomrentboys", "electricityboys", "cautiondepositboys", "establishmentboys", "admissionfeesboys",
        "messbillgirls", "roomrentgirls", "electricitygirls", "cautiondepositgirls", "establishmentgirls", "admissionfeesgirls"
      ];
      if(numericFields.includes(name) && isNaN(value)) {
        isValid = false;
      }
      if (name === "collegecode" && !(value.length === 1 || value.length === 4)) {
        isValid = false;
      }

      if (isValid) {
        delete updatedErrors[name]; 
      }
    }

    return updatedErrors;
  });
  };
    const handleCloseAlert = () => {
      setShowAlert(false);
      setAlertStage('')
    };
     
    useEffect(() => {
    const fetchCollegeData=async() => {
      const collegecode=5901;
        try {
          var res;
          if(admin){
          const res=await axios.post(`${adminhost}collegeadmin`,{collegecode:collegecode},{withCredentials:true});
          if(res.status===200){
            setFormdata(res.data.data);
          }
          }
          else{
          const res = await axios.get(`${host}collegeinfo`,{withCredentials:true});
          if (res.status===200) {
            setFormdata(res.data.data);
          }
          }
          console.log(res);
          // if (res.status===200) {
          //   setFormdata(res.data.data);
          // }
        } catch (err) {
            console.log(err);
        }
    };
    fetchCollegeData();
}, []); 
    const handleconfirmAlert=async()=>{

      setShowAlert(false);
      try{
        if(Object.keys(changedFields).length===0){
          setShowAlert(true);
          setAlertMessage("Your details are already saved.");
          setAlertStage('success');
          setAlertType('success');
          return;
        }
        var response;
        var collegecode=1;
        if(admin){
          response=await axios.put(`${adminhost}collegeadmin`,{collegecode:collegecode,changedFields:changedFields},{withCredentials:true});
          if(response.status===200){
          setchangedFields({});
          setFormdata((prevData) => ({
          ...prevData,
          ...response.data.data,
        }));
      
          }
          setShowAlert(true);
          setAlertStage('success');
          setAlertMessage('Your Details are saved');
          setAlertType('success');
        }else{   
         response=await axios.put(`${host}collegeinfo`,{changedFields:changedFields},{withCredentials:true});
         if(response.status===200){
          // setchangedFields({});
          setFormdata((prevData) => ({
  ...prevData,
  ...response.data.data,
}));

        }
        setShowAlert(true);
        setAlertStage('success');
        setAlertMessage('Your Details are saved');
        setAlertType('success');
      }
      }
      catch(error){
        console.log(error)
        setShowAlert(true);
        setAlertMessage("Unable to connnect to server...")
        setAlertStage('error')
        setAlertType('error');
      }
    };
    const handleSubmit = (e) => {
      // e.preventDefault();
      const isValid=validateFields()
      if(isValid){
        setShowAlert(true);
        setAlertMessage("Are you sure to submit");
        setAlertType('warning');
        setAlertStage('confirm')
      }
      else{
        setShowAlert(true);
        setAlertMessage("Please Fill All Fields!");
        setAlertType('warning');
        setAlertStage('validation')
      }
    };

  return (
    <div className="collegewholediv">
      <div className='dropdown'>
      <label>Options</label>
        <select onChange={(e)=>setSelectedSection(e.target.value)} value={selectedSection}>
            <option value="All">All</option>
            <option value="collegeinfo">college info</option>
            <option value="addressinfo">Address Details</option>
            <option value="basicinfo">Bank info</option>
            <option value="transportfacility">Transport Facilities</option>
            <option value="boyshostel">Hostel Facilities for Boys</option>
            <option value="girlshostel">Hostel Facilities for Girls</option>

        </select>
        </div>

          {(selectedSection==='All' || selectedSection==='collegeinfo') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">College info</legend>
                <div className="field-row">
                <Inputfield eltname={"collegecode"} type={"text"} label={"College Code"} id={"collegecode"} htmlfor={"collegecode"} classname={"field-block"} onchange={handleChange} error={error["collegecode"]} value={formdata?.collegecode||""} disabled={true}/>
                <Inputfield eltname={"collegenameWithdistrict"} type={"text"} label={"College name With district"} id={"cnwd"} htmlfor={"cwnd"} classname={"field-block"} onchange={handleChange} error={error["collegenameWithdistrict"]} value={formdata?.collegenameWithdistrict||""} disabled={true}/>
                </div>
                <div className="field-row">
                <Inputfield eltname={"chairman"} type={"text"} label={"Name of the Chairman"} id={"chairman"} htmlfor={"chairman"}  classname={"field-block"} onchange={handleChange} error={error["chairman"]} value={formdata?.chairman||""}/>
                <Inputfield eltname={"chairmancontact"} type={"text"} label={"chairman's contact"} id={"chairmancontact"} htmlfor={"chairmancontact"}  classname={"field-block"} error={error["chairmancontact"]} onchange={handleChange} value={formdata?.chairmancontact||""}/>
                </div>
              <div className='field-row'>
                <Inputfield eltname={"principalname"} type={"text"} label={"Name of the principal"} id={"principal"} htmlfor={"principal"}  classname={"field-block"} error={error["principalname"]} onchange={handleChange} value={formdata?.principalname||""}/>
                <Inputfield eltname={"principalcontact"} type={"text"} label={"Principal Contact Number"} id={"principalcontact"} htmlfor={"principalcontact"}  classname={"field-block"} error={error["principalcontact"]} onchange={handleChange} value={formdata?.principalcontact||""}/>
              </div>
              </fieldset>
              </>
              
          )}

          {(selectedSection==='All' || selectedSection==='addressinfo') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">Address Details</legend>
              <div className='field-row'>
              <div className='field-block'>
                <label htmlFor="Address">Address (Enter address only)</label>
                <textarea  name="address" id="Address" onChange={handleChange} value={formdata?.address||""}></textarea>
                {error["address"] && <p className="error-message">{error["address"]} </p>}
              </div>
            <Inputfield eltname={"taluk"} type={"text"} label={"Taluk"} id={"taluk"} htmlfor={"taluk"} classname={"field-block"} error={error["taluk"]} onchange={handleChange} value={formdata?.taluk||""}/>
            </div>

            <div className='field-row'>
            <Inputfield eltname={"district"} type={"text"} label={"District"} id={"district"} htmlfor={"district"} classname={"field-block"} error={error["district"]} onchange={handleChange} value={formdata?.district||""}/>
            <Inputfield eltname={"constituency"} type={"text"} label={"Constituency"} id={"constituency"} htmlfor={"constituency"} classname={"field-block"} error={error["constituency"]} onchange={handleChange} value={formdata?.constituency||""}/>
            </div>
            <div className='field-row'>
            <Inputfield eltname={"pincode"} type={"text"} label={"Pincode"} id={"pincode"} htmlfor={"pincode"} classname={"field-block"} error={error["pincode"]} onchange={handleChange} value={formdata?.pincode||""}/>
            <Inputfield eltname={"collegephone"} type={"text"} label={"College Phone/Fax"} id={"collegephone"} htmlfor={"collegephone"} classname={"field-block"} error={error["collegephone"]} onchange={handleChange} value={formdata?.collegephone||""}/>
            </div>

            <div className='field-row'>
             <Inputfield eltname={"collegeemail"} type={"text"} label={"Email ID"} id={"email"} htmlfor={"email"} classname={"field-block"} error={error["collegeemail"]} onchange={handleChange} value={formdata?.collegeemail||""}/>
            <Inputfield eltname={"websitecollege"} type={"text"} label={"Website"} id={"website"} htmlfor={"website"} classname={"field-block"} error={error["websitecollege"]} onchange={handleChange} value={formdata?.websitecollege||""}/>
            </div>

            <div className='field-row-single'>
            <Inputfield eltname={"antiraggingNo"} type={"text"} label={"Anti-Ragging Contact No"} id={"antiragging"} htmlfor={"antiragging"} classname={"field-block"} error={error["antiraggingNo"]} onchange={handleChange} value={formdata?.antiraggingNo||""}/>
            </div>
            </fieldset>

              </>
          )}

          {(selectedSection==='All' || selectedSection==='basicinfo') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">Bank Info</legend>
            <div className='field-row'>
                <Inputfield eltname={"bankaccountno"} type={"text"} label={"Bank Account No"} id={"bankaccountNo"} htmlfor={"bankaccountno"} classname={"field-block"} error={error["bankaccountno"]} onchange={handleChange} value={formdata?.bankaccountno||""}/>
                <Inputfield eltname={"bankname"} type={"text"} label={"Bank Name"} id={"bankname"} htmlfor={"bankname"} classname={"field-block"} error={error["bankname"]} onchange={handleChange} value={formdata?.bankname||""}/>
              </div>
              <div className='field-row'>
              <Inputfield eltname={"minoritystatus"} type={"radio"} radiolabel={"Minority Status"} classname={"field-block"} options={[{label:"Yes",value:"Yes"},{label:"No",value:"No"}]} error={error["minoritystatus"]} onchange={handleChange} value={formdata?.minoritystatus||""}/>
              <Inputfield eltname={"autonomousstatus"} type={"radio"} radiolabel={"Autonomous Status"} classname={"field-block"} options={[{label:"Yes",value:"Yes"},{label:"No",value:"No"}]} error={error["autonomousstatus"]} onchange={handleChange} value={formdata?.autonomousstatus||""}/>
            
              </div>
              
              </fieldset>
              </>
          )}

          {(selectedSection==='All' || selectedSection==='transportfacility') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">Transport Facility</legend>
              <div className='field-row'>
                <Inputfield eltname={"transportfacility"} type={"radio"} radiolabel={"Transport Facility"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} error={error["transportfacility"]} onchange={handleChange} value={formdata?.transportfacility||""}/>
                <Inputfield eltname={"transport"} type={"radio"} radiolabel={"Transport"} classname={"field-block"} options={[{ label: "Optional", value: "Optional" }, { label: "Compulsory", value: "Compulsory" }]} error={error["transport"]} onchange={handleChange} value={formdata?.transport||""}/>
                </div>

              <div className='field-row'>
                  <Inputfield eltname={"mintransportcharge"} type={"text"} label={"Min Transport Charge (Rs/Year)"} id={"mintransportcharge"} htmlfor={"mintransportcharge"} classname={"field-block"} error={error["mintransportcharge"]} onchange={handleChange} value={formdata?.mintransportcharge||""}/>
                  <Inputfield eltname={"maxtransportcharge"} type={"text"} label={"Max Transport Charge (Rs/Year)"} id={"maxtransportcharge"} htmlfor={"maxtransportcharge"} classname={"field-block"} error={error["maxtransportcharge"]} onchange={handleChange} value={formdata?.maxtransportcharge||""}/>
                  </div>
                <div className='field-row'>
                  <Inputfield eltname={"distance"} type={"text"} label={"Distance in KM's"} id={"distance"} htmlfor={"distance"} classname={"field-block"} error={error["distance"]} onchange={handleChange} value={formdata?.distance||""}/>
                  <Inputfield eltname={"nearestrailway"} type={"text"} label={"Nearest Railway Station"} id={"nearestrailway"} htmlfor={"nearestrailway"} classname={"field-block"} error={error["nearestrailway"]} onchange={handleChange} value={formdata?.nearestrailway||""}/>
              </div>
              <div className="field-row-single">
                <Inputfield eltname={"distancefromrailway"} type={"text"} label={"Distance in KM's from Railway Station"} id={"distancefromrailway"} htmlfor={"distancefromrailway"} classname={"field-block"} error={error["distancefromrailway"]} onchange={handleChange} value={formdata?.distancefromrailway||""}/>
                </div>

              </fieldset>
              </>
          )}

          {(selectedSection==='All' || selectedSection==='boyshostel') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">Hostel Facilities for Boys</legend>
              <div className='field-row'>
              <Inputfield eltname={"accomodationavailableboys"} type={"radio"} radiolabel={"Accommodation Available"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} error={error["accomodationavailableboys"]} onchange={handleChange} value={formdata?.accomodationavailableboys||""}/>
              <Inputfield eltname={"hostelstaytypeboys"} type={"radio"} radiolabel={"Hostel Stay Type"} classname={"field-block"} options={[{ label: "Permanent", value: "Permanent" }, { label: "Rental", value: "Rental" }]} error={error["hostelstaytypeboys"]} onchange={handleChange} value={formdata?.hostelstaytypeboys||""}/>
              </div>

              <div className='field-row'>
              <Inputfield eltname={"typeofmessboys"} type={"radio"} radiolabel={"Type of Mess"} classname={"field-block"} options={[{ label: "Veg", value: "Veg" }, { label: "Non Veg", value: "Non Veg" }, { label: "Both", value: "Both" }]} error={error["typeofmessboys"]} onchange={handleChange} value={formdata?.typeofmessboys||""}/>
              <Inputfield eltname={"messbillboys"} type={"text"} label={"Mess Bill (Rs/Month)"} id={"messbillboys"} htmlfor={"messbillboys"} classname={"field-block"} error={error["messbillboys"]} onchange={handleChange} value={formdata?.messbillboys||""}/>
              </div>
              <div className='field-row'>
              <Inputfield eltname={"roomrentboys"} type={"text"} label={"Room Rent (Rs/Month)"} id={"roomrentboys"} htmlfor={"roomrentboys"} classname={"field-block"} error={error["roomrentboys"]} onchange={handleChange} value={formdata?.roomrentboys||""}/>
              <Inputfield eltname={"electricityboys"} type={"text"} label={"Electricity Charges (Rs/Month)"} id={"electricityboys"} htmlfor={"electricityboys"} classname={"field-block"} error={error["electricityboys"]} onchange={handleChange} value={formdata?.electricityboys||""}/>
              </div>
              <div className='field-row'>
              <Inputfield eltname={"cautiondepositboys"} type={"text"} label={"Caution Deposit (Rs)"} id={"cautiondepositboys"} htmlfor={"cautiondepositboys"} classname={"field-block"} error={error["cautiondepositboys"]} onchange={handleChange} value={formdata?.cautiondepositboys||""}/>
              <Inputfield eltname={"establishmentboys"} type={"text"} label={"Establishment Charges (Rs/Year)"} id={"establishmentboys"} htmlfor={"establishmentboys"} classname={"field-block"} error={error["establishmentboys"]} onchange={handleChange} value={formdata?.establishmentboys||""}/>
              </div>
              <div className="field-row-single">
              <Inputfield eltname={"admissionfeesboys"} type={"text"} label={"Admission Fees (Rs/Year)"} id={"admissionfeesboys"} htmlfor={"admissionfeesboys"} classname={"field-block"} error={error["admissionfeesboys"]} onchange={handleChange} value={formdata?.admissionfeesboys||""}/>
              </div>
              </fieldset>

              </>
          )}

          
          {(selectedSection==='All' || selectedSection==='girlshostel') && (
              <>
              <fieldset className="collegefieldset">
              <legend className="collegelegend">Hostel Facilities for Girls</legend>
              <div className='field-row'>
              <Inputfield eltname={"accomodationavailablegirls"} type={"radio"} radiolabel={"Accommodation Available"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} error={error["accomodationavailablegirls"]} onchange={handleChange} value={formdata?.accomodationavailablegirls||""}/>
              <Inputfield eltname={"hostelstaytypegirls"} type={"radio"} radiolabel={"Hostel Stay Type"} classname={"field-block"} options={[{ label: "Permanent", value: "Permanent" }, { label: "Rental", value: "Rental" }]} error={error["hostelstaytypegirls"]} onchange={handleChange} value={formdata?.hostelstaytypegirls||""}/>
              </div>

              <div className='field-row'>
              <Inputfield eltname={"typeofmessgirls"} type={"radio"} radiolabel={"Type of Mess"} classname={"field-block"} options={[{ label: "Veg", value: "Veg" }, { label: "Non Veg", value: "Non Veg" }, { label: "Both", value: "Both" }]} error={error["typeofmessgirls"]} onchange={handleChange} value={formdata?.typeofmessgirls||""}/>
              <Inputfield eltname={"messbillgirls"} type={"text"} label={"Mess Bill (Rs/Month)"} id={"messbillgirls"} htmlfor={"messbillgirls"} classname={"field-block"} error={error["messbillgirls"]} onchange={handleChange} value={formdata?.messbillgirls||""}/>
              </div>

              <div className='field-row'>
              <Inputfield eltname={"roomrentgirls"} type={"text"} label={"Room Rent (Rs/Month)"} id={"roomrentgirls"} htmlfor={"roomrentgirls"} classname={"field-block"} error={error["roomrentgirls"]} onchange={handleChange} value={formdata?.roomrentgirls||""}/>
              <Inputfield eltname={"electricitygirls"} type={"text"} label={"Electricity Charges (Rs/Month)"} id={"electricitygirls"} htmlfor={"electricitygirls"} classname={"field-block"} error={error["electricitygirls"]} onchange={handleChange} value={formdata?.electricitygirls||""}/>
              </div>
              <div className='field-row'>
              <Inputfield eltname={"cautiondepositgirls"} type={"text"} label={"Caution Deposit (Rs)"} id={"cautiondepositgirls"} htmlfor={"cautiondepositgirls"} classname={"field-block"} error={error["cautiondepositgirls"]} onchange={handleChange} value={formdata?.cautiondepositgirls||""}/>
              <Inputfield eltname={"establishmentgirls"} type={"text"} label={"Establishment Charges (Rs/Year)"} id={"establishmentgirls"} htmlfor={"establishmentgirls"} classname={"field-block"} error={error["establishmentgirls"]} onchange={handleChange} value={formdata?.establishmentgirls||""}/>
              </div>
              <div className="field-row-single">
              <Inputfield eltname={"admissionfeesgirls"} type={"text"} label={"Admission Fees (Rs/Year)"} id={"admissionfeesgirls"} htmlfor={"admissionfeesgirls"} classname={"field-block"} error={error["admissionfeesgirls"]} onchange={handleChange} value={formdata?.admissionfeesgirls||""}/>
              </div>

              </fieldset>
              </>
          )}

          <div id="collegebutton">
            <Button name={"SUBMIT"} onClick={handleSubmit}  />
          <Alert
          type={alertType}
          message={alertMessage}
          show={showAlert}
          okbutton={alertStage==='confirm'? handleconfirmAlert :(alertStage==='success'||alertStage==='validation'||alertStage==='error')? handleCloseAlert:null}
          cancelbutton={alertStage==='confirm'?handleCloseAlert:null}
          />
          </div>   
        </div>
  )
}
export default CollegeInfo;