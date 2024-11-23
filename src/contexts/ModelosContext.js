import React, { createContext, useState } from 'react';

// Crear el contexto
export const ModelosContext = createContext();

// Crear el proveedor del contexto
export const ModelosProvider = ({ children }) => {
    const [modelosDisponibles, setModelosDisponibles] = useState([]); // Inicialización segura

    return (
        <ModelosContext.Provider value={{ modelosDisponibles, setModelosDisponibles }}>
            {children}
        </ModelosContext.Provider>
    );
};