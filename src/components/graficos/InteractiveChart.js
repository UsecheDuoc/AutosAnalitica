import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { fetchWithFallback } from "../../utils/api"; // Usa el fetch con fallback
import Plot from "react-plotly.js";

const InteractiveChart3D = () => {
  const [datos, setDatos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [interpretaciones, setInterpretaciones] = useState([]);
  // Marcas y categorías específicas de la foto
  const marcasEspecificas = [2, 4, 6, 8, 10]; // Valores numéricos de las marcas
  const nombresMarcas = ["Chery", "Chrysler", "Kia", "Nissan", "Alternativa"]; // Nombres correspondientes a las marcas
  
  
  
  const categoriasEspecificas = [20, 40, 60, 80, 100]; // Valores numéricos de las categorías
  const nombresCategorias = ["Carroceria", "Espejos", "Molduras", "Interior", "Tensores"]; // Nombres correspondientes a las categorías



  useEffect(() => {
    // Llamada al endpoint para obtener los datos
    const fetchData = async () => {
        try {
          const response = await fetchWithFallback("/productos/graficos_interactivos"); // Cambia la URL si es necesario
          const data = response;
  
          console.log("Respuesta completa del servidor:", data);
  
          if (data && data.length > 0 && data[0].clusters) {
            setDatos(data[0].clusters); // Extraemos el array de clusters
            setInterpretaciones(data[0].interpretaciones || []); // Interpretaciones del gráfico
            setDescripcion(data[0].descripcion || ""); // Descripción del gráfico

            console.log("Clústeres extraídos:", data[0].clusters);

          } else {
            console.error("No se encontraron clústeres en los datos.");
          }
        } catch (error) {
          console.error("Error al obtener los datos del gráfico interactivo:", error);
        }
      };

    fetchData();
  }, []);

  

  // Configuración del gráfico 3D
  const trace = datos.map((cluster, index) => ({
    x: Array(cluster.categorias.length).fill(cluster.rango_precios.min), // Eje X: Precio mínimo
    y: cluster.marcas.map((marca) => marca || 0), // Eje Y: Marcas
    z: cluster.categorias.map((categoria) => categoria || 0), // Eje Z: Categorías
    mode: "markers",
    type: "scatter3d",
    marker: {
      size: 4,
      color: index, // Un color único para cada clúster basado en su índice
      colorscale: "Viridis",
      opacity: 0.8,
    },
    name: `Clúster ${cluster.id_cluster}`,
  }));

  return (
    <Box
    sx={{
      backgroundColor: "white",
      boxShadow: 3,
      borderRadius: 2,
      p: 4,
      width: "100%", // Asegura que el contenedor use todo el ancho
      height: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
    >
      {/* Gráfico 3D */}
      <Box sx={{ flex: 2 }}>

      {datos.length > 0 ? (
         <>
        <Plot
        data={trace}
        layout={{
        title: "Gráfico 3D de Clústeres",
        scene: {
            xaxis: {
            //title: "Precio Mínimo",
            showaxeslabels: false, // Quita la etiqueta "X"
            titlefont: { color: "white" }, // Cambia el color del título del eje Y

            },
            yaxis: {
                //title: "Marca",
                titlefont: { color: "white" }, // Cambia el color del título del eje Y

                tickvals: marcasEspecificas, // Valores numéricos de las marcas
                ticktext: nombresMarcas, // Nombre  s correspondientes a las marcas
                showaxeslabels: false, // Quita la etiqueta "X"
 
            },
              zaxis: {
                //title: "Categoría",
                titlefont: { color: "white" }, // Cambia el color del título del eje Y

                tickvals: categoriasEspecificas, // Valores numéricos de las categorías
                ticktext: nombresCategorias, // Nombres correspondientes a las categorías
                showaxeslabels: false, // Quita la etiqueta "X"
  
            },
        },
        margin: { l: 0, r: 0, t: 30, b: 0 }, // Márgenes mínimos para maximizar el espacio del gráfico
        autosize: true, // Asegura que el gráfico sea responsivo

        }}
        useResizeHandler
        style={{ width: "100%", height: "600px" }} // Configura el ancho dinámico
        />
            {/* Campo de texto debajo del gráfico */}
            <Box sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ mt: 3, color: "gray", textAlign: "center" }}>
              Gráfico de 3 clústeres, segmenta en categorías amplias (económico, intermedio, premium)
              Útil en desiciones de estrategias generales y campañas masivas basadas en perfiles de cliente.              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body1" align="center">
            No se encontraron datos.
          </Typography>
        )}
      </Box>

      
    </Box>
  );
};


export default InteractiveChart3D;
