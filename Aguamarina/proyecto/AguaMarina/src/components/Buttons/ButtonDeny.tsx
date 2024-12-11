import React from 'react';

const ButtonDeny: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <button className="flex items-center justify-center w-24 h-10 rounded-full border border-white/40 bg-gray-900 cursor-pointer transition-all duration-300 overflow-hidden hover:scale-95 active:scale-90 group">
        <span className="flex items-center justify-center w-7 h-7 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full transition-all duration-300 group-hover:w-24">
          <svg viewBox="0 0 384 512" height="0.9em" className="text-white">
            <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
          </svg>
        </span>
        <p className="ml-2 text-white transition-all duration-300 group-hover:opacity-0 group-hover:w-0">Save</p>
      </button>
    </div>
  );
};

export default ButtonDeny;
