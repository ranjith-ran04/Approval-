import React, { useState, useEffect } from "react";
import "./input.css";
import Button from "../button/Button";
import { host } from "../../constants/backendpath";
import axios from "axios";
import Alert from "../alert/Alert";

const Input = ({ add, clicked, click, appln_no, collegeCode, branchCode }) => {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const [count, setCount] = useState(null); // ✅ start with null (loading)

  // ✅ Get effective college code (from localStorage if exists)
  const savedCollegeCode = localStorage.getItem("collegeCode");
  const effectiveCollegeCode = savedCollegeCode || collegeCode;

  // 🔹 Fetch count from backend on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.post(
          `${host}student-count`,
          { b_code: branchCode },
          { withCredentials: true }
        );
        if (res.status === 200) {
          console.log(res.data.count);
          setCount(res.data.count); // ✅ set backend count
        } else {
          console.error("Failed to fetch count");
          setCount(0);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setCount(0);
      }
    };

    if (effectiveCollegeCode && branchCode) {
      fetchCount();
    }
  }, [effectiveCollegeCode, branchCode]);

  // ✅ Expected appln number (preview)
  const expectedAppln =
    count !== null
      ? `${effectiveCollegeCode}${branchCode}25${String(count + 1).padStart(
          3,
          "0"
        )}`
      : "";

  const [showAlert, setShowAlert] = useState(false);
  const [alertStage, setAlertStage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});

  const validations = [
    {
      key: "collegeCode",
      text: `College Code must be ${effectiveCollegeCode}`,
      check: (val) => new RegExp(`^${effectiveCollegeCode}`).test(val),
    },
    {
      key: "branchCode",
      text: `Branch Code must be ${branchCode}`,
      check: (val) =>
        new RegExp(`^${effectiveCollegeCode}${branchCode}`).test(val),
    },
    {
      key: "year25",
      text: "Must contain '25' after branch code (for year 2025)",
      check: (val) =>
        new RegExp(`^${effectiveCollegeCode}${branchCode}25`).test(val),
    },
    {
      key: "uniqueNumber",
      text: `Last three digits must be ${String(count + 1).padStart(3, "0")}`,
      check: (val) => {
        const match = val.match(/\d{2}(\d{3})$/); // last 3 digits
        return match && parseInt(match[1], 10) === count + 1;
      },
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
        }, index * 400);
      });
    }
  };

  function handleCancel() {
    add(false);
    // clicked(click+1);
  }
  async function handleConfirm() {
    try {
      const result = await axios.post(
        `${host}checkApplnNo`,
        { appln_no: input },
        { withCredentials: true }
      );
      if (result.data.valid) {
        add(false);
        clicked(2);
        appln_no(input);
      } else {
        setShowAlert(true);
        setAlertMessage("Application Number Already Exists");
        setAlertType("warning");
        setAlertStage("warning");
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleConfirm() {
    // ✅ ensure all validations passed
    const allValid = validations.every((rule) => rule.check(input));
    if (!allValid) {
      alert("Please fix validation errors before confirming.");
      return;
    }
    appln_no(input); // send value to parent
    localStorage.setItem("fromAdd", "true");
    add(false);
    clicked(2);
  }

  return (
    <div className="input-container">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={expectedAppln ? `Eg: ${expectedAppln}` : "Loading..."}
        className="input-box"
      />

      <ul className="validation-list">
        {validations.map((item) => {
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

      <br />
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          name={"ADD"}
          style={{ width: "130px" }}
          onClick={handleConfirm}
          disabled={!validations.every((rule) => rule.check(input))} // disable if invalid
        />
        <Button
          name={"CANCEL"}
          style={{ width: "130px", backgroundColor: "red" }}
          onClick={handleCancel}
        />
        <Alert
          type={alertType}
          message={alertMessage}
          show={showAlert}
          okbutton={alertOkAction}
          cancelbutton={null}
        />
      </div>
    </div>
  );
};

export default Input;
