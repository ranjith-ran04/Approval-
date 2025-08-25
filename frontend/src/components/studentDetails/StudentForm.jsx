import Inputfield from "../../../src/widgets/college/Inputfield";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../components/college/CollegeInfo.css";
import Alert from "../../widgets/alert/Alert";
import Button from "../../widgets/button/Button";
import tamilnaduDistricts from "../../../src/constants/Tndistricts";
import { host } from "../../constants/backendpath";
import { useLoader } from "../../context/LoaderContext";
import states from "../../constants/states";

const Addstudent = ({ handleClear, appln_no, index }) => {
  // console.log(index);
  const { showLoader, hideLoader } = useLoader();
  const [changedFields, setchangedFields] = useState({});
  const [studentData, setStudentData] = useState({
    gender: "",
    nationality: "",
    nativity: "",
  });
  const [caste, setCastes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertStage, setAlertStage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState({});
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});
  // const [error,setError] = useState('');
  const [certificates, setCertificates] = useState([
    { id: 1, name: "Community Certificate", file: null },
    { id: 2, name: "Provisional/Degree Certificate", file: null },
    { id: 3, name: "Consolidated Mark Sheet", file: null },
    { id: 4, name: "Transfer Certificate", file: null },
    { id: 5, name: "Equivalency", file: null },
    { id: 6, name: "First Graduate Certificate", file: null },
  ]);
  const requiredFields = [
    "appln_no",
    "CATEGORY",
    "candidatename",
    "dob",
    "files",
    "gender",
    "mobile",
    "email",
    "Aadhar",
    "Nationality",
    "Nativity",
    "Religion",
    "Community",
    "Caste Name",
    "Parent Occupation",
    "state",
    "district",
    "otherStateName",
    "studied in TN",
    "Qualifying Examination",
    "Year of Passing",
    "Univ Reg Num",
    "Board of Exam",
    "coursetype",
    "mathsstudied",
    "Annual Income",
    "First Graduate",
    "AICTE Tuition fee",
    "PMS",
    "FG Cert Issued District",
    "FG Certificate Number",
    "fg fees",
    "sem1max",
    "sem1obt",
    "sem2max",
    "sem2obt",
    "sem3max",
    "sem3obt",
    "sem4max",
    "sem4obt",
    "Remarks",
    "overallmax",
    "overallobt",
    "Percentage",
  ];

  const caste_drop = async (community) => {
    let casteListModule = [];
    switch (community) {
      case "BC":
        casteListModule = ((await import("../../../src/constants/bc.json")).default);
        break;
      case "BCM":
        casteListModule = ((await import("../../../src/constants/bcm.json")).default);
        break;
      case "SC":
        casteListModule = ((await import("../../../src/constants/sc.json")).default);
        break;
      case "SCA":
        casteListModule = ((await import("../../../src/constants/sca.json")).default);
        break;
      case "ST":
        casteListModule = ((await import("../../../src/constants/st.json")).default);
        break;
      case "MBC":
        casteListModule = ((await import("../../../src/constants/mbc.json")).default);
        break;
      case "OC": // Only Others for Open Category
      default: // Only Others when nothing matches
        casteListModule = [{ code: "others" ,name : "" }];
        setCastes(casteListModule);
        return;
    }
    setCastes(casteListModule);
  };

  async function studentInfo() {
    showLoader();
    try {
      const result = await axios.post(
        `${host}student`,
        { appln_no: appln_no },
        { withCredentials: true }
      );
      const raw = result.data?.[0]?.[0];
      // console.log("Raw API:", raw);
      // console.log("API catogory:", raw.catogory);
      // console.log(result.data?.[0]?.[0]);
      if (!raw) {
        console.warn("No student found in response", result.data);
        setStudentData({});
        return;
      }

      // console.log(result.data?.[0]?.[0]);
      setStudentData(raw);
      await caste_drop(raw.community);
    } catch (err) {
      console.log(err);
    } finally {
      hideLoader();
    }
  }

  useEffect(() => {
    studentInfo();
  }, [appln_no]);

  const handlecloseAlert = () => {
    setShowAlert(false);
    // setAlertStage('')
  };
  const validateFields = () => {
    console.log("Entered validation");
    const letterfields = [
      "candidatename",
      "Religion",
      "Caste Name",
      "Parent Occupation",
      "state",
      "district",
      "otherStateName",
      "Board of Exam",
      "FG Cert Issued District",
      "Remarks",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = studentData[field];
      if (!value || studentData[field] === "") {
        newErrors[field] = "This field is required";
      } else {
        if (letterfields.includes(field) && /\d/.test(value)) {
          newErrors[field] = "Only letters are allowed";
        } else if (letterfields.includes(field) && /[!@#$%]/.test(value)) {
          newErrors[field] = "Special characters not allowed";
        }
        if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = "Enter correct email format";
        }
        if (field === "mobile" && isNaN(value)) {
          newErrors[field] = "Only numbers are allowed";
        } else if (field === "mobile" && !/^\d{10}$/.test(value)) {
          newErrors[field] = "Enter 10 digit valid mobile number";
        }
        const numericFields = [
          "appln_no",
          "Aadhar",
          "Univ Reg Num",
          "Annual Income",
          "FG Certificate Number",
          "sem1max",
          "sem1obt",
          "sem2max",
          "sem2obt",
          "sem3max",
          "sem3obt",
          "sem4max",
          "sem4obt",
          "overallmax",
          "overallobt",
        ];
        if (numericFields.includes(field) && isNaN(value)) {
          newErrors[field] = "Only numbers are allowed";
        } else if (numericFields.includes(field) && value <= 0) {
          newErrors[field] = "Negative numbers not allowed";
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
            if (maxVal < obtVal) {
              newErrors[maxField] =
                "Maximum marks should be greater than or equal to obtained marks";
            }
          }
        });
      }
    });
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleAddStudent = () => {
    const noerrors = validateFields();
    if (noerrors) {
      setShowAlert(true);
      setAlertStage("confirm");
      setAlertMessage("Confirm to Add");
      setAlertType("warning");
      setAlertOkAction(() => () => {
        setShowAlert(true);
        setAlertMessage("Updated Successfully");
        setAlertStage("success");
        setAlertType("success");
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
      });
    } else {
      setShowAlert(true);
      setAlertStage("success");
      setAlertMessage("You have errors");
      setAlertType("warning");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    }
  };
  const handleUpdate = async () => {
    setShowAlert(false);
    try {
      if (Object.keys(changedFields).length === 0) {
        setShowAlert(true);
        setAlertMessage("No Changes detected.");
        // setAlertStage("success");
        setAlertType("warning");
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
        return;
      }
      const response = await axios.put(
        `${host}student`,
        { changedFields, appln_no },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setchangedFields({});

        setShowAlert(true);
        setAlertStage("confirm");
        setAlertMessage("Confirm to update");
        setAlertType("warning");
        setAlertOkAction(() => () => {
          setShowAlert(true);
          setAlertMessage("Updated Successfully");
          setAlertStage("success");
          setAlertType("success");
          setAlertOkAction(() => () => {
            setShowAlert(false);
          });
        });
      }
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      setAlertMessage("Unable to connnect to server...");
      setAlertStage("error");
      setAlertType("error");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    }
  };
  const handleStuDelete = async () => {
    setShowAlert(false);
    try {
      const response = await axios.delete(`${host}student`, {
        data: { changedFields, appln_no },
        withCredentials: true,
      });
      if (response.status === 200) {
        setShowAlert(true);
        setAlertStage("confirm");
        setAlertMessage("Confirm to Delete");
        setAlertType("warning");
        setAlertOkAction(() => () => {
          setShowAlert(true);
          setAlertMessage("Deleted Successfully");
          setAlertStage("success");
          setAlertType("success");
          setAlertOkAction(() => () => {
            setShowAlert(false);
            if (index) {
              index(appln_no);
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
      setShowAlert(true);
      setAlertMessage("Unable to connnect to server...");
      setAlertStage("error");
      setAlertType("error");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setCertificates((prev) => {
      const updated = [...prev];
      updated[index].file = file;
      return updated;
    });
    setShowAlert(true);
    setAlertMessage("File Uploaded Successfully");
    setAlertType("success");
    setAlertStage("success");
    setAlertOkAction(() => () => {
      setShowAlert(false);
    });
  };

  const handleView = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    }
  };

  const handleDelete = (index) => {
    setCertificates((prev) => {
      const updated = [...prev];
      updated[index].file = null;
      return updated;
    });
    setShowAlert(true);
    setAlertMessage("Confirm to Delete");
    setAlertStage("confirm");
    setAlertType("warning");
    setAlertOkAction(() => () => {
      setShowAlert(true);
      setAlertMessage("File Deleted Successfully");
      setAlertStage("success");
      setAlertType("success");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    });
  };
  // Extract just the code from backend value
  const casteCodeFromBackend = studentData.caste_name?.split("-")[0];

  // Find matching caste in JSON
  const matchedCaste = caste.find((c) => c.code === casteCodeFromBackend);

  // Build the value in CODE-NAME format from JSON
  const selectedValue = matchedCaste
    ? `${matchedCaste.code}-${matchedCaste.name}`
    : "";
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // For caste_name, you might want to store only the code in backend format
    let updatedValue = value;

    // Example: store as "101-name" if your backend expects that
    if (name === "caste_name") {
      updatedValue = value; // or value.split("-")[0] if you want only code
    }

    if (name === "community") {
      setStudentData((prev) => ({
        ...prev,
        community: value,
        caste_name: "",
      }));

      await caste_drop(value);
    } else {
      setStudentData((prev) => ({ ...prev, [name]: updatedValue }));
    }

    setchangedFields((prev) => ({ ...prev, [name]: value }));
    // Update student data

    // ✅ Validation
    setError((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (updatedErrors[name]) {
        let isValid = true;

        if (value.trim() === "") {
          isValid = false;
        }

        // String fields should not contain digits
        const stringFields = [
          "candidatename",
          "Religion",
          "Community",
          "Caste Name",
          "Parent Occupation",
          "state",
          "district",
          "otherStateName",
          "Board of Exam",
          "FG Cert Issued District",
          "Remarks",
        ];
        if (stringFields.includes(name) && /\d/.test(value)) {
          isValid = false;
        }

        // Mobile validation
        if (name === "mobile") {
          if (isNaN(value) || !/^\d{10}$/.test(value)) {
            isValid = false;
          }
        }

        // Numeric-only fields
        const numericFields = [
          "appln_no",
          "Aadhar",
          "Univ Reg Num",
          "Annual Income",
          "FG Certificate Number",
          "sem1max",
          "sem1obt",
          "sem2max",
          "sem2obt",
          "sem3max",
          "sem3obt",
          "sem4max",
          "sem4obt",
          "overallmax",
          "overallobt",
        ];
        if (numericFields.includes(name) && isNaN(value)) {
          isValid = false;
        }

        // Remove error if valid
        if (isValid) {
          delete updatedErrors[name];
        }
      }

      return updatedErrors;
    });
  };

  const currentyear = new Date().getFullYear();
  const fromYear = 1950;
  const Yearlist = [];
  for (let year = fromYear; year <= currentyear; year++) {
    Yearlist.push({
      label: year.toString(),
      key: year.toString(),
      value: year.toString(),
    });
  }
  // console.log("Before render catogory:", studentData.catogory);

  return (
    <div className="collegewholediv">
      <div id="appln_no">
        <Inputfield
          name={"appln_no"}
          type={"text"}
          placeholder={"Application Number"}
          onChange={handleChange}
          value={appln_no}
          disabled={true}
        />
      </div>

      <div id="category" style={{ gap: "50px" }}>
        <Inputfield
          label={"CATEGORY"}
          id={"CATEGORY"}
          eltname={"catogory"}
          type={"dropdown"}
          htmlfor={"CATEGORY"}
          options={[
            { label: "GOVERNMENT", value: "GOVERNMENT" },
            { label: "MANAGEMENT", value: "MANAGEMENT" },
            { label: "LAP", value: "LAP" },
            { label: "MIN", value: "MIN" },
            { label: "GOI", value: "GOI" },
            { label: "FOR", value: "FOR" },
            { label: "NRI", value: "NRI" },
          ]}
          value={studentData.catogory}
          onChange={handleChange}
          error={error["CATEGORY"]}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            name={"CLEAR"}
            style={{
              width: "130px",
              backgroundColor: "red",
            }}
            onClick={handleClear}
          />
        </div>
      </div>
      <div>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">PERSONAL DETAILS</legend>
          <div className="field-row">
            <Inputfield
              label={"Candidate's Name"}
              id={"candidatename"}
              eltname={"name"}
              type={"text"}
              htmlfor={"candidatename"}
              classname={"field-block"}
              value={studentData.name}
              error={error["candidatename"]}
              onChange={handleChange}
            />
            <Inputfield
              label={"Date of Birth"}
              id={"dob"}
              eltname={"dob"}
              type={"date"}
              htmlfor={"dob"}
              classname={"field-block"}
              value={studentData.dob}
              onChange={handleChange}
              error={error["dob"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"gender"}
              type={"radio"}
              radiolabel={"Gender :"}
              classname={"field-block"}
              onChange={handleChange}
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Transgender", value: "Transgender" },
              ]}
              value={studentData.gender}
              error={error["gender"]}
            />
            <Inputfield
              eltname={"mobile"}
              type={"text"}
              label={"Mobile"}
              classname={"field-block"}
              id={"mobile"}
              onChange={handleChange}
              htmlfor={"mobile"}
              value={studentData.mobile}
              error={error["mobile"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"email"}
              type={"text"}
              label={"Email"}
              classname={"field-block"}
              onChange={handleChange}
              id={"email"}
              htmlfor={"email"}
              value={studentData.email}
              error={error["email"]}
            />
            <Inputfield
              eltname={"aadharno"}
              type={"text"}
              label={"Aadhar No"}
              classname={"field-block"}
              id={"Aadhar"}
              onChange={handleChange}
              htmlfor={"Aadhar"}
              value={studentData.aadharno}
              error={error["Aadhar"]}
            />
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">ELIGIBILITY DETAILS</legend>
          <div className="field-row">
            <Inputfield
              eltname={"nationality"}
              type={"radio"}
              radiolabel={"Nationality :"}
              onChange={handleChange}
              classname={"field-block"}
              options={[
                { label: "Indian", value: "INDIAN" },
                { label: "Srilankan Refugee", value: "SRILANKAN_REFUGEE" },
                { label: "Others", value: "OTHERS" },
              ]}
              id={"Nationality"}
              htmlfor={"Nationality"}
              value={studentData.nationality}
              error={error["Nationality"]}
            />
            <Inputfield
              eltname={"nativity"}
              type={"radio"}
              radiolabel={"Nativity :"}
              onChange={handleChange}
              options={[
                { label: "Tamilnadu", value: "TN" },
                { label: "Others", value: "OTHERS" },
              ]}
              classname={"field-block"}
              id={"Nativity"}
              htmlfor={"Nativity"}
              value={studentData.nativity}
              error={error["Nativity"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"religion"}
              type={"dropdown"}
              label={"Religion"}
              classname={"field-block"}
              onChange={handleChange}
              id={"Religion"}
              htmlfor={"Religion"}
              options={[
                { label: "Hindu", key: "Hindu", value: "Hindu" },
                { label: "Muslim", key: "Muslim", value: "Muslim" },
                { label: "Christian", key: "Christian", value: "Christian" },
                { label: "Sikhism", value: "Sikhism" },
                { label: "Jainism", value: "Jainism" },
                { label: "Others", value: "Others" },
              ]}
              value={studentData.religion}
              error={error["Religion"]}
            />
            {(studentData.religion === "Hindu" ||
              studentData.religion === "Christian") && (
              <Inputfield
                eltname={"community"}
                type={"dropdown"}
                label={"Community"}
                classname={"field-block"}
                id={"Community"}
                htmlfor={"Community"}
                options={[
                  { label: "OC", key: "OC", value: "OC" },
                  { label: "BC", key: "BC", value: "BC" },
                  { label: "MBC", key: "MBC", value: "MBC" },
                  { label: "SC", key: "SC", value: "SC" },
                  { label: "ST", key: "ST", value: "ST" },
                  { label: "SCA", key: "SCA", value: "SCA" },
                  { label: "DNC", key: "DNC", value: "DNC" },
                ]}
                onChange={handleChange}
                value={studentData.community}
                error={error["community"]}
              />
            )}
            {studentData.religion === "Muslim" && (
              <Inputfield
                eltname={"community"}
                type={"dropdown"}
                label={"Community"}
                classname={"field-block"}
                id={"Community"}
                htmlfor={"Community"}
                options={[{ label: "BCM", key: "BCM", value: "BCM" }]}
                onChange={handleChange}
                value={studentData.community}
                error={error["Community"]}
              />
            )}
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"caste_name"}
              type={"dropdown"}
              label={"Caste Name"}
              classname={"field-block"}
              id={"CasteName"}
              htmlfor={"CasteName"}
              options={caste.map((c) => ({
                label: `${c.code}-${c.name}`,
                key: `${c.code}-${c.name}`,
                value: `${c.code}-${c.name}`,
              }))}
              onChange={handleChange}
              value={selectedValue}
              error={error["Caste Name"]}
            />
            <Inputfield
              eltname={"parent_occupation"}
              type={"dropdown"}
              label={"Parent Occupation"}
              options={[
                { label: "Agriculture", value: "Agriculture" },
                {
                  label: "Private Organization",
                  value: "Private Organization",
                },
                { label: "Small Trade", value: "Small Trade" },
                { label: "Business", value: "Business" },
                { label: "Industry", value: "Industry" },
                { label: "Professional", value: "Professional" },
                { label: "Central Govt.", value: "Central Govt." },
                { label: "State Govt.", value: "State Govt." },
                { label: "Others", value: "Others" },
              ]}
              classname={"field-block"}
              id={"ParentOccupation"}
              htmlfor={"ParentOccupation"}
              value={studentData.parent_occupation}
              onChange={handleChange}
              error={error["Parent Occupation"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"state"}
              type={"dropdown"}
              id={"state"}
              label={"State"}
              htmlfor={"state"}
              options={states}
              onChange={(e) =>
                setStudentData({
                  ...studentData,
                  state: e.target.value,
                  district: "",
                })
              }
              classname={"field-block"}
              value={studentData.state}
              error={error["state"]}
            />
            {studentData.state === "TAMILNADU" && (
              <Inputfield
                eltname={"district"}
                type={"dropdown"}
                id={"district"}
                label={"District"}
                htmlfor={"district"}
                options={tamilnaduDistricts}
                onChange={(e) =>
                  setStudentData({ ...studentData, district: e.target.value })
                }
                classname={"field-block"}
                value={studentData.district}
                error={error["district"]}
              />
            )}

            {studentData["state"] === "Others" && (
              <Inputfield
                eltname={"otherState"}
                type={"text"}
                id={"otherState"}
                label={"State Name"}
                htmlfor={"otherState"}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    otherStateName: e.target.value,
                  })
                }
                classname={"field-block"}
                value={studentData["otherState"]}
                error={error["otherState"]}
              />
            )}
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"hsc_tn"}
              type={"radio"}
              radiolabel={"Last 5 Years Studied in TamilNadu?"}
              classname={"field-block"}
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              id={"studied in TN"}
              htmlfor={"studied in TN"}
              value={studentData.hsc_tn}
              onChange={handleChange}
              error={error["studied in TN"]}
            />
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">ACADEMIC DETAILS</legend>
          <div className="field-row">
            <Inputfield
              eltname={"qualifying_exam"}
              type={"dropdown"}
              label={"Qualifying Examination"}
              classname={"field-block"}
              options={[
                { label: "Diplomo", key: "DIPLOMO", value: "DIP" },
                { label: "BSc", key: "BSC", value: "B.Sc" },
                { label: "Others", key: "OTHERS", value: "OTHERS" },
              ]}
              id={"QualifyingExam"}
              value={studentData.qualifying_exam}
              htmlfor={"QualifyingExam"}
              onChange={handleChange}
              error={error["Qualifying Examination"]}
            />
            <Inputfield
              eltname={"year_of_passing"}
              type={"dropdown"}
              label={"Year of Passing"}
              classname={"field-block"}
              id={"YearOfPassing"}
              htmlfor={"YearOfPassing"}
              options={Yearlist}
              value={studentData.year_of_passing}
              onChange={handleChange}
              error={error["Year of Passing"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"univ_reg_no"}
              type={"text"}
              label={"University Reg. Number"}
              classname={"field-block"}
              id={"UnivRegNum"}
              htmlfor={"UnivRegNum"}
              value={studentData.univ_reg_no}
              onChange={handleChange}
              error={error["Univ Reg Num"]}
            />
            <Inputfield
              eltname={"name_of_board"}
              type={"dropdown"}
              label={"Board of Examination"}
              classname={"field-block"}
              id={"BoardExam"}
              htmlfor={"BoardExam"}
              options={[
                { label: "DOTE", key: "DOTE", value: "DOTE" },
                { label: "Autonomous", key: "Autonomous", value: "AUTONOMOUS" },
                { label: "University", key: "University", value: "UNIVERSITY" },
                { label: "UIT", key: "UIT", value: "UIT" },
                { label: "UIO", key: "UIO", value: "UIO" },
                { label: "Others", key: "Others", value: "others" },
              ]}
              value={studentData.name_of_board}
              onChange={handleChange}
              error={error["Board of Exam"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"hsc_group"}
              type={"radio"}
              radiolabel={"Course Type"}
              classname={"field-block"}
              options={[
                { label: "Regular", key: "Regular", value: "DIP-Regular" },
                { label: "Lateral", key: "Lateral", value: "DIP-Lateral" },
                {
                  label: "Part time",
                  key: "Part time",
                  value: "DIP-Part_time",
                },
                {
                  label: "Sandwich (7 Semesters)",
                  key: "Sandwich (7 Semesters)",
                  value: "DIP-Sandwich_7",
                },
                {
                  label: "Sandwich (8 Semesters)",
                  key: "Sandwich (8 Semesters)",
                  value: "DIP-Sandwich_8",
                },
                { label: "BSc", key: "BSC", value: "Bsc" },
              ]}
              id={"QualifyingExam"}
              value={studentData.hsc_group}
              htmlfor={"QualifyingExam"}
              onChange={handleChange}
              error={error["coursetype"]}
            />
          </div>
          <div>
            <Inputfield
              eltname={"maths_studied"}
              type={"radio"}
              radiolabel={"Maths Studied in 12th or Degree Level"}
              classname={"field-block"}
              options={[
                { label: "Yes", value: 1 },
                { label: "No", value: 0 },
              ]}
              id={"mathsstudied"}
              htmlfor={"mathsstudied"}
              value={studentData.maths_studied}
              onChange={handleChange}
              error={error["mathsstudied"]}
            />
          </div>
        </fieldset>

        <fieldset className="collegefieldset">
          <legend className="collegelegend">SCHOLARSHIP DETAILS</legend>
          <div className="field-row">
            <Inputfield
              eltname={"annual_income"}
              type={"text"}
              label={"Annual Income"}
              classname={"field-block"}
              id={"AnnualIncome"}
              htmlfor={"AnnualIncome"}
              value={studentData.annual_income}
              onChange={handleChange}
              error={error["Annual Income"]}
            />
            <Inputfield
              eltname={"fg"}
              type={"radio"}
              radiolabel={"First Graduate :"}
              classname={"field-block"}
              options={[
                { label: "Yes", value: 1 },
                { label: "No", value: 0 },
              ]}
              id={"FirstGraduate"}
              htmlfor={"FirstGraduate"}
              value={studentData.fg}
              onChange={handleChange}
              error={error["First Graduate"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"aicte_tfw"}
              type={"radio"}
              radiolabel={"AICTE Tuition Fee Waiver (TFW) Scheme :"}
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              id={"AICTE Tuition Fee"}
              htmlfor={"AICTE Tuition Fee"}
              value={studentData.aicte_tfw}
              onChange={handleChange}
              error={error["AICTE Tuition fee"]}
            />
            <Inputfield
              eltname={"pms"}
              type={"radio"}
              radiolabel={
                "Postmatric Scholarship(SC/ST/SCA/Converted Christians) :"
              }
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              id={"PMS"}
              htmlfor={"PMS"}
              value={studentData.pms}
              onChange={handleChange}
              error={error["PMS"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"fg_district"}
              type={"dropdown"}
              label={"FG Cert Issued District"}
              classname={"field-block"}
              id={"FGDistrict"}
              htmlfor={"FGDistrict"}
              options={tamilnaduDistricts}
              onChange={handleChange}
              value={studentData.fg_district}
              error={error["FG Cert Issued District"]}
            />
            <Inputfield
              eltname={"fg_no"}
              type={"text"}
              label={"FG Certificate Number"}
              classname={"field-block"}
              id={"FGCertificateNumber"}
              htmlfor={"FGCertificateNumber"}
              value={studentData.fg_no}
              onChange={handleChange}
              error={error["FG Certificate Number"]}
            />
          </div>
          <div className="field-row-single">
            <Inputfield
              eltname={"Amount"}
              type={"text"}
              label={"First Graduate Fees"}
              classname={"field-block"}
              id={"fg fees"}
              htmlfor={"fg fees"}
              value={studentData.Amount}
              onChange={handleChange}
              error={error["fg fees"]}
            />
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">MARK DETAILS</legend>
          <div className="field-row">
            <Inputfield
              eltname={"max_1"}
              placeholder={"Maximum Marks"}
              type={"text"}
              label={"SEMESTER 1"}
              classname={"field-block"}
              id={"sem1max"}
              htmlfor={"sem1max"}
              value={studentData.max_1}
              onChange={handleChange}
              error={error["sem1max"]}
            />
            <Inputfield
              eltname={"obt_1"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 1"}
              classname={"field-block"}
              id={"sem1obt"}
              htmlfor={"sem1obt"}
              value={studentData.obt_1}
              onChange={handleChange}
              error={error["sem1obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_2"}
              placeholder={"Maximum Marks"}
              type={"text"}
              label={"SEMESTER 2"}
              classname={"field-block"}
              id={"sem2max"}
              htmlfor={"sem2max"}
              value={studentData.max_2}
              onChange={handleChange}
              error={error["sem2max"]}
            />
            <Inputfield
              eltname={"obt_2"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 2"}
              classname={"field-block"}
              id={"sem2obt"}
              htmlfor={"sem2obt"}
              value={studentData.obt_2}
              onChange={handleChange}
              error={error["sem2obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_3"}
              placeholder={"Maximum Marks"}
              type={"text"}
              label={"SEMESTER 3"}
              classname={"field-block"}
              id={"sem3max"}
              htmlfor={"sem3max"}
              value={studentData.max_3}
              onChange={handleChange}
              error={error["sem3max"]}
            />
            <Inputfield
              eltname={"obt_3"}
              placeholder={"Obtained Marks"}
              type={"text"}
              classname={"field-block"}
              label={"SEMESTER 3"}
              id={"sem3obt"}
              htmlfor={"sem3obt"}
              value={studentData.obt_3}
              onChange={handleChange}
              error={error["sem3obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_4"}
              placeholder={"Maximum Marks"}
              type={"text"}
              label={"SEMESTER 4"}
              classname={"field-block"}
              id={"sem4max"}
              htmlfor={"sem4max"}
              value={studentData["max_4"]}
              onChange={handleChange}
              error={error["sem4max"]}
            />
            <Inputfield
              eltname={"obt_4"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 4"}
              classname={"field-block"}
              id={"sem4obt"}
              htmlfor={"sem4obt"}
              value={studentData["obt_4"]}
              onChange={handleChange}
              error={error["sem4obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_5"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 5"}
              classname={"field-block"}
              id={"sem5max"}
              htmlfor={"sem5max"}
              value={studentData.max_5}
              onChange={handleChange}
              error={error["sem5max"]}
            />
            <Inputfield
              eltname={"obt_5"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 5"}
              classname={"field-block"}
              id={"sem5obt"}
              htmlfor={"sem5obt"}
              value={studentData.obt_5}
              onChange={handleChange}
              error={error["sem5obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_6"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 6"}
              classname={"field-block"}
              id={"sem6max"}
              htmlfor={"sem6max"}
              value={studentData.max_6}
              onChange={handleChange}
              error={error["sem6max"]}
            />
            <Inputfield
              eltname={"obt_6"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 6"}
              classname={"field-block"}
              id={"sem6obt"}
              htmlfor={"sem6obt"}
              value={studentData["obt_6"]}
              onChange={handleChange}
              error={error["sem6obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_7"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 7"}
              classname={"field-block"}
              id={"sem7max"}
              htmlfor={"sem7max"}
              value={studentData.max_7}
              onChange={handleChange}
              error={error["sem7max"]}
            />
            <Inputfield
              eltname={"obt_7"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 7"}
              classname={"field-block"}
              id={"sem7obt"}
              htmlfor={"sem7obt"}
              value={studentData["obt_7"]}
              onChange={handleChange}
              error={error["sem7obt"]}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"max_8"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 8"}
              classname={"field-block"}
              id={"sem8max"}
              htmlfor={"sem8max"}
              value={studentData.max_8}
              onChange={handleChange}
              error={error["sem8max"]}
            />
            <Inputfield
              eltname={"obt_8"}
              placeholder={"Obtained Marks"}
              type={"text"}
              label={"SEMESTER 8"}
              classname={"field-block"}
              id={"sem8obt"}
              htmlfor={"sem8obt"}
              value={studentData["obt_8"]}
              onChange={handleChange}
              error={error["sem8obt"]}
            />
          </div>
        </fieldset>
        <div>
          <fieldset className="collegefieldset">
            <h3 className="fileinstruction">
              (All Certificates should be in the format of JPG/JPEG/PNG/GIF/PDF)
            </h3>
            <h3 className="fileinstruction">
              Other than this format should not be viewable
            </h3>
            <legend className="collegelegend">UPLOAD CERTIFICATES</legend>
            {certificates.map((cert, index) => (
              <div id="fileuploaddiv" className="field-row" key={cert.id}>
                <label>{cert.name} (size-limit: 500kb)</label>
                {cert.file ? (
                  <div className="viewdelbuttonupload">
                    <p className="status">File uploaded successfully</p>
                    <button
                      className="view"
                      type="button"
                      onClick={() => handleView(cert.file)}
                    >
                      View
                    </button>
                    <button
                      className="remove"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      Remove
                    </button>
                    <input
                      id="studentfiles"
                      style={{ color: "blue" }}
                      type="file"
                      disabled
                      onChange={handleChange}
                    />
                    <Alert
                      type={alertType}
                      message={alertMessage}
                      show={showAlert}
                      okbutton={alertOkAction}
                      cancelbutton={
                        alertStage === "confirm" ? handlecloseAlert : null
                      }
                    />
                  </div>
                ) : (
                  <div className="viewdelbuttonnot">
                    <p className="status">To be upload</p>
                    <button className="view" type="button" disabled>
                      View
                    </button>
                    <button className="remove" type="button" disabled>
                      Remove
                    </button>
                    <input
                      type="file"
                      name="files"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                    <br></br>
                    {error["files"] && (
                      <span className="error-message">{error["files"]}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </fieldset>
          <div>
            <fieldset className="collegefieldset">
              <legend className="collegelegend">REMARKS</legend>
              <h4>Remarks on student (if any)</h4>
              <textarea
                name="remarks"
                id="studentRemarks"
                cols="70"
                rows="10"
                value={studentData.remarks}
                onChange={handleChange}
              ></textarea>
              <br></br>
              {error["Remarks"] && (
                <p className="error-message">{error["Remarks"]}</p>
              )}
            </fieldset>
          </div>
          <div id="studentbutton">
            <Button name={"UPDATE"} onClick={handleUpdate} />
            <Button name={"DELETE"} onClick={handleStuDelete} />
            <Alert
              type={alertType}
              message={alertMessage}
              show={showAlert}
              okbutton={alertOkAction}
              cancelbutton={alertStage === "confirm" ? handlecloseAlert : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Addstudent;
