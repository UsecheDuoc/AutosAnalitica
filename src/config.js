const isProduction = process.env.NODE_ENV === "production";

const config = {
  apiBaseUrl: isProduction
      ? "https://api-autoanalitica.onrender.com" // Cambia esta URL según el entorno
      : "http://localhost:3000", // URL local
  };
  
  export default config;
  