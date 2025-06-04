import { useState } from "react";
import "./CollegeInfo.css";
import Button from "../../widgets/button/Button";
import Alert from "../alert/Alert";

export const CollegeInfo = () => {
  const [selectedSection, setSelectedSection] = useState("All");
  const [showAlert, setShowAlert] = useState(false);
  const [bool, setBool] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = () => {
    setShowAlert(true);
  };

  return (
    <div className="container-college">
      <div className="dropdown">
        <label>Options</label>
        <select
          onChange={(e) => setSelectedSection(e.target.value)}
          value={selectedSection}
        >
          <option value="All">All</option>
          <option value="collegeinfo">college info</option>
          <option value="addressinfo">Address Details</option>
          <option value="basicinfo">Basic info</option>
          <option value="transportfacility">Transport Facilities</option>
          <option value="boyshostel">Hostel Facilities for Boys</option>
          <option value="girlshostel">Hostel Facilities for Girls</option>
        </select>
      </div>

      {(selectedSection === "All" || selectedSection === "collegeinfo") && (
        <>
          <fieldset>
            <legend>College info</legend>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="collegecode">College Code</label>
                <input type="text" id="collegecode" name="collegecode" />
              </div>
              <div className="field-block">
                <label htmlFor="cnwd">College Name With District</label>
                <input
                  type="text"
                  id="cnwd"
                  name="college name with district"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="chairman">Name of the Chairman</label>
                <input type="text" id="chairman" name="chairman" />
              </div>

              <div className="field-block">
                <label htmlFor="chairmancontact">Chairman Contact Number</label>
                <input
                  type="text"
                  id="chairmancontact"
                  name="chairman's contact"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="principal">Name of the principal</label>
                <input type="text" id="principal" name="principal's name" />
              </div>

              <div className="field-block">
                <label htmlFor="principalcontact">
                  Principal contact number
                </label>
                <input
                  type="text"
                  id="principalcontact"
                  name="principal's contact"
                />
              </div>
            </div>
          </fieldset>

          <br />
          <br />
        </>
      )}

      {(selectedSection === "All" || selectedSection === "addressinfo") && (
        <>
          <fieldset>
            <legend>Address Details</legend>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="Address">Address(Enter address only)</label>
                <textarea name="address" id="Address"></textarea>
              </div>
              <div className="field-block">
                <label htmlFor="taluk">Taluk</label>
                <input type="text" id="taluk" name="taluk" />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="district">District</label>
                <input type="text" id="district" name="district" />
              </div>
              <div className="field-block">
                <label htmlFor="constituency">Constituency</label>
                <input type="text" id="constituency" name="constituency" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="pincode">Pincode</label>
                <input type="text" id="pincode" name="pincode" />
              </div>

              <div className="field-block">
                <label htmlFor="collegephone">Collegephone/Fax</label>
                <input type="text" id="collegephone" name="collegephone" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="email">Email id</label>
                <input type="email" id="email" name="collegeemaii" />
              </div>

              <div className="field-block">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="websitecollege" />
              </div>
            </div>
            <div className="field-row">
              <label htmlFor="antiragging">Anti-Ragging contact No</label>
              <input type="text" id="antiragging" name="antiraggingNo" />
            </div>
          </fieldset>
          <br />
          <br />
        </>
      )}

      {(selectedSection === "All" || selectedSection === "basicinfo") && (
        <>
          <fieldset>
            <legend>Basic Info</legend>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="bankaccountno">Bank AccountNo</label>
                <input
                  name="bankaccountno"
                  id="bankaccountNo"
                  type="text"
                ></input>
              </div>

              <div className="field-block">
                <label htmlFor="bankname">Bank Name</label>
                <input type="text" id="bankname" name="bankname" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="minoritystatus">Minority Status</label>
                  <input
                    type="radio"
                    id="minoritystatus"
                    name="minoritystatus"
                  />
                  Yes
                  <input
                    type="radio"
                    id="minoritystatus"
                    name="minoritystatus"
                  />
                  No
                </div>
              </div>

              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="autonomousstatus">Autonomous Status</label>
                  <input
                    type="radio"
                    id="autonomousstatus"
                    name="autonomousstatus"
                  />
                  Yes
                  <input
                    type="radio"
                    id="autonomousstatus"
                    name="autonomousstatus"
                  />
                  No
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="distance">Distance in KM's</label>
                <input type="text" id="distance" name="distance" />
              </div>

              <div className="field-block">
                <label htmlFor="nearestrailway">Nearest Railway Station</label>
                <input type="text" id="nearestrailway" name="nearestrailway" />
              </div>
            </div>

            <label htmlFor="distancefromrailway">
              Distance in KM's from Railway Station
            </label>
            <input
              type="text"
              id="distancefromrailway"
              name="distancefromrailway"
            />
          </fieldset>
          <br />
          <br />
        </>
      )}

      {(selectedSection === "All" ||
        selectedSection === "transportfacility") && (
        <>
          <fieldset>
            <legend>Transport Facility</legend>

            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="transportfacility">Transport Facility</label>
                  <input
                    type="radio"
                    id="transportfacility"
                    name="transportfacility"
                  />
                  Yes
                  <input
                    type="radio"
                    id="transportfacility"
                    name="transportfacility"
                  />
                  No
                </div>
              </div>

              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="transport">Transport</label>
                  <input type="radio" id="transport" name="transport" />
                  Optional
                  <input type="radio" id="transport" name="transport" />
                  Compulsory
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="mintransportcharge">
                  Min Transport Charge(Rs/Year)
                </label>
                <input
                  type="text"
                  id="mintransportcharge"
                  name="mintransportcharge"
                />
              </div>

              <div className="field-block">
                <label htmlFor="maxtransportcharge">
                  Max Transport Charge(Rs/Year)
                </label>
                <input
                  type="text"
                  id="maxtransportcharge"
                  name="maxtransportcharge"
                />
              </div>
            </div>
          </fieldset>
          <br />
          <br />
        </>
      )}

      {(selectedSection === "All" || selectedSection === "boyshostel") && (
        <>
          <fieldset>
            <legend>Hostel Facilities for Boys</legend>
            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="accomodationavailableboys">
                    Accommodation Available
                  </label>
                  <input
                    type="radio"
                    id="accomodationavailableboys"
                    name="accomodationavailableboys"
                  />
                  Yes
                  <input
                    type="radio"
                    id="accomodationavailableboys"
                    name="accomodationavailableboys"
                  />
                  No
                </div>
              </div>

              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="hostelstaytypeboys">Hostel Stay Type</label>
                  <input
                    type="radio"
                    id="hostelstaytypeboys"
                    name="hostelstaytypeboys"
                  />
                  Permanent
                  <input
                    type="radio"
                    id="hostelstaytypeboys"
                    name="hostelstaytypeboys"
                  />
                  Rental
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="typeofmessboys">Type of Mess</label>
                  <input
                    type="radio"
                    id="typeofmessboys"
                    name="typeofmessboys"
                  />
                  Veg
                  <input
                    type="radio"
                    id="typeofmessboys"
                    name="typeofmessboys"
                  />
                  Non Veg
                  <input
                    type="radio"
                    id="typeofmessboys"
                    name="typeofmessboys"
                  />
                  Both
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="messbillboys">Mess Bill (Rs/Month)</label>
                <input type="text" id="messbillboys" name="messbillboys" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-block">
                <label htmlFor="roomrentboys">Room Rent(Rs/Month)</label>
                <input type="text" id="roomrentboys" name="roomrentboys" />
              </div>

              <div className="field-block">
                <label htmlFor="electricityboys">
                  Electricity Charges(Rs/Month)
                </label>
                <input
                  type="text"
                  id="electricityboys"
                  name="electricityboys"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="cautiondepositboys">Caution Deposit(Rs)</label>
                <input
                  type="text"
                  id="cautiondepositboys"
                  name="cautiondepositboys"
                />
              </div>

              <div className="field-block">
                <label htmlFor="establishmentboys">
                  Establishment Charges(Rs/Year)
                </label>
                <input
                  type="text"
                  id="establishmentboys"
                  name="establishmentboys"
                />
              </div>
            </div>

            <label htmlFor="admissionfeesboys">Admission Fees(Rs/Year)</label>
            <input
              type="text"
              id="admissionfeesboys"
              name="admissionfeesboys"
            />
          </fieldset>
          <br />
          <br />
        </>
      )}

      {(selectedSection === "All" || selectedSection === "girlshostel") && (
        <>
          <fieldset>
            <legend>Hostel Facilities for Girls</legend>
            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="accomodationavailablegirls">
                    Accomodation Available
                  </label>
                  <input
                    type="radio"
                    id="accomodationavailablegirls"
                    name="accomodationavailablegirls"
                  />
                  Yes
                  <input
                    type="radio"
                    id="accomodationavailablegirls"
                    name="accomodationavailablegirls"
                  />
                  No
                </div>
              </div>

              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="hostelstaytypegirls">Hostel Stay Type</label>
                  <input
                    type="radio"
                    id="hostelstaytypegirls"
                    name="hostelstaytypegirls"
                  />
                  Permanent
                  <input
                    type="radio"
                    id="hostelstaytypegirls"
                    name="hostelstaytypegirls"
                  />
                  Rental
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <div className="radio-group">
                  <label htmlFor="typeofmessgirls">Type of Mess</label>
                  <input
                    type="radio"
                    id="typeofmessgirls"
                    name="typeofmessgirls"
                  />
                  Veg
                  <input
                    type="radio"
                    id="typeofmessgirls"
                    name="typeofmessgirls"
                  />
                  Non Veg
                  <input
                    type="radio"
                    id="typeofmessgirls"
                    name="typeofmessgirls"
                  />
                  Both
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="messbillgirls">Mess Bill (Rs/Month)</label>
                <input type="text" id="messbillgirls" name="messbillgirls" />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="roomrentgirls">Room Rent(Rs/Month)</label>
                <input type="text" id="roomrentgirls" name="roomrentgirls" />
              </div>

              <div className="field-block">
                <label htmlFor="electricitygirls">
                  Electricity Charges(Rs/Month)
                </label>
                <input
                  type="text"
                  id="electricitygirls"
                  name="electricitygirls"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-block">
                <label htmlFor="cautiondepositgirls">Caution Deposit(Rs)</label>
                <input
                  type="text"
                  id="cautiondepositgirls"
                  name="cautiondepositgirls"
                />
              </div>

              <div className="field-block">
                <label htmlFor="establishmentgirls">
                  Establishment Charges(Rs/Year)
                </label>
                <input
                  type="text"
                  id="establishmentgirls"
                  name="establishmentgirls"
                />
              </div>
            </div>

            <label htmlFor="admissionfeesgirls">Admission Fees(Rs/Year)</label>
            <input
              type="text"
              id="admissionfeesgirls"
              name="admissionfeesgirls"
            />
          </fieldset>
        </>
      )}
      <div>
        <Button name={"SUBMIT"} onClick={handleSubmit} />
        <Alert
          type="success"
          message="Logged in successfully"
          show={showAlert}
          close={handleCloseAlert}
        />
      </div>
      <div>
        <Button name={"CANCEL"} onClick={handleSubmit} />
        <Alert
          type="error"
          message="Something went wrong!"
          show={showAlert}
          close={handleCloseAlert}
        />
      </div>
    </div>
  );
};
