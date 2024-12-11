"use client";
import React from "react";
import { HashLoader } from "react-spinners";

const LoaderDateProducts: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div style={{position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  zIndex: 10, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' }} className="bg-[#000000] bg-opacity-10 h-max shadow-lg w-full min-h-[200px] rounded-xl flex items-center justify-center">
                <HashLoader color="#5750f1" size={80} speedMultiplier={1.8}/>
            </div>
        </div>
    );
};

export default LoaderDateProducts;