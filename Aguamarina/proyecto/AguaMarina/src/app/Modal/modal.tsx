import React, { useState, useRef, useEffect } from "react";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  data: { mail: string };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, data }) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart}@${domain}`;
    }
    const hiddenPart = "*".repeat(localPart.length - 3);
    return `${localPart.slice(0, 3)}${hiddenPart}@${domain}`;
  };

  useEffect(() => {
    if (isOpen) {
      setCode(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 6);
    const filteredData = pastedData.replace(/\D/g, "");

    const newCode = Array.from(filteredData).concat(
      Array(6 - filteredData.length).fill("")
    );
    setCode(newCode);

    inputRefs.current[newCode.length - 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      const response = await fetch(
        "https://api-aguamarina-mysql-v2.onrender.com/api/v2/verificationcodes_validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mail: data.mail,
            code: verificationCode,
          }),
        }
      );

      const responseJson = await response.json();

      console.log(responseJson);

      if (!responseJson.ok) {
        throw new Error("Error al verificar el código");
      }
      onSubmit(verificationCode);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al verificar el código. Inténtalo de nuevo.");
    }
  };

  const formattedEmail = data.mail ? formatEmail(data.mail) : "";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4 className="title">
          Ingresa el código de Verificación que enviamos al correo{" "}
          <span className="email">{formattedEmail}</span>
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="code-inputs" onPaste={handlePaste}>
            <span id="title" className="title">
              AG-
            </span>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                placeholder="0"
                pattern="\d*"
                ref={(el) => (inputRefs.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button type="submit" className="boton-modal">
            Enviar
          </button>
          <button type="button" className="boton-modal" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
