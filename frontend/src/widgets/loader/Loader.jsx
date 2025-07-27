import "./loader.css";

function Loader({ message = "Loading...", size = "medium" }) {
  return (
    <div className={`standard-loader-wrapper ${size}`}>
      <div className="spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
}

export default Loader;
