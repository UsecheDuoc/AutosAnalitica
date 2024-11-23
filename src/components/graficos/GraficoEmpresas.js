import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend,BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import config from "../../config";
import { fetchWithFallback } from "../../utils/api"; // Usa el fetch con fallback

const GraficoEmpresas = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

   // Leyenda del identificador por empresa
   const empresaMapping = {
    "0": "BolomeYVentas",
    "1": "RepuestosCoroca",
    "2": "RepuestosCyR",
    "3": "RepuestosMaracars",
  };

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/grafico/empresas`);
        const { conteo_empresas, mapeo_empresa } = response.data;

        // Procesar los datos para el gráfico
        const formattedData = Object.entries(conteo_empresas).map(([key, value]) => ({
          empresa: empresaMapping[mapeo_empresa[key]] || "Desconocido",
          cantidad: value,
        }));

        setData(formattedData);
      } catch (err) {
        console.error("Error al obtener datos de empresas:", err);
        setError("No se pudo cargar el gráfico de empresas.");
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <div className="flex justify-center items-center flex-col w-full">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <XAxis dataKey="empresa" angle={-45} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default GraficoEmpresas;
