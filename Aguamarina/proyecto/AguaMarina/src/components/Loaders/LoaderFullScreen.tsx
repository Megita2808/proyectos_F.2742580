"use client";
import React from "react";
import { HashLoader } from "react-spinners";

const LoaderFullScreen: React.FC = () => {
    return (
        <div style={styles.container}>
            <HashLoader color="#5750f1" size={120} speedMultiplier={1.8} />
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed' as 'fixed', // Fijar el contenedor a la pantalla
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex' as 'flex',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
    }
};

export default LoaderFullScreen;
