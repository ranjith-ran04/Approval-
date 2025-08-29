import Inputfield from "../../widgets/college/Inputfield";
import { useEffect, useState } from "react";
import axios from "axios";
import "../college/CollegeInfo.css";
import Alert from "../../widgets/alert/Alert";
import Button from "../../widgets/button/Button";
import tamilnaduDistricts from "../../constants/Tndistricts";
import { host } from "../../constants/backendpath";
import { useLoader } from "../../context/LoaderContext";
import states from "../../constants/states";

const Addstudent = ({ handleClear, appln_no, b_code, index, clicked }) => {
  // // console.log(clicked);
  const { showLoader, hideLoader } = useLoader();
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
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
  const [alertOkAction, setAlertOkAction] = useState(() => () => {});
  const [error, setError] = useState({});
  const [certificates, setCertificates] = useState([]);
  const requiredFields = [
    "a_no",
    "catogory",
    "name",
    "dob",
    // "files",
    "gender",
    "mobile",
    "email",
    "aadharno",
    "nationality",
    "nativity",
    "religion",
    "community",
    "caste_name",
    "parent_occupation",
    "state",
    // "district",
    // "otherStateName",
    "hsc_tn",
    "qualifying_exam",
    "year_of_passing",
    "univ_reg_no",
    "name_of_board",
    "hsc_group",
    "maths_studied",
    "annual_income",
    "fg",
    "aicte_tfw",
    "pms",
    // "fg_district",
    // "fg_no",
    // "Amount",
    // "max_1",
    // "obt_1",
    // "max_2",
    // "obt_2",
    // "max_3",
    // "obt_3",
    // "max_4",
    // "obt_4",
    // "max_5",
    // "obt_5",
    // "max_6",
    // "obt_6",
    // "max_7",
    // "obt_7",
    // "max_8",
    // "obt_8",
  ];
    const semesterRange = {
      "DIP-Regular": { start: 1, end: 6 },
      "DIP-Lateral": { start: 3, end: 6 },
      "DIP-Part_time": { start: 1, end: 8 },
      "DIP-Sandwich_7": { start: 1, end: 7 },
      "DIP-Sandwich_8": { start: 1, end: 8 },
      "DIP-Sandwich_7_lat":{start:3,end:7},
      "DIP-Sandwich_8_lat":{start:3,end:8},
      "Bsc": { start: 1, end: 6 },
    };

  const caste_drop = async (community) => {
    console.log(community);
    
    let casteListModule = [];
    switch (community) {
      case "BC":
        casteListModule = (await import("../../constants/bc.json")).default;
        break;
      case "BCM":
        casteListModule = (await import("../../constants/bcm.json")).default;
        break;
      case "SC":
        console.log("sc");
        casteListModule = (await import("../../constants/sc.json")).default;
        console.log(casteListModule);
        break;
      case "SCA":
        casteListModule = (await import("../../constants/sca.json")).default;
        break;
      case "ST":
        casteListModule = (await import("../../constants/st.json")).default;
        break;
      case "MBC":
        casteListModule = (await import("../../constants/mbc.json")).default;
        break;
      case "OC": // Only Others for Open Category
      default: // Only Others when nothing matches
        casteListModule = [{ code: "others", name: "" }];
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
      const { student, certificates } = result.data;

      setCertificates(certificates);
      if (!student[0]) {
        console.warn("No student found in response", result.data);
        setStudentData({});
        return;
      }
      setStudentData(student[0]);
      // // console.log(certificates);
      console.log("Student raw:", student[0]);
      // // console.log(result.data?.[0]?.[0]);
      const getCert = await axios.post(
        `${host}cert`,
        { appln: appln_no, mobile: student[0]?.mobile },
        { withCredentials: true }
      );
      // // console.log(getCert.data);
      const uploaded = getCert.data;
      // console.log(uploaded);
      const merged = certificates.map((cert) => {
        const match = uploaded.find((f) => f.suffix === cert.key);
        return {
          ...cert,
          uploaded: !!match,
          fileUrl: match ? match.url : null,
        };
      });
      setCertificates(merged);
      // // console.log(merged);
      console.log(student[0].community);
      await caste_drop(student[0].community);
    } catch (err) {
      // console.log(err);
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
    const letterfields = [
      "name",
      "religion",
      "parent_occupation",
      "state",
      "district",
      "otherStateName",
      "name_of_board",
      "fg_district",
      "remarks",
    ];

    if (studentData["fg"] == 1)
      requiredFields.push("fg_no", "fg_district", "Amount");

    const booleanFields = ["fg", "maths_studied"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = studentData[field];
      if (
        (!value && !booleanFields.includes(field)) ||
        studentData[field] === ""
      ) {
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
          "aadharno",
          "annual_income",
          "max_1",
          "obt_1",
          "max_2",
          "obt_2",
          "max_3",
          "obt_3",
          "max_4",
          "obt_4",
          "max_5",
          "obt_5",
          "max_6",
          "obt_6",
          "max_7",
          "obt_7",
          "max_8",
          "obt_8",
        ];
        if (numericFields.includes(field) && isNaN(value)) {
          newErrors[field] = "Only digits are allowed";
        } else if (numericFields.includes(field) && value < 0) {
          newErrors[field] = "Negative numbers not allowed";
        }
        const maxObtPairs = [
          ["max_1", "obt_1"],
          ["max_2", "obt_2"],
          ["max_3", "obt_3"],
          ["max_4", "obt_4"],
          ["max_5", "obt_5"],
          ["max_6", "obt_6"],
          ["max_7", "obt_7"],
          ["max_8", "obt_8"],
        ];
        maxObtPairs.forEach(([maxField, obtField]) => {
          const maxVal = parseFloat(studentData[maxField]);
          const obtVal = parseFloat(studentData[obtField]);

          // alert(maxVal,obtVal)

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
    console.log(newErrors);

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
      setAlertType("warning");
      setAlertOkAction(() => () => setShowAlert(false));
      return;
    }

    const range = semesterRange[studentData.hsc_group] || { start: 0, end: -1 };
    const updatedData = { ...changedFields };

    const allSemesterNums = Array.from({ length: 8 }, (_, i) => i + 1);

    allSemesterNums.forEach((sem) => {
      ["max_", "obt_"].forEach((prefix) => {
        const key = `${prefix}${sem}`;
        if (sem < range.start || sem > range.end) {
          updatedData[key] = 0; 
        } else if (!(key in updatedData)) {
          updatedData[key] = studentData[key] || 0;
        }
      });
    });

    if (!validateFields()) {
      setShowAlert(true);
      setAlertStage("warning");
      setAlertMessage("Please fill the details correctly!");
      setAlertType("warning");
      setAlertOkAction(() => () => setShowAlert(false));
      return;
    }

    const response = await axios.put(
      `${host}student`,
      { changedFields: updatedData, appln_no },
      { withCredentials: true }
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
        setAlertOkAction(() => () => setShowAlert(false));
      });
    }
  } catch (error) {
    setShowAlert(true);
    setAlertMessage("Unable to update kindly try again...");
    setAlertStage("error");
    setAlertType("error");
    setAlertOkAction(() => () => setShowAlert(false));
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
      // console.log(error);
      setShowAlert(true);
      setAlertMessage("Unable to delete kindly try again...");
      setAlertStage("error");
      setAlertType("error");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    }
  };

  const handleFileChange = async (e, key) => {
    setShowAlert(false);
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    const mobile = studentData.mobile;
    formData.append("mobile", mobile);
    formData.append("appln", appln_no);
    formData.append("type", key);
    formData.append("file", file);

    try {
      const res = await axios.post(`${host}certUpl`, formData, {
        withCredentials: true,
      });
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.key === key
            ? { ...cert, uploaded: true, fileUrl: res.data.url }
            : cert
        )
      );
      setShowAlert(true);
      setAlertMessage("File Uploaded Successfully");
      setAlertType("success");
      setAlertStage("success");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    } catch (err) {
      // console.log("Upload Failed!", err);

      let msg = "Upload Failed!";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.error) {
          msg = err.response.data.error;
        }
      }

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.key === key ? { ...cert, uploaded: false, fileUrl: null } : cert
        )
      );
      const input = document.getElementById(`file-input-${key}`);
      if (input) input.value = "";
      if (err.response.status === 400) {
        setShowAlert(true);
        setAlertType("warning");
        setAlertStage("warning");
        setAlertMessage(msg);
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
      } else {
        setShowAlert(true);
        setAlertType("error");
        setAlertStage("error");
        setAlertMessage(msg);
        setAlertOkAction(() => () => {
          setShowAlert(false);
        });
      }
    }
  };

  const handleDelete = async (index) => {
    setShowAlert(false);
    try {
      setShowAlert(true);
      setAlertMessage("Confirm to Delete");
      setAlertStage("confirm");
      setAlertType("warning");
      setAlertOkAction(() => async () => {
        const res = await axios.delete(`${host}cert`, {
          data: { mobile: studentData.mobile, appln: appln_no, type: index },
          withCredentials: true,
        });
        if (res.status === 200) {
          setCertificates((prev) =>
            prev.map((cert) =>
              cert.key === index
                ? { ...cert, uploaded: false, fileUrl: null }
                : cert
            )
          );
          const input = document.getElementById(`file-input-${index}`);
          if (input) input.value = "";

          setAlertMessage("File Deleted Successfully");
          setAlertStage("success");
          setAlertType("success");
          setAlertOkAction(() => () => setShowAlert(false));
          setShowAlert(true);
        }
      });
    } catch (err) {
      console.error("Delete File Failed", err);
      setAlertType("error");
      setAlertStage("error");
      setAlertMessage("Failed to Delete File!");
      setAlertOkAction(() => () => {
        setShowAlert(false);
      });
    }
  };
  // Extract just the code from backend value
  const casteCodeFromBackend = studentData.caste_name;
  console.log(casteCodeFromBackend);
  
  // Find matching caste in JSON
  const matchedCaste = caste.find((c) => c.code === casteCodeFromBackend);
  console.log(matchedCaste);
  
  // Build the value in CODE-NAME format from JSON
  const selectedValue = matchedCaste
    ? `${matchedCaste.code}-${matchedCaste.name}`
    : "";
  const handleChange = async (e) => {
    const { name, value } = e.target;
    // alert(value)
    // For caste_name, you might want to store only the code in backend format
    let updatedValue = value;

    if (name === "caste_name") {
      updatedValue = value;
    }

    if (name === "community") {
      setStudentData((prev) => ({
        ...prev,
        community: value,
        caste_name: "",
      }));

      await caste_drop(value);
    } else if (name == "fg") {
      setStudentData((prev) => ({ ...prev, [name]: parseInt(updatedValue) }));
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
  // // console.log("Before render catogory:", studentData.catogory);
  useEffect(() => {
    if (studentData.course_type !== "Bsc" && studentData.maths_studied) {
      setStudentData((prev) => ({ ...prev, maths_studied: "" }));
    }
  }, [studentData.course_type]);
  useEffect(() => {
  const range = semesterRange[studentData.hsc_group] || { start: 0, end: -1 };
  const newStudentData = { ...studentData };

  Object.keys(studentData).forEach((key) => {
    const semMatch = key.match(/_(\d+)$/);
    if (semMatch) {
      const sem = parseInt(semMatch[1], 10);
      if (sem < range.start || sem > range.end) {
        delete newStudentData[key];
      }
    }
  });

  setStudentData(newStudentData);
}, [studentData.hsc_group]);

  return (
    <div className="collegewholediv">
      <div id="appln_no" style={{ fontSize: "20px", gap: "30px" }}>
        <Inputfield
          name={"appln_no"}
          label={"Application Number"}
          type={"text"}
          placeholder={"Application Number"}
          onChange={handleChange}
          value={appln_no}
          disabled={true}
        />
      </div>

      <div id="category" style={{ gap: "50px" }}>
        <CategorySection
          studentData={studentData}
          handleChange={handleChange}
          error={error}
          clicked={clicked}
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
              error={error["name"]}
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
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Others", value: "Others" },
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
              error={error["aadharno"]}
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
                { label: "Indian", value: "Indian" },
                { label: "Srilankan Refugee", value: "SRILANKAN_REFUGEE" },
                { label: "Others", value: "Others" },
              ]}
              id={"Nationality"}
              htmlfor={"Nationality"}
              value={studentData.nationality}
              error={error["nationality"]}
            />
            <Inputfield
              eltname={"nativity"}
              type={"radio"}
              radiolabel={"Nativity :"}
              onChange={handleChange}
              options={[
                { label: "Tamilnadu", value: "Tamilnadu" },
                { label: "Others", value: "Others" },
              ]}
              classname={"field-block"}
              id={"Nativity"}
              htmlfor={"Nativity"}
              value={studentData.nativity}
              error={error["nativity"]}
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
                { label: "Others", value: "Others" },
              ]}
              value={studentData.religion}
              error={error["religion"]}
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
                options={[
                  { label: "OC", key: "OC", value: "OC" },
                  { label: "BCM", key: "BCM", value: "BCM" },
                ]}
                onChange={handleChange}
                value={studentData.community}
                error={error["community"]}
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
              error={error["caste_name"]}
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
              error={error["parent_occupation"]}
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
              error={error.hsc_tn}
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
                { label: "Diploma", key: "Diploma", value: "DIP" },
                { label: "BSc", key: "BSC", value: "Bsc" },
                { label: "Others", key: "OTHERS", value: "OTHERS" },
              ]}
              id={"QualifyingExam"}
              value={studentData.qualifying_exam}
              htmlfor={"QualifyingExam"}
              onChange={handleChange}
              error={error.qualifying_exam}
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
              error={error.year_of_passing}
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
              error={error.univ_reg_no}
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
                // { label: "UIT", key: "UIT", value: "UIT" },
                // { label: "UIO", key: "UIO", value: "UIO" },
                { label: "Others", key: "Others", value: "others" },
              ]}
              value={studentData.name_of_board}
              onChange={handleChange}
              error={error.name_of_board}
            />
          </div>
          <div className="field-row">
            <Inputfield
              eltname={"hsc_group"}
              type={"radio"}
              // id="course_type"
              // value={studentData.course_type}
              // htmlfor="course_type"
              radiolabel={"Course Type"}
              classname={"field-block"}
              // onChange={handleChange}
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
                {
                  label: "Sandwich (Lateral 7 Semesters)",
                  key: "Sandwich (7 Semesters)_lat",
                  value: "DIP-Sandwich_7_lat",
                },
                {
                  label: "Sandwich (Lateral 8 Semesters)",
                  key: "Sandwich (8 Semesters)_lat",
                  value: "DIP-Sandwich_8_lat",
                },
                { label: "BSc", key: "BSC", value: "Bsc" },
              ]}
              id={"QualifyingExam"}
              value={studentData.hsc_group}
              htmlfor={"QualifyingExam"}
              onChange={handleChange}
              error={error.hsc_group}
            />
          </div>
          <div>
            <Inputfield
              eltname="maths_studied"
              type="radio"
              radiolabel="Maths Studied in 12th or Degree Level"
              classname="field-block"
              options={[
                { label: "Yes", value: "1" },
                { label: "No", value: "0" },
              ]}
              id="mathsstudied"
              htmlfor="mathsstudied"
              value={studentData.maths_studied}
              onChange={handleChange}
              error={error["mathsstudied"]}
              disabled={[
                "DIP-Regular",
                "DIP-Lateral",
                "DIP-Part_time",
                "DIP-Sandwich_7",
                "DIP-Sandwich_8",
                "DIP-Sandwich_7_lat",
                "DIP-Sandwich_8_lat",
              ].includes(studentData.hsc_group)}
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
              error={error.annual_income}
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
              error={error.fg}
            />
          </div>
          {/* <div className="field-row">
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
              error={error.aicte_tfw}
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
              error={error.pms}
            />
          </div> */}
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
              disabled={studentData.fg === 0}
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
              disabled={studentData.fg === 0}
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
              disabled={studentData.fg === 0}
            />
          </div>
        </fieldset>
        <fieldset className="collegefieldset">
          <legend className="collegelegend">MARK DETAILS</legend>
          {/* <h3
            style={{
              display: "inline-block",
              marginLeft: "20px",
              marginBottom: "10px",
            }}
          >
            MAXIMUM MARKS
          </h3>
          <h3
            style={{
              display: "inline-block",
              marginLeft: "420px",
              marginBottom: "10px",
            }}
          >
            OBTAINED MARKS
          </h3> */}
          {/* {studentData.hsc_group=='Regular'(
            
          )} */}
          <h3 style={{ display: "inline-block", marginLeft: "20px",marginBottom:"10px" }}>MAXIMUM MARKS</h3>
          <h3 style={{ display: "inline-block", marginLeft: "420px",marginBottom:"10px" }}>OBTAINED MARKS</h3>
          <div className="field-container">
            {(() => {
              const range = semesterRange[studentData.hsc_group] || {
                start: 0,
                end: -1,
              };

              const semesters = Array.from(
                { length: range.end - range.start + 1 },
                (_, i) => range.start + i
              );
              
              const allInputs = semesters.flatMap((sem) => [
                <Inputfield
                  key={`max_${sem}`}
                  eltname={`max_${sem}`}
                  placeholder={"Maximum Marks"}
                  type={"text"}
                  label={`SEMESTER ${sem}`}
                  classname={"field-block"}
                  id={`sem${sem}max`}
                  htmlfor={`sem${sem}max`}
                  value={studentData[`max_${sem}`]}
                  onChange={handleChange}
                  error={error[`sem${sem}max`]}
                />,
                <Inputfield
                  key={`obt_${sem}`}
                  eltname={`obt_${sem}`}
                  placeholder={"Obtained Marks"}
                  type={"text"}
                  label={`SEMESTER ${sem}`}
                  classname={"field-block"}
                  id={`sem${sem}obt`}
                  htmlfor={`sem${sem}obt`}
                  value={studentData[`obt_${sem}`]}
                  onChange={handleChange}
                  error={error[`sem${sem}obt`]}
                />,
              ]);

              const groupedRows = [];
              for (let i = 0; i < allInputs.length; i += 2) {
                groupedRows.push(
                  <div className="field-row" key={i}>
                    {allInputs[i]}
                    {allInputs[i + 1]}
                  </div>
                );
              }

              return groupedRows;
            })()}
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
                <label>{cert.name} (size-limit: 300kb)</label>
                {cert.uploaded ? (
                  <div className="viewdelbuttonupload">
                    <p className="status">File uploaded successfully</p>
                    <button
                      className="view"
                      type="button"
                      onClick={() =>
                        window.open(`${host}${cert.fileUrl}`, "_blank")
                      }
                    >
                      View
                    </button>
                    <button
                      className="remove"
                      type="button"
                      onClick={() => handleDelete(cert.key)}
                    >
                      Remove
                    </button>
                    <input
                      id={`file-input-${cert.key}`}
                      style={{ color: "blue" }}
                      type="file"
                      name="files"
                      disabled
                      onChange={(e) => handleFileChange(e, cert.key)}
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
                      id={`file-input-${cert.key}`}
                      type="file"
                      name="files"
                      onChange={(e) => handleFileChange(e, cert.key)}
                    />
                    <br></br>
                    {error["files"] && (
                      <span className="error-message">{error["files"]}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Alert
              type={alertType}
              message={alertMessage}
              show={showAlert}
              okbutton={alertOkAction}
              cancelbutton={alertStage === "confirm" ? handlecloseAlert : null}
            />
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
              {error["remarks"] && (
                <p className="error-message">{error["remarks"]}</p>
              )}
            </fieldset>
          </div>
          {clicked === 2 ? (
            <div id="studentbutton">
              <Button name={"ADD"} onClick={handleAddStudent} />
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
            <div id="studentbutton">
              <Button name={"UPDATE"} onClick={handleUpdate} />
              <Button name={"DELETE"} onClick={handleStuDelete} />
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
          )}
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ studentData, handleChange, error, clicked }) => {
  // // console.log(clicked);

  const options =
    clicked !== 2
      ? [
          { label: "GOVERNMENT", value: "GOVERNMENT" },
          { label: "MANAGEMENT", value: "MANAGEMENT" },
          { label: "LAP", value: "LAP" },
          { label: "MIN", value: "MIN" },
          { label: "GOI", value: "GOI" },
          { label: "FOR", value: "FOR" },
          { label: "NRI", value: "NRI" },
        ]
      : [
          { label: "MANAGEMENT", value: "MANAGEMENT" },
          { label: "LAP", value: "LAP" },
          { label: "MIN", value: "MIN" },
          { label: "GOI", value: "GOI" },
          { label: "FOR", value: "FOR" },
          { label: "NRI", value: "NRI" },
        ];

  return (
    <Inputfield
      label={"CATEGORY"}
      id={"CATEGORY"}
      eltname={"catogory"}
      type={"dropdown"}
      htmlfor={"CATEGORY"}
      options={options}
      value={studentData.catogory}
      onChange={handleChange}
      error={error["CATEGORY"]}
    />
  );
};

export default Addstudent;