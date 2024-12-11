"use client";
import React from "react";
import { HashLoader } from "react-spinners";
import { LengthType } from "react-spinners/helpers/props";

const LoaderCustomSize: React.FC<{ customSize: LengthType, mostrar: boolean }> = ({ customSize, mostrar = false }) => {
    return (
        mostrar && (
            <div id="personalizable" className="flex justify-center align-middle items-center p-3">
            <HashLoader id="personalizable" color="#5750f1" size={customSize} speedMultiplier={1.8} />
        </div>
        )
        
    );
};

export default LoaderCustomSize;