import "./modal.css";
import { useEffect, useState } from "react";

const Modal = ({ show, onClose, children, customWidth, customHeigh, zIndex}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (show) {
      setShowModal(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setShowModal(false);
      }, 300);
    }
  }, [show]);

  if (!showModal) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isVisible ? "show" : ""}`}>
      <div
        className={`modal ${isVisible ? "show" : ""}`}
        style={{
          maxWidth: customWidth || "500px",
          maxHeight: customHeigh || "auto",
          zIndex: zIndex || "auto",
        }}
      >
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
