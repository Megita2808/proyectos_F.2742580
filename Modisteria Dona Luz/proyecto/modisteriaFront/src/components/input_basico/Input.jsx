import "./input.css";
import { forwardRef, useState } from "react";
import ojoAbierto from "/ojoAbierto.png";
import ojoCerrado from "/ojoCerrado.png";

// eslint-disable-next-line react/display-name
const Input = forwardRef(
  (
    {
      type,
      placeholder,
      description,
      error,
      canHidden,
      width,
      color,
      onlyRead,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="input-group">
        <label className="label" htmlFor="">
          {placeholder}
        </label>
        <div className="input-container" style={{ width: width || "200px" }}>
          <input
            type={canHidden ? (showPassword ? "text" : "password") : type}
            className={`input ${error ? "active" : ""}`}
            ref={ref}
            defaultValue={defaultValue}
            readOnly={onlyRead}
            style={{ paddingRight: canHidden ? "30px" : "1rem" }}
            {...props}
          />
          {canHidden && (
            <img
              src={showPassword ? ojoAbierto : ojoCerrado}
              alt="Ver contraseña"
              className="verPass"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
        <span style={{ color: color }} className="descripcion">
          {description}
        </span>
      </div>
    );
  }
);

export default Input;
