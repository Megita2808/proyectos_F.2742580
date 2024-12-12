import { forwardRef } from "react";
import "./selectDash.css";

const SelectDash = forwardRef(
  (
    { label, width, description, descriptionColor, children, ...props },
    ref
  ) => {
    return (
      <>
        <div className="select-groupDash">
          <label className="labelSelectDash">{label}</label>
          <select
            ref={ref}
            className="selectDash"
            style={{ width: width || "535px" }}
            {...props}
          >
            {children}
          </select>
          <div></div>
        </div>
        <span
          className="descripcionSelectDash"
          style={{ color: descriptionColor || "rgb(250, 24, 24)" }}
        >
          {description}
        </span>
      </>
    );
  }
);

export default SelectDash;
