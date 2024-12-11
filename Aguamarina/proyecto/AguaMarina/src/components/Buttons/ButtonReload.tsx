"use client"
import React from "react";

interface ButtonPropTypes {
    customClasses?: string;
    onClick?: any;
}

const ButtonReload = ({
    customClasses,
    onClick = () => {console.log("Click")},
}: ButtonPropTypes) => {
  return (
    <>
      <a
        className={`text-center font-medium hover:bg-opacity-70 hover:scale-125 duration-300 cursor-pointer text-xl border border-primary dark:bg-primary hover:text-white hover:bg-primary text-primary rounded-full ${customClasses}`}
        onClick={onClick}
      >
            <div className="p-3 hover:rotate-90 duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M21.962,12.875A10.03,10.03,0,1,1,19.122,5H16a1,1,0,0,0-1,1h0a1,1,0,0,0,1,1h4.143A1.858,1.858,0,0,0,22,5.143V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V3.078A11.985,11.985,0,1,0,23.95,13.1a1.007,1.007,0,0,0-1-1.1h0A.982.982,0,0,0,21.962,12.875Z"/>
                </svg>
            </div>
      </a>
    </>
  );
};

export default ButtonReload;
