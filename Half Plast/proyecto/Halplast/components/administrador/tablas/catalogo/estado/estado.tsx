import React, { useState } from "react";
import CambiarEstado from '@/service/api/estadoFuncionGlobal/editarEstadoGlobal';
import Swal from 'sweetalert2';
import { Switch } from "@mui/material";

interface StatusLabelProps {
  isEnabled: boolean;
  id: string;
  modulo: string;
  onStatusChange?: (response: any) => void;
  disabled: boolean;
}

const StatusBoton: React.FC<StatusLabelProps> = ({ isEnabled, id, modulo, onStatusChange, disabled }) => {

  const [isChecked, setIsChecked] = useState(isEnabled);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsAnimating(true);

    const response = await cambiarEstado(newValue, id);

    if (onStatusChange) {
      onStatusChange(response);
    }
    if (response != null) {
      setIsChecked(newValue);

      Swal.fire({
        title: '¡Éxito!',
        text: `Estado actualizado correctamente.`,
        icon: 'success',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });

    } else {
      setIsChecked(!newValue);
      Swal.fire({
        title: '¡Error!',
        text: '¡Cambio de estado fallido!',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setIsAnimating(false);
  };

  const cambiarEstado = async (value: boolean, id: string) => {
    try {
      const response = await CambiarEstado(value, id, modulo); 
      if (response == null) {
        return null;
      }
      return response;
    } catch (error) {
      Swal.fire({
        title: '¡Error!',
        text: '¡Error en la solicitud!',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      return null;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
      <Switch
        checked={isChecked}
        onChange={handleChange}
        className={`switch-animation ${isChecked ? 'switch-checked' : 'switch-unchecked'} ${isAnimating ? 'switch-animation' : ''}`}
        disabled={disabled}
      />
      <span className={`status-label ${isChecked ? 'enabled' : 'disabled'}`}>
        {isChecked ? 'Habilitado' : 'Inhabilitado'}
      </span>
    </div>
  );
};

export default StatusBoton;
