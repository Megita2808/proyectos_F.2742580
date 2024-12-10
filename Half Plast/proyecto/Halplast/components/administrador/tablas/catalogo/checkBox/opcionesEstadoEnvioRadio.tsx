import { FolderCog, FolderDot, Images, ImageUp } from 'lucide-react';
import React, { useState } from 'react';
import styled from 'styled-components';

interface InputProps {
    onChange?: (opcion: string) => void;
}
const Radio: React.FC<InputProps> =  ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState('seleccionar');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <StyledWrapper>
      <div className="radio-inputs">
        <label>
          <input 
            className="radio-input" 
            type="radio" 
            name="engine" 
            value="base"
            defaultChecked
            onChange={handleChange}
          />
          <span className="radio-tile">
            <span className="radio-icon">
                <FolderDot className="h-7 w-7" />
            </span>
            <span className="radio-label">Base</span>
          </span>
        </label>
        <label>
          <input 
            className="radio-input" 
            type="radio" 
            name="engine" 
            value="personalizar"
            onChange={handleChange}
          />
          <span className="radio-tile">
            <span className="radio-icon">
                <FolderCog className="h-7 w-7" />
            </span>
            <span className="radio-label">Personalizar</span>
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
}


const StyledWrapper = styled.div`
  .radio-inputs {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-inputs > * {
    margin: 6px;
  }

  .radio-input:checked + .radio-tile {
    border-color: #2260ff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    color: #2260ff;
  }

  .radio-input:checked + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
    background-color: #2260ff;
    border-color: #2260ff;
  }

  .radio-input:focus + .radio-tile {
    border-color: #2260ff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px #b5c9fc;
  }

  .radio-input:focus + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    min-height: 80px;
    border-radius: 0.5rem;
    border: 2px solid #b5bfd9;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s ease;
    cursor: pointer;
    position: relative;
  }

  .radio-tile:before {
    content: "";
    position: absolute;
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    border: 2px solid #b5bfd9;
    background-color: #fff;
    border-radius: 50%;
    top: 0.25rem;
    left: 0.25rem;
    opacity: 0;
    transform: scale(0);
    transition: 0.25s ease;
  }

  .radio-tile:hover {
    border-color: #2260ff;
  }

  .radio-tile:hover:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-icon icon {
    width: 2rem;
    height: 2rem;
    fill: #494949; /* Mantener el color original del ícono */
  }

  .radio-label {
    color: #707070;
    transition: 0.375s ease;
    text-align: center;
    font-size: 13px;
  }

  .radio-input {
    clip: rect(0 0 0 0);
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export default Radio;
