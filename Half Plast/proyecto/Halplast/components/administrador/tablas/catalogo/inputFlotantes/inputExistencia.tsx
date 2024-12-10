import { useState } from "react";
import { Info  } from "lucide-react";
interface InfoPopoverProps {
  existencias: number;
  equivalencia: string;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({ existencias, equivalencia }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center h-full" style={{textAlign:'center'}}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="hover:text-blue-500"
        aria-label="Mostrar información"
      >
        <Info className="h-7 w-7" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 p-4 bg-white border shadow-lg rounded-lg top-full left-1/2 transform -translate-x-1/2 mt-2 max-w-[400px]">
          <h4 className="font-bold mb-2">Detalles</h4>
          <div style={{ minWidth:'185px' }}>
            <p style={{display:'inline-block'}}><strong>Existencias:</strong> {existencias} </p>
            <br />
            <p style={{display:'inline-block'}}><strong>Equivalencia:</strong> {equivalencia}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPopover;
