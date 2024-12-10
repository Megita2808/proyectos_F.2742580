import React, { useState } from "react";
import { motion } from "framer-motion";

const Estados = Object.freeze({
  INHABILITADO: "INHABILITADO",
  HABILITADO: "HABILITADO",
  SOLICITANTE: "SOLICITANTE",
  TRAMITADO: "TRAMITADO",
  ESPERA: "ESPERA"
});

const estadoColores: { [key: string]: string } = {
  INHABILITADO: "bg-red-400",
  HABILITADO: "bg-green-400",
  SOLICITANTE: "bg-yellow-400",
  TRAMITADO: "bg-blue-400",
  ESPERA: "bg-orange-400"
};

interface EstadoInputProps {
  initialEstado: string;
  onChange: (estado: string) => void;
}

const EstadoInput: React.FC<EstadoInputProps> = ({ initialEstado, onChange }) => {
  const [selectedEstado, setSelectedEstado] = useState<string>(initialEstado);
  const [animating, setAnimating] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleChange = (estado: string) => {
    setAnimating(true);
    setSelectedEstado(estado);
    onChange(estado);
    setTimeout(() => {
      setAnimating(false);
      setShowOptions(false);
    }, 300);
  };

  return (
    <div className={`relative ${estadoColores[selectedEstado]} rounded-md p-2`} style={{margin:'0 auto', width:'90%'}}>
      <div
        className="cursor-pointer text-white text-lg"
        onClick={() => setShowOptions(!showOptions)}
      >
        {selectedEstado}
      </div>

      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10"
        >
          {Object.values(Estados).map((estado) => (
            <button
              key={estado}
              onClick={() => handleChange(estado)}
              className={`w-full text-left p-2 rounded-md hover:bg-gray-200 transition-colors ${estado === selectedEstado ? 'font-bold' : ''}`}
              style={{ color: 'black', alignItems:'center'}}
            >
              {estado}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EstadoInput;
