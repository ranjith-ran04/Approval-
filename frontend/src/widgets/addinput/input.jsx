import React, { useState } from "react";
import "./input.css";
import Button from "../button/Button";

const Input = ({add,clicked,click,appln_no}) => {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

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
    clicked(click+1);
  }
  function handleConfirm(){
    add(false);
    clicked(click+1);
    appln_no(input);
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
          /></div>
    </div>
  );
};

export default Input;
