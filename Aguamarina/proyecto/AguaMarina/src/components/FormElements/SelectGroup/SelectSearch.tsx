import Select from "react-select";
import { useState, useEffect } from "react";

interface Option {
  id: number;
  name: string;
}

interface CustomSelectProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  customClasses?: string;
  required?: boolean;
  value?: number | string; // Asumimos que el valor seleccionado es un número
  opciones: Option[];
  onChange?: (selectedOption: { value: number; label: string } | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  label,
  placeholder,
  customClasses = "",
  required = false,
  value,
  opciones,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<{ value: number; label: string } | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      const selected = opciones.find((opc) => opc.id === value);
      setSelectedOption(selected ? { value: selected.id, label: `${selected.id} - ${selected.name}` } : null);
    }
  }, [value, opciones]);

  const handleChange = (option: { value: number; label: string } | null) => {
    setSelectedOption(option);
    if (onChange) onChange(option);
  };

  const options = opciones.map((opc) => ({
    value: opc.id,
    label: `${opc.id} - ${opc.name}`,
  }));

  return (
    <div className={`custom-select-container ${customClasses}`}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <Select
        inputId={id}
        name={name}
        value={selectedOption}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable={true}
        classNamePrefix="react-select"
        required={required}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "7px",
            borderColor: "#d1d5db",
            "&:hover": { borderColor: "#3b82f6" },
            boxShadow: "none",
          }),
        }}
      />
    </div>
  );
};

export default CustomSelect;
