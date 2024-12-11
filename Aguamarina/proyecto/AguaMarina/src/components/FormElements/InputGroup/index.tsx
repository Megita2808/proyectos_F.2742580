import React from "react";

interface InputGroupProps {
  id? : string;
  name? : string;
  customClasses?: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean
}

const InputGroup: React.FC<InputGroupProps> = ({
  id,
  name,
  customClasses,
  label,
  type,
  placeholder,
  required,
  value,
  onChange,
  disabled
}) => {
  return (
    <>
      <div className={customClasses}>
        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
          {label}:
          {required && <span className="text-red">*</span>}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-[7px] border-[1.5px] text-base border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default InputGroup;
