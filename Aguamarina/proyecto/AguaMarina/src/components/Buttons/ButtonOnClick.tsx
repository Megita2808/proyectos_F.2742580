import { Button } from "antd";
import React from "react";

interface ButtonPropTypes {
  label?: string;
  customClasses?: string;
  onClick: any;
  children?: React.ReactNode;
}

const ButtonOnClick = ({
  label,
  customClasses,
  onClick = () => {console.log("Click")},
  children,
}: ButtonPropTypes) => {
  return (
    <>
      <a
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 hover:scale-110 cursor-pointer ${customClasses}`}
        onClick={onClick}
      >
        {children}
        {label}
      </a>
    </>
  );
};

export default ButtonOnClick;
