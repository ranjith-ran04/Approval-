import "./notes.css";
import { useState } from "react";

function Notes() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="notes-container"
      className={isOpen ? "open" : ""}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen && (
        <div id="content">
          <button id="close-button" onClick={() => setIsOpen(false)}>
            ×
          </button>
          <div id="para">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat...
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
