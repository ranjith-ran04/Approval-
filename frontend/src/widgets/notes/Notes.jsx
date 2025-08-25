import "./notes.css";
import { useEffect, useState } from "react";

function Notes() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // First login — open only once per session
    const firstVisit = sessionStorage.getItem("notesShown");
    if (!firstVisit) {
      setIsOpen(true);
      sessionStorage.setItem("notesShown", "true");
    }
  }, []);

  const toggleOpen = (e) => {
    e.stopPropagation(); // Prevent bubbling to parent div
    setIsOpen(!isOpen);
  };

  return (
    <div id="notes-container" className={isOpen ? "open" : ""}>
      <div id="notes-icon" onClick={toggleOpen}>
        📝
      </div>

      {isOpen && (
        <div id="content">
          <button id="close-button" onClick={() => setIsOpen(false)}>
            ×
          </button>
          <div id="para">
            <p>• Check the College details and modify the required fields.</p>
            <p>
              • All allotted students details will get displayed after adding
              respective branches only.
            </p>
            <p>• Add Branch details first and then add student details.</p>
            <p>
              • If any of the students has not joined, remove that name using
              delete option.
            </p>

            <p>
              • In Student details,{" "}
              <span style={{ color: "#32CD32" }}>Green colour field</span> denotes
              the students with complete details and{" "}
              <span style={{ color: "yellow" }}>yellow colour field</span>{" "}
              denotes the students with incomplete details.
            </p>

            <p>
              • For Management students' Register number (Create your own
              11-digit number), Fill the Application number in valid format:
              <br />
              (First 4 digits → your college code, next 2 digits → your branch
              code, next 2 digits → 24 (Year), last 3 digits → unique number).
              <br />
              <b>Eg:</b> 5901CS24001
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
