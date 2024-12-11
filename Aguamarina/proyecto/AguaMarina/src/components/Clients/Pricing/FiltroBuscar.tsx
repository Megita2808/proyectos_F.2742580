import React from 'react';

interface FiltroBuscarProps {
  onSearch: (term: string) => void;
}

const FiltroBuscar: React.FC<FiltroBuscarProps> = ({ onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="relative">
      <input
        placeholder="¿Que deseas buscar?"
        className="input rounded-xl border-gray-300 px-5 dark:bg-dark-4 py-3 shadow-lg transition-all w-64 focus:border-[#5750f1]"
        name="search"
        type="search"
        onChange={handleInputChange}
      />
      <style jsx global>{`
  input[type="search"]::-webkit-search-cancel-button {
    display: none;
  }
  input[type="search"]::-moz-search-cancel-button {
    display: none;
  }
  input::placeholder {
    color: #d1d5db;
  }
  input::-ms-input-placeholder { /* Para navegadores antiguos como IE */
    color: #d1d5db;
  }
`}</style>
    </div>
  );
};

export default FiltroBuscar;

