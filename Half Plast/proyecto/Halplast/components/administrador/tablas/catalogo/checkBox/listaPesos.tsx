"use client";

import React, { useState } from 'react';

interface Peso {
  idPesoApi: string;
  PesoApi: number;
  idUnidadMedida: string; 
  simboloUnidadMedida: string;
}

interface PaginatedCheckboxGroupProps {
  datosPesoSelect: Peso[];
  selectedPesos: { valor: string; unidadMedida: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaginatedCheckboxGroup: React.FC<PaginatedCheckboxGroupProps> = ({ datosPesoSelect, selectedPesos, onChange }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(datosPesoSelect.length / itemsPerPage);

  const paginatedData = datosPesoSelect.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
        <label htmlFor="producto-select" className="LabelModal">Peso medida</label>
        <div id="peso-checkbox-group" className="checkboxGroup">
          {paginatedData.map((peso) => (
            <div key={peso.idPesoApi}>
              <input
                type="checkbox"
                id={peso.idPesoApi}
                value={peso.idPesoApi}
                checked={selectedPesos.some(selected => selected.valor === peso.idPesoApi)}
                onChange={onChange}
              />
              <label htmlFor={peso.idPesoApi}>
                {peso.PesoApi + " " + peso.simboloUnidadMedida}
              </label>
            </div>
          ))}
        </div>
        <div className="pagination-container">
            {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
            >
                {index + 1}
            </button>
            ))}
        </div>
    </div>
  );
};

export default PaginatedCheckboxGroup;
