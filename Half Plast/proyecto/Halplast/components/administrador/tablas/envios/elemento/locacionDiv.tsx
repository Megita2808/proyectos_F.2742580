import React, { useState, useEffect, useRef } from 'react';

export const LocacionCell = ({ value }: { value: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const cellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    setPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });

    setIsOpen(true);
  };

  const formatearDireccion = (direccion: string) => {
    const partes = direccion.split(' ');
    const direccionFinal = partes.slice(2).join(' ');
    return direccionFinal
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ cursor: 'pointer' }} onClick={handleClick}>
        {formatearDireccion(value).length > 40 ? formatearDireccion(value).substring(0, 40) + '...' : formatearDireccion(value)}
      </div>

      {isOpen && (
        <div
          ref={cellRef}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            zIndex: 1000,
            top: position.top - 40,
            left: position.left - 100,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px',
            whiteSpace: 'normal',
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};