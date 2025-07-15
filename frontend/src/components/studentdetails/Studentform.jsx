import Inputfield from "../../../src/widgets/college/Inputfield";

const Addstudent = () => {
  return (
    <div className="collegewholediv">
      <input name="appln_no" id="appln_no" placeholder="Application Number"></input>
      <div>
        <fieldset className="collegefieldset">
          <legend>PERSONAL DETAILS</legend>
          <div className="field-row">
            <Inputfield label={"Candidate's Name"} id={"candidatename"} eltname={"candidatename"} type={"text"} htmlfor={"candidatename"} classname={"field-block"} />
            <Inputfield label={"Date of Birth"} id={"dob"} eltname={"dob"} type={"date"} htmlfor={"dob"} classname={"field-block"} />
          </div>
          <div className="field-row">
            <Inputfield label={""}/>
          </div>
        </fieldset>
      </div>
    </div>
  )
}
export default Addstudent;