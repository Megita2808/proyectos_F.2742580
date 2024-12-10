import { useState } from 'react';
import Link from 'next/link';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleDropdown} className="text-gray-700 hover:text-gray-500 text-lg font-medium">
        Usuario
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md">
          <Link href="/cliente/login/cliente" legacyBehavior>
            <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Iniciar Sesión</a>
          </Link>
          <Link href="/cliente/registro/cliente" legacyBehavior>
            <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Registrarse</a>
          </Link>
          <Link href="/cliente/login/cliente" legacyBehavior>
            <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Distribuidor</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
