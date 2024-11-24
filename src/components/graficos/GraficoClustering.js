import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";
import { fetchWithFallback } from "../../utils/api"; // Usa el fetch con fallback
import Plot from "react-plotly.js";

const GraficoClustering = () => {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        // Llamada al endpoint para obtener los datos
        const fetchData = async () => {
            try {
                const datos = await fetchWithFallback("/grafico/metodo_codo"); // Cambia al endpoint correcto
                setDatos(datos); // Asegúrate de que "datos" exista en la respuesta
                console.log('Informacion que trae grfico de codo:',datos)

                if (datos.length > 0 && datos[0].datos) {
                    setDatos(datos[0].datos); // Accede al array "datos" dentro del primer objeto
                    console.log("Datos cargados para el gráfico:", datos[0].datos);
                } else {
                    console.error("La respuesta no contiene el campo 'datos' esperado.");
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
        y: datos.map((d) => d.categoria), // Eje Y: Categoría
        z: datos.map((d) => d.marca), // Eje Z: Marca
        mode: "markers",
        type: "scatter3d",
        marker: {
            size: 8, // Tamaño de los puntos
            color: datos.map((d) => d.cluster), // Color dinámico basado en el clúster
            colorscale: "Viridis", // Paleta de colores
            opacity: 0.8,
        },
    };

    return (
        <Box     
        sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            maxWidth: "100%", // Limita el ancho
            height: "auto",
            display: "flex",
            justifyContent: "center", // Centra el contenido
        }}
    >
            {datos.length > 0 ? (
                <Plot
                    data={[trace]} // Datos para el gráfico
                    layout={{
                        title: "Clustering en 3D",
                        scene: {
                            xaxis: { title: "Precio" },
                            yaxis: { title: "Categoría" },
                            zaxis: { title: "Marca" },
                        },
                        height: 500, // Ajusta la altura
                        width: 400,  // Ajusta el ancho para que sea proporcional
                    }}
                />
            ) : (
                <Typography variant="body1" align="center">
                    No se encontraron datos.
                </Typography>
            )}
        </Box>
    );
};

export default GraficoClustering;
