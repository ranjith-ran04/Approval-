import "../../components/college/CollegeInfo.css";

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
  onChange,
  disabled,
  value,
  placeholder,
}) => {
  const handleChange = onChange;
  // console.log(value, eltname);
  // console.log();
  // console.log(typeof onChange);
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
                disabled={disabled}
                value={option.value}
                {...(value !== undefined
                  ? { checked: value === option.value }
                  : {})}
                {...(onChange
                  ? { onChange: handleChange }
                  : value !== undefined
                  ? { readOnly: true }
                  : {})}
                // checked={value === option.value}
                // onChange={(e)=>onChange(e)}
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
            disabled={disabled}
            placeholder={placeholder}
            {...(onChange
              ? {
                  value: value !== undefined ? value : "",
                  onChange: handleChange,
                }
              : { defaultValue: value !== undefined ? value : "" })}
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
            disabled={disabled}
            {...(onChange
              ? {
                  value: value !== undefined ? value : "",
                  onChange: handleChange,
                }
              : { defaultValue: value !== undefined ? value : "" })}
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
