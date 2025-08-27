import React, { useState } from "react";
import "./input.css";
import Button from "../button/Button";
import { host } from "../../constants/backendpath";
import axios from "axios";
import Alert from "../../widgets/alert/Alert";

const Input = ({add,clicked,click,appln_no}) => {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertStage, setAlertStage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});

  const validations = [
    {
      key: "collegeCode",
      text: "Enter Correct College Code",
      check: (val) => /^\d{4}/.test(val),
    },
    {
      key: "branchCode",
      text: "Enter Correct Branch Code",
      check: (val) => /^\d{4}[A-Z]{2}/.test(val),
    },
    {
      key: "year24",
      text: "Enter digit 24 (year - 2024)",
      check: (val) => /^\d{4}[A-Z]{2}24/.test(val),
    },
    {
      key: "uniqueNumber",
      text: "Enter Valid Number (Eg: 5901CS24001)",
      check: (val) => /^\d{4}[A-Z]{2}24\d{3}$/.test(val),
    },
  ];

  const handleChange = (e) => {
    setInput(e.target.value.toUpperCase());
  };

  const handleFocus = () => {
    if (!touched) {
      setTouched(true);
      validations.forEach((_, index) => {
        setTimeout(() => {
          setVisibleIndexes((prev) => [...prev, index]);
        }, index * 400); // show one by one
      });
    }
  };
  function handleCancel(){
    add(false);
    // clicked(click+1);
  }
  async function handleConfirm(){
    try{
      const result = await axios.post(
        `${host}checkApplnNo`,
        { appln_no: input },
        { withCredentials: true }
      );
      if(result.data.valid){
        add(false);
      clicked(2);
      appln_no(input);
      }
      else{
        setShowAlert(true);
        setAlertMessage("Application Number Already Exists");
        setAlertType("warning");
        setAlertStage("warning");
        setAlertOkAction(() => () => {
          
          setShowAlert(false);
        });
        
      }
    }
    catch(err){
      console.log(err);
    }
    
      
    
  }


  return (
    <div className="input-container">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Eg: 5901CS24001"
        className="input-box"
      />

      <ul className="validation-list">
        {validations.map((item, index) => {
          {/* if (!visibleIndexes.includes(index)) return null; */}
          const passed = item.check(input);
          return (
            <li
              className={`validation-item fade-in ${
                passed ? "valid" : "invalid"
              }`}
              key={item.key}
            >
              <span className="icon">{passed ? "✅" : "❌"}</span>
              {item.text}
            </li>
          );
        })}
      </ul>
      <br/>
                  <div style={{display:'flex',gap:'10px'}}>
          <Button
            name={"ADD"}
            style={{ width: "130px" }}
            onClick={handleConfirm}
          />
          <Button
            name={"CANCEL"}
            style={{
              width: "130px",
              backgroundColor: "red", 
            }}
            onClick={handleCancel}
          />
          <Alert
              type={alertType}
              message={alertMessage}
              show={showAlert}
              okbutton={alertOkAction}
              cancelbutton={ null}
            />
          </div>
    </div>
  );
};

export default Input;
