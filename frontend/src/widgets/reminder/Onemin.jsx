import React, { useEffect, useState } from "react";
import "./onemin.css"; // ✅ import CSS

const Onemin = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Your session will expire soon!</h2>
        <p>
          Remaining time: {minutes} minute{minutes !== 1 ? "s" : ""}{" "}
          {seconds.toString().padStart(2, "0")} seconds
        </p>
        <button className="extend-btn">Extend Session</button>
      </div>
    </div>
  );
};

export default Onemin;
