import '../../components/college/CollegeInfo.css';

const Inputfield = ({
  eltname,
  type,
  label,
  id,
  htmlfor,
  classname,
  radiolabel,
  options = [],
  error,
  onChange,        // prefer standard camelCase
  onchange,        // fallback if parent still uses lowercase
  disabled,
  value,
  placeholder,
}) => {
  const handleChange = onChange || onchange;

  if (type === "radio") {
    return (
      <div className={classname}>
        <div className="radio-group">
          <label>{radiolabel}</label>
          {options.map((option) => (
            <label key={option.value} id="collegelabel2">
              <input
                type="radio"
                name={eltname}
                value={option.value}
                onChange={handleChange}
                disabled={disabled}
                checked={value === option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  } else if (type === "text" || type === "date") {
    return (
      <div className={classname}>
        <div className="collegeinput">
          <label id="collegelabel" htmlFor={htmlfor}>
            {label}{" "}
          </label>
          <input
            type={type}
            id={id}
            name={eltname}
            onChange={handleChange}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
          />
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  } else if (type === "dropdown") {
    return (
      <div className={classname}>
        <div className="studentdropdown">
          <label id="collegelabel" htmlFor={htmlfor}>
            {label}
          </label>
          <select
            id={id}
            name={eltname}
            onChange={handleChange}
            value={value || ""}
            disabled={disabled}
          >
            <option value="">--- Select ---</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return null;
};

export default Inputfield;
