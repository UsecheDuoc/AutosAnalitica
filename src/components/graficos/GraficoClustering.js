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
                p: 4,
                maxWidth: "100%", // Limita el ancho
                height: "auto",
                display: "flex",
                flexDirection: "column", // Alinea contenido verticalmente
                alignItems: "center", // Centra el contenido
            }}
        >
            {/* Gráfico 3D */}
            {datos.length > 0 ? (
                    <Plot
                        data={[trace]}
                        layout={{
                            title: "Clustering en 3D",
                            scene: {
                                xaxis: { title: "Precio" },
                                yaxis: { title: "Categoría" },
                                zaxis: { title: "Marca" },
                            },
                            margin: { l: 0, r: 0, t: 30, b: 0 }, // Reduce márgenes para maximizar el espacio
                            height: 600, // Aumenta la altura del gráfico
                            width: "100%", // Ocupa todo el ancho del contenedor
                        }}
                        useResizeHandler
                        style={{ width: "100%", height: "100%" }} // Hace que el gráfico sea responsivo
                    />
            ) : (
                <Typography variant="body1" align="center">
                    No se encontraron datos.
                </Typography>
            )}


            {/* Texto explicativo del gráfico */}
            <Typography variant="body1" sx={{ mb: 3, color: "gray", textAlign: "center" }}>
                Este gráfico muestra la agrupación de productos en función de su precio, categoría y marca.
            
            
            
            
            
            </Typography>
        </Box>
    );
};

export default GraficoClustering;
