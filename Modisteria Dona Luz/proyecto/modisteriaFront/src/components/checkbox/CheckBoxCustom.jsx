import { forwardRef } from "react";
import "./checkobx.css";
const CheckboxCustom = forwardRef(
  ({ checked, permisoName, idPermiso, handlecheckbox, ...props }, ref) => {
    return (
      <div className="checkFlex">
        <label className="containerCheck">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            value={idPermiso}
            onClick={() => handlecheckbox(idPermiso)}
            {...props}
          />
          <div className="checkmark"></div>
        </label>

        <p className="checkboxText">{permisoName}</p>
      </div>
    );
  }
);
export default CheckboxCustom;
