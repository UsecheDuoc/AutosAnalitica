import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import config from "../../config";
import { fetchWithFallback } from "../../utils/api";

const GraficoCategorias = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchCategorias = async () => {
    const timeout = 10000; // Tiempo de espera en milisegundos (10 segundos)

    try {
        const categorias = await fetchWithFallback("/grafico/ultimo");
        if (categorias.conteo_categorias) {
          const formattedData = Object.entries(categorias.conteo_categorias).map(([name, value]) => ({
            name,
            value,
          }));
          setData(formattedData);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.error("Solicitud cancelada:", error.message);
        } else if (error.code === "ECONNABORTED") {
          console.error("Error: Tiempo de espera agotado.");
          setData([{ name: "Error", value: "Tiempo de espera agotado." }]); // Mostrar mensaje en el gráfico
        } else {
          console.error("Error al obtener los datos de categorías:", error);
          setData([{ name: "Error", value: "Error al obtener los datos." }]); // Mostrar mensaje en el gráfico
        }
      }
  
      // Cancelar solicitud si el componente se desmonta
      //return () => source.cancel("Operación cancelada por el usuario.");
    };
  
    fetchCategorias();
  }, []);
  
  return (
    <div className="flex justify-center items-center flex-col w-full">
      {data.length > 0 ? (
        <>
        {/* Gráfico de barras */}
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

          {/* Texto debajo del gráfico */}
          <p className="text-gray-600 text-center mt-4">
            Este gráfico muestra la distribución de productos por empresa de procedencia.

          
          </p>
        </>

      ) : (
        <p>Cargando categorías...</p>
      )}
    </div>
  );
};

export default GraficoCategorias;
