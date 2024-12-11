import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { Spanish } from "flatpickr/dist/l10n/es.js";

interface DataPickerProps {
  id?: string;
  name?: string;
  customClasses?: string;
  label?: string;
  value?: string;
  required?: boolean;
  onChange?: (date: Date) => void; // Modificamos el tipo
}

const DatePickerOne: React.FC<DataPickerProps> = ({
  id,
  name,
  customClasses,
  label = "Label por Defecto",
  required,
  value,
  onChange
}) => {
  const datepickerRef = useRef<HTMLInputElement>(null); // Usamos un ref para el input

  useEffect(() => {
    if (datepickerRef.current) {
      flatpickr(datepickerRef.current, {
        mode: "single",
        position: "below right",
        static: false,
        monthSelectorType: "static",
        locale: Spanish,
        dateFormat: "d-m-Y",
        defaultDate: value, // Establecemos la fecha inicial
        onChange: (selectedDates) => {
          if (onChange) {
            onChange(selectedDates[0]); // Llamamos a onChange con la fecha seleccionada
          }
        },
        prevArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      });
    }
  }, [value, onChange]);

  return (
    <div className={customClasses}>
      <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
        {label}:
        {required && <span className="text-red">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          ref={datepickerRef} // Asignamos el ref al input
          className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="dd/mm/yyyy"
          required={required}
          readOnly // Evitamos que el usuario modifique el valor manualmente
        />
      </div>
    </div>
  );
};

export default DatePickerOne;
