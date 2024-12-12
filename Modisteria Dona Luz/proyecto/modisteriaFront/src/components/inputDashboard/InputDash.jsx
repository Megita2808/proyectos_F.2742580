import { forwardRef } from "react";
import "./inputDash.css";

const InputDash = forwardRef(
  (
    {
      label,
      description,
      initialValue,
      type,
      width,
      allowDecimal,
      descriptionColor,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <div className="input-groupDash">
          <label className="labelDash">{label}</label>
          <input
            autoComplete="off"
            className="inputDash"
            step={allowDecimal && "0.01"}
            defaultValue={initialValue && initialValue}
            type={type}
            style={{ width: width || "535px" }}
            ref={ref}
            {...props}
          />
          <div></div>
        </div>
        <span
          className="descripcionDash"
          style={{ color: descriptionColor || "rgb(250, 24, 24)" }}
        >
          {description}
        </span>
      </>
    );
  }
);

export default InputDash;
