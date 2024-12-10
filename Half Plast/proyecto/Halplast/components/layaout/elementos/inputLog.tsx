import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  nombreInput: string;
  tipoInput: string;
  nameInput: string;
  handleChangeCantidad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  valor: string | number;
  disabled?: boolean;
}

const Input: React.FC<Props> = ({
  nombreInput,
  tipoInput,
  nameInput,
  valor,
  handleChangeCantidad,
  disabled = false,
}) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    handleChangeCantidad(event);
  };

  return (
    <StyledWrapper>
      <div className="input-group">
        <input
          required
          type={tipoInput}
          name={nameInput}
          autoComplete="off"
          className={`input ${valor ? 'filled' : ''}`}
          onChange={handleChange}
          value={valor}
          disabled={disabled}
        />
        <label className={`user-label ${value ? 'filled' : ''}`}>{nombreInput}</label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-group {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .input {
    border: solid 1.5px #757575;
    border-radius: 1rem;
    background: none;
    padding: 15px;
    width: 100%;
    font-size: 1rem;
    color: #424242;
    transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .user-label {
    position: absolute;
    left: 15px;
    color: #757575;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input:focus, .input:valid {
    outline: none;
    border: 1.5px solid #1976d2;
  }

  .input.filled:focus, .input.filled:valid {
    border: 1.5px solid #1976d2;
  }

  .input:focus ~ .user-label, .input.filled ~ .user-label {
    transform: translateY(-50%) scale(0.8);
    background-color: #f4f4f4;
    padding: 0 .2em;
    color: #1976d2;
  }

  .user-label.filled {
    transform: translateY(-50%) scale(0.8);
    background-color: #f4f4f4;
    padding: 0 .2em;
    color: #1976d2;
  }
`;

export default Input;
