import React, { useEffect, useState } from "react";
import "./onemin.css";

const Onemin = ({ handleLogOut,admin }) => {
  const [timeLeft, setTimeLeft] = useState(180);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) return;

    const updateActivity = () => {
      sessionStorage.setItem("lastActive", Date.now());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    updateActivity();

    const interval = setInterval(() => {
      const lastActive = parseInt(sessionStorage.getItem("lastActive"), 10);
      const now = Date.now();

      if (now - lastActive > 300000) {
        setShowModal(true);
        setTimeLeft(180);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;

    if (timeLeft <= 0) {
      sessionStorage.removeItem("lastActive");
      setShowModal(false);
      handleLogOut?.(admin);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showModal, timeLeft, handleLogOut]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const extendSession = () => {
    sessionStorage.setItem("lastActive", Date.now());
    setShowModal(false);
    setTimeLeft(180);
  };

  return (
    <>
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h2>Your session will expire soon!</h2>
            <p>
              Remaining time: {minutes}m {seconds.toString().padStart(2, "0")}s
            </p>
            <button className="extend-btn" onClick={extendSession}>
              Extend Session
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Onemin;
