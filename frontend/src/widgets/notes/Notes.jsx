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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
