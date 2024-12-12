import { useEffect, useState } from "react";
import "./otp.css";
export default function OTP({ numInputs, onChange }) {
  const [otp, setOTP] = useState(Array(numInputs).fill(""));
  useEffect(() => {}, []);
  useEffect(() => {
    if (!onChange) return;
    onChange(otp);
  }, [otp, onChange]);
  const handleOnKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx] !== "") {
        const deleteLastDigit = [...otp];
        deleteLastDigit[idx] = "";
        setOTP(deleteLastDigit);
      } else if (idx > 0) {
        e.target.previousElementSibling.focus();
      }
    }
    if (e.key === "Enter") e.target.nextSibling.focus();
  };
  const handleChange = (e, idx) => {
    if (isNaN(e.target.value)) return;
    setOTP((prevState) => {
      const newArray = [...prevState];
      newArray[idx] = e.target.value;
      return newArray;
    });
    if (e.target.value) e.target.nextSibling.focus();
  };

  return (
    <>
      {otp.map((value, idx) => (
        <input
          maxLength={1}
          onChange={(e) => {
            handleChange(e, idx);
          }}
          className="otp-input"
          key={idx}
          value={value}
          onKeyDown={(e) => {
            handleOnKeyDown(e, idx);
          }}
        />
      ))}
    </>
  );
}
