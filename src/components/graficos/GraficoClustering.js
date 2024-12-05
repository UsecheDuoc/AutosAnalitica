import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Plot from "react-plotly.js";
import { fetchWithFallback } from "../../utils/api";

const GraficoClustering = () => {
  const [datos, setDatos] = useState([]);

  // Valores específicos para las marcas y categorías
  const marcasEspecificas = [2, 3, 4, 5, 6, 7, 8, 9 ]; // Valores de marcas del dataset
  const nombresMarcas = ["Chery", "Chevrolet", "Chrysler", "JAC", "Kia","Maxus","Nissan","Toyota"]; // Nombres de marcas
  const categoriasEspecificas = [10, 15, 20, 25, 30, 35, 40]; // Valores de categorías del dataset
  const nombresCategorias = ["Motores", "Cables", "Carroceria", "Correas","Luces", "Distribución","Espejos"]; // Nombres de categorías

  useEffect(() => {
    const fetchData = async () => {     
      try {
        const response = await fetchWithFallback("/grafico/metodo_codo");
        const data = response;

        console.log("Datos recibidos del servidor:", data);

        if (data && data.length > 0 && data[0].datos) {
          setDatos(data[0].datos); // Extrae los datos del primer objeto
          console.log("Datos procesados para el gráfico:", data[0].datos);
        } else {
          console.error("No se encontraron datos válidos.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Configuración del gráfico 3D
  const trace = {
    x: datos.map((d) => d.precio), // Eje X: Precio
    y: datos.map((d) => d.marca), // Eje Y: Marcas
    z: datos.map((d) => d.categoria), // Eje Z: Categorías
    mode: "markers",
    type: "scatter3d",
    marker: {
      size: 8,
      color: datos.map((d) => d.cluster), // Diferenciación por clúster
      colorscale: "Viridis",
      opacity: 0.8,
    },
    name: "Clusters",
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        p: 4,
        maxWidth: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {datos.length > 0 ? (
        <Plot
          data={[trace]}
          layout={{
            title: "Clustering en 3D",
            scene: {
              xaxis: {
                title: "Precio",
              },
              yaxis: {
                title: "Marca",
                tickvals: marcasEspecificas,
                ticktext: nombresMarcas,
              },
              zaxis: {
                title: "Categoría",
                tickvals: categoriasEspecificas,
                ticktext: nombresCategorias,
              },
            },
            margin: { l: 0, r: 0, t: 30, b: 0 },
            height: 600,
            width: "100%",
          }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Typography variant="body1" align="center">
          No se encontraron datos.
        </Typography>
      )}

      <Typography variant="body1" sx={{ mb: 3, color: "gray", textAlign: "center" }}>
      Gráfico de 7 clústeres, identifica grupos específicos, ideal para diseñar estrategias diferenciadas y captar nichos de mercado con necesidades concretas.      </Typography>
    </Box>
  );
};

export default GraficoClustering;

