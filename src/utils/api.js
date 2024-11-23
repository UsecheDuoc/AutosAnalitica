// src/utils/api.js
import axios from "axios";
import config from "../config";

// Función para limpiar URLs y evitar duplicación de slashes
const cleanURL = (base, path) => {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const fetchWithFallback = async (endpoint) => {
  const alternativeUrl =
    config.apiBaseUrl === "http://localhost:3000"
      ? "https://api-autoanalitica.onrender.com"
      : "http://localhost:3000";
      
      const primaryUrl = cleanURL(config.apiBaseUrl, endpoint);
      const fallbackUrl = cleanURL(alternativeUrl, endpoint);


  try {
    console.log(`Intentando con la URL principal: ${primaryUrl}`);

    const response = await axios.get(primaryUrl, { timeout: 2000 }); // Agregar tiempo de espera de 5 segundos

    // Si el estado es 304, intentamos con la alternativa
    if (response.status === 304) {
      console.warn(`Código de estado 304 detectado. Probando con la URL alternativa: ${alternativeUrl}`);
      const alternativeResponse = await axios.get(`${alternativeUrl}${endpoint}`, { timeout: 5000 });
      return alternativeResponse.data;
    }
    
    return response.data;

  } catch (error) {
    console.error(`Error con la URL principal (${primaryUrl}), intentando la alternativa...`, error);

    // Si falla, intenta con la URL alternativa
    try {
      console.log(`Intentando con la URL alternativa: ${alternativeUrl}`);

      const alternativeResponse = await axios.get(`${alternativeUrl}${endpoint}`, { timeout: 5000 }); // Tiempo de espera de 5 segundos
      return alternativeResponse.data;
    } catch (altError) {
      console.error("Error con ambas URLs:", altError);
      throw new Error("Ambas URLs fallaron.");
    }
  }
};
