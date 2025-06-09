import { useState } from 'react'
import './CollegeInfo.css'
import Button from '../../widgets/button/Button';
import Alert from '../../widgets/alert/Alert';
import Inputfield from '../../widgets/collegewidget/Inputfield';

const CollegeInfo = () => {
  const [selectedSection,setSelectedSection]=useState('All')
  const [showAlert, setShowAlert] = useState(false);
  const[alertType,setAlertType]=useState('');
  const[alertMessage,setAlertMessage]=useState('');

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = () => {
  setShowAlert(true);
  setAlertType('success')
  setAlertMessage("Logged in successfully")
  };
  const handleCancel=()=>{
    setShowAlert(true);
    setAlertMessage("Something went wrong");
    setAlertType('error');
  }

  return (
    <div className="collegewholediv">
      <div className='dropdown'>
      <label>Options</label>
        <select onChange={(e)=>setSelectedSection(e.target.value)} value={selectedSection}>
            <option value="All">All</option>
            <option value="collegeinfo">college info</option>
            <option value="addressinfo">Address Details</option>
            <option value="basicinfo">Basic info</option>
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
              <Inputfield eltname={"collegecode"} type={"text"} label={"College Code"} id={"collegecode"} htmlfor={"collegecode"} classname={"field-block"} />
              <Inputfield eltname={"college name With district"} type={"text"} label={"College-name-With-district"} id={"cnwd"} htmlfor={"cwnd"} classname={"field-block"} />
              </div>
              <div className="field-row">
              <Inputfield eltname={"chairman"} type={"text"} label={"Name of the Chairman"} id={"chairman"} htmlfor={"chairman"}  classname={"field-block"} />
              <Inputfield eltname={"chairman's contact"} type={"text"} label={"chairman's contact"} id={"chairmancontact"} htmlfor={"chairmancontact"}  classname={"field-block"} />
              </div>
             <div className='field-row'>
              <Inputfield eltname={"principal's name"} type={"text"} label={"Name of the principal"} id={"principal"} htmlfor={"principal"}  classname={"field-block"} />
              <Inputfield eltname={"principal's contact"} type={"text"} label={"Principal Contact Number"} id={"principalcontact"} htmlfor={"principalcontact"}  classname={"field-block"} />
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
              <textarea  name="address" id="Address"></textarea>
            </div>
          <Inputfield eltname={"taluk"} type={"text"} label={"Taluk"} id={"taluk"} htmlfor={"taluk"} classname={"field-block"} />
          </div>

          <div className='field-row'>
          <Inputfield eltname={"district"} type={"text"} label={"District"} id={"district"} htmlfor={"district"} classname={"field-block"} />
          <Inputfield eltname={"constituency"} type={"text"} label={"Constituency"} id={"constituency"} htmlfor={"constituency"} classname={"field-block"} />
          </div>
          <div className='field-row'>
          <Inputfield eltname={"pincode"} type={"text"} label={"Pincode"} id={"pincode"} htmlfor={"pincode"} classname={"field-block"} />
          <Inputfield eltname={"collegephone"} type={"text"} label={"College Phone/Fax"} id={"collegephone"} htmlfor={"collegephone"} classname={"field-block"} />
          </div>

          <div className='field-row'>
         <Inputfield eltname={"collegeemaii"} type={"email"} label={"Email ID"} id={"email"} htmlfor={"email"} classname={"field-block"} />
          <Inputfield eltname={"websitecollege"} type={"text"} label={"Website"} id={"website"} htmlfor={"website"} classname={"field-block"} />
          </div>

          <div className='field-row-single'>
          <Inputfield eltname={"antiraggingNo"} type={"text"} label={"Anti-Ragging Contact No"} id={"antiragging"} htmlfor={"antiragging"} classname={"field-block"} />
          </div>
          </fieldset>

            </>
        )}

         {(selectedSection==='All' || selectedSection==='basicinfo') && (
            <>
            <fieldset className="collegefieldset">
            <legend className="collegelegend">Bank Info</legend>
           <div className='field-row'>
              <Inputfield eltname="bankaccountno" type="text" label="Bank Account No" id="bankaccountNo" htmlfor="bankaccountno" classname="field-block" />
              <Inputfield eltname="bankname" type="text" label="Bank Name" id="bankname" htmlfor="bankname" classname="field-block" />
            </div>
            <div className='field-row'>
            <Inputfield eltname={"minoritystatus"} type={"radio"} radiolabel={"Minority Status"} classname={"field-block"}  options={[{label:"Yes",value:"Yes"},{label:"No",value:"No"}]}/>
            <Inputfield eltname={"autonomousstatus"} type={"radio"} radiolabel={"Autonomous Status"} classname={"field-block"}  options={[{label:"Yes",value:"Yes"},{label:"No",value:"No"}]}/>
            </div>

            <div className='field-row'>
                <Inputfield eltname="distance" type="text" label="Distance in KM's" id="distance" htmlfor="distance" classname="field-block" />
                <Inputfield eltname="nearestrailway" type="text" label="Nearest Railway Station" id="nearestrailway" htmlfor="nearestrailway" classname="field-block" />
            </div>
            <div className="field-row-single">
              <Inputfield eltname="distancefromrailway" type="text" label="Distance in KM's from Railway Station" id="distancefromrailway" htmlfor="distancefromrailway" classname="field-block" />
              </div>
            </fieldset>
            </>
        )}

        {(selectedSection==='All' || selectedSection==='transportfacility') && (
            <>
            <fieldset className="collegefieldset">
            <legend className="collegelegend">Transport Facility</legend>
            <div className='field-row'>
              <Inputfield eltname={"transportfacility"} type={"radio"} radiolabel={"Transport Facility"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
              <Inputfield eltname={"transport"} type={"radio"} radiolabel={"Transport"} classname={"field-block"} options={[{ label: "Optional", value: "Optional" }, { label: "Compulsory", value: "Compulsory" }]} />
              </div>

            <div className='field-row'>

                <Inputfield eltname={"mintransportcharge"} type={"text"} label={"Min Transport Charge (Rs/Year)"} id={"mintransportcharge"} htmlfor={"mintransportcharge"} classname={"field-block"}  />
                <Inputfield eltname={"maxtransportcharge"} type={"text"} label={"Max Transport Charge (Rs/Year)"} id={"maxtransportcharge"} htmlfor={"maxtransportcharge"} classname={"field-block"} />
                </div>

            </fieldset>
            </>
        )}

        {(selectedSection==='All' || selectedSection==='boyshostel') && (
            <>
            <fieldset className="collegefieldset">
            <legend className="collegelegend">Hostel Facilities for Boys</legend>
            <div className='field-row'>
            <Inputfield eltname={"accomodationavailableboys"} type={"radio"} radiolabel={"Accommodation Available"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
            <Inputfield eltname={"hostelstaytypeboys"} type={"radio"} radiolabel={"Hostel Stay Type"} classname={"field-block"} options={[{ label: "Permanent", value: "Permanent" }, { label: "Rental", value: "Rental" }]} />
            </div>

            <div className='field-row'>
            <Inputfield eltname={"typeofmessboys"} type={"radio"} radiolabel={"Type of Mess"} classname={"field-block"} options={[{ label: "Veg", value: "Veg" }, { label: "Non Veg", value: "Non Veg" }, { label: "Both", value: "Both" }]} />
            <Inputfield eltname={"messbillboys"} type={"text"} radiolabel={"Mess Bill (Rs/Month)"} id={"messbillboys"} htmlfor={"messbillboys"} classname={"field-block"} />
            </div>
            <div className='field-row'>
            <Inputfield eltname={"roomrentboys"} type={"text"} label={"Room Rent (Rs/Month)"} id={"roomrentboys"} htmlfor={"roomrentboys"} classname={"field-block"} />
            <Inputfield eltname={"electricityboys"} type={"text"} label={"Electricity Charges (Rs/Month)"} id={"electricityboys"} htmlfor={"electricityboys"} classname={"field-block"} />
            </div>
            <div className='field-row'>
            <Inputfield eltname={"cautiondepositboys"} type={"text"} label={"Caution Deposit (Rs)"} id={"cautiondepositboys"} htmlfor={"cautiondepositboys"} classname={"field-block"} />
            <Inputfield eltname={"establishmentboys"} type={"text"} label={"Establishment Charges (Rs/Year)"} id={"establishmentboys"} htmlfor={"establishmentboys"} classname={"field-block"} />
            </div>
            <div className="field-row-single">
            <Inputfield eltname={"admissionfeesboys"} type={"text"} label={"Admission Fees (Rs/Year)"} id={"admissionfeesboys"} htmlfor={"admissionfeesboys"} classname={"field-block"} />
            </div>
            </fieldset>

            </>
        )}

        
        {(selectedSection==='All' || selectedSection==='girlshostel') && (
            <>
            <fieldset className="collegefieldset">
            <legend className="collegelegend">Hostel Facilities for Girls</legend>
            <div className='field-row'>
            <Inputfield eltname={"accomodationavailablegirls"} type={"radio"} radiolabel={"Accommodation Available"} classname={"field-block"} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
            <Inputfield eltname={"hostelstaytypegirls"} type={"radio"} radiolabel={"Hostel Stay Type"} classname={"field-block"} options={[{ label: "Permanent", value: "Permanent" }, { label: "Rental", value: "Rental" }]} />
            </div>

            <div className='field-row'>
            <Inputfield eltname={"typeofmessgirls"} type={"radio"} radiolabel={"Type of Mess"} classname={"field-block"} options={[{ label: "Veg", value: "Veg" }, { label: "Non Veg", value: "Non Veg" }, { label: "Both", value: "Both" }]} />
            <Inputfield eltname={"messbillgirls"} type={"text"} radiolabel={"Mess Bill (Rs/Month)"} id={"messbillgirls"} htmlfor={"messbillgirls"} classname={"field-block"} />
            </div>

            <div className='field-row'>
            <Inputfield eltname={"roomrentgirls"} type={"text"} label={"Room Rent (Rs/Month)"} id={"roomrentgirls"} htmlfor={"roomrentgirls"} classname={"field-block"} />
            <Inputfield eltname={"electricitygirls"} type={"text"} label={"Electricity Charges (Rs/Month)"} id={"electricitygirls"} htmlfor={"electricitygirls"} classname={"field-block"} />
            </div>

            <div className='field-row'>
            <Inputfield eltname={"cautiondepositgirls"} type={"text"} label={"Caution Deposit (Rs)"} id={"cautiondepositgirls"} htmlfor={"cautiondepositgirls"} classname={"field-block"} />
            <Inputfield eltname={"establishmentgirls"} type={"text"} label={"Establishment Charges (Rs/Year)"} id={"establishmentgirls"} htmlfor={"establishmentgirls"} classname={"field-block"} />
            </div>
            <div className="field-row-single">
            <Inputfield eltname={"admissionfeesgirls"} type={"text"} label={"Admission Fees (Rs/Year)"} id={"admissionfeesgirls"} htmlfor={"admissionfeesgirls"} classname={"field-block"} />
            </div>

            </fieldset>
            </>
        )}
        <div id="collegebutton">
          <Button name={"SUBMIT"} onClick={handleSubmit} />
         <Alert type={alertType}
        message={alertMessage}
        show={showAlert}
        close={handleCloseAlert}
        />
         <div>
          <Button name={"CANCEL"} onClick={handleCancel} />
          <Alert
        type={alertType}
        message={alertMessage}
        show={showAlert}
        close={handleCloseAlert} />
        </div>
         
        </div>  
       
       
        </div>
  )
}
export default CollegeInfo;