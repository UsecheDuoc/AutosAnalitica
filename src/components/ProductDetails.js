import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate  } from 'react-router-dom';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Box, Button,IconButton , Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slick';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import config from '../config';
import { fetchWithFallback } from "../utils/api"; //URL de utils en componentes principales
import { tienda } from '../constants';
import annotationPlugin from 'chartjs-plugin-annotation';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip,annotationPlugin, Legend);

console.log('ProductDetails montado');


function Arrow(props) {
    const { className, style, onClick, icon } = props;
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                ...style,
                display: 'block',
                background: 'black',
                borderRadius: '50%',
                padding: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 1,
            }}
        >
            {icon}
        </div>
    );
}





function ProductDetails() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const placeholderImage = 'https://via.placeholder.com/150';
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [priceHistoryData, setPriceHistoryData] = useState(null); // Estado para los datos del gráfico
    const [predicciones, setPredicciones] = useState([]);
    //const [productosDestacados, setProductosDestacados] = useState([]);
    const [isLoadingDestacados, setIsLoadingDestacados] = useState(false);
    const [errorDestacados, setErrorDestacados] = useState(null);
    

    //Productos destacados
    useEffect(() => {
        fetchProductosDestacados();
    }, []);
    const fetchProductosDestacados = async () => {
        setIsLoadingDestacados(true);
        setErrorDestacados(null);
        try {
            const response = await fetchWithFallback(`/productos/destacados-descuento`);
            if (!response || response.length === 0) {
                setErrorDestacados("No hay productos destacados disponibles.");
            } else {
                console.log('Productos destacados que trae la apo:',response)

                setProductosDestacados(response);
            }
        } catch (error) {
            console.error("Error al obtener productos destacados:", error.message);
            setErrorMessage("No se pudieron cargar los productos destacados.");
        } finally {
            setIsLoadingDestacados(false);
        }
    };



    // Función para manejar la selección de un producto relacionado
    const handleRelatedProductClick = (relatedProductId) => {
        navigate(`${relatedProductId}`);
        console.log('Lo que tomo de la url para id: ', relatedProductId)
    };

    useEffect(() => {
        const fetchData = async () => {
            const productRequest = await fetchWithFallback(`/productos/${encodeURIComponent(id)}`);
            const similarProductsRequest = fetchWithFallback(`/productos/buscar-similares?id=${id}`);
            const relatedProductsRequest = fetchWithFallback(`/productos/relacionados/${id}`);
    
            const results = await Promise.allSettled([
                productRequest,
                similarProductsRequest,
                relatedProductsRequest,
            ]);
    
            // Manejo de resultados de cada solicitud
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const data = result; // Asegúrate de que siempre sea un array
                    console.log('Lo que me trae el primer fetch',data)
                    switch (index) {
                        case 0: // Detalles del producto
                            console.log("Producto obtenido:", result.value);
                            setProducto(result.value);
                            setErrorMessage(null);
                            break;
                        case 1: // Productos similares
                            console.log("Productos similares:", result);
                            setSimilarProducts(Array.isArray(result.value) ? result.value.slice(0, 3) : []); // Verificar que sea un array
                            break;
                        case 2: // Productos relacionados
                            console.log("Productos relacionados:", result);
                            setRelatedProducts(Array.isArray(result.value) ? result.value : []); // Verificar que sea un array
                            break;
                        default:
                            break;
                    }
                } else {
                    console.error(`Error en la solicitud ${index}:`, result.reason);
                    // Manejo de errores para cada caso
                    switch (index) {
                        case 0:
                            setErrorMessage("Error al obtener los detalles del producto.");
                            break;
                        case 1:
                            setSimilarProducts([]); // Asegura que sea un array vacío
                            break;
                        case 2:
                            setRelatedProducts([]); // Asegura que sea un array vacío
                            break;
                        default:
                            break;
                    }
                }
            });
        };
    
        fetchData();
    }, [id]);
    
    
    {/* Productos Relacionados */}
    // Llamada para obtener los detalles del producto basado en el ID
    useEffect(() => {
        fetchProductDetails(id);

        // Al cambiar el producto, desplazarse al inicio de la página
        window.scrollTo(0, 0);
    }, [id]);

    {/* Descuento de productos */}
    useEffect(() => {
        fetchWithFallback(`/productos/productos-con-descuento`)
            .then(response => {
                setProductos(response.data); // `descuento` y `aumento` ahora están disponibles en cada producto
            })
            .catch(error => console.error("Error al obtener productos:", error));
    }, []);
    //const productosConDescuento = productos.filter(producto => producto.descuento > 0);

  
    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const response = await fetchWithFallback(`/productos/relacionados/${id}`);
                const data = await response;
                console.log("Productos relacionados (API con fallback):", data);
                setRelatedProducts(data);
            } catch (error) {
                console.error("Error al obtener productos relacionados:", error);
                setRelatedProducts([]); // Asegura que el estado no sea indefinido en caso de error
            }
        };
    
        fetchRelated();
    }, [id]);

  

    
    const fetchPredictions = async (productoId) => {
        try {
            const response = await fetchWithFallback(`/productos/prediccion/${productoId}`);
            console.log('La prediccion: ',response)


            // Verificar si la respuesta tiene el formato correcto
            if (response && typeof response === "object" && response._id) {
                console.log("Predicciones obtenidas:", response);
    
                // Filtrar predicciones con fecha futura
                const fechaActual = new Date();
                const fechaPrediccion = new Date(response.fecha_futura);
                if (fechaPrediccion > fechaActual) {
                    return [response]; // Devuelve la predicción como un array para mantener consistencia
                } else {
                    console.warn("La predicción tiene una fecha pasada.");
                    return [];
                }
            } else {
                console.warn(`Error: Respuesta no válida con código ${response?.status}`);
                return [];
            }
        } catch (error) {
            console.error("Error al obtener las predicciones:", error);
            return [];
        }
    };
    
    //Para el historial de precio
    useEffect(() => {
        const fetchAndRenderPriceHistory = async () => {
            try {
                const fetchedPredicciones = await fetchPredictions(producto._id);
                const priceHistory = combinePriceHistoryWithPredictions(
                    producto.historial_precios,
                    fetchedPredicciones
                );
                console.log("Datos finales para el gráfico:", priceHistory);
                setPriceHistoryData(priceHistory);
                console.log("Estructura final de labels:", priceHistoryData.labels);
                console.log("Estructura final de datasets:", priceHistoryData.datasets);

            } catch (error) {
                console.error("Error al procesar el historial de precios:", error);
            }
        };
    
        if (producto) {
            fetchAndRenderPriceHistory();
        }
    }, [producto]);
    
    const priceHistoryOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Precio: $${context.raw?.toLocaleString("es-CL")}`,
                },
            },
            annotation: {
                annotations: {
                    predictionArea: {
                        type: "box",
                        xMin: priceHistoryData?.labels?.[priceHistoryData.labels.length - 2] || null, // Última etiqueta del historial
                        xMax: priceHistoryData?.labels?.[priceHistoryData.labels.length - 1] || null, // Primera etiqueta de predicción
                        backgroundColor: "rgba(238, 139, 139, 0.3)", // Color gris semi-transparente
                        borderColor: "rgba(0, 0, 0, 0.5)", // Color del borde del área
                        borderWidth: 1, // Ancho del borde                    
                        },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Fecha",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Precio (CLP)",
                },
                beginAtZero: false,
            },
        },
    };
    
            
        
    

    // Configuración del gráfico de historial de precios
    const initializePriceHistory = (historialPrecios) => ({
        labels: historialPrecios.map((item) => item.fecha),
        datasets: [
            {
                label: "Historial de Precios",
                data: historialPrecios.map((item) => item.precio),
                borderColor: "rgba(75, 192, 192, 1)", // Color de línea para historial
                backgroundColor: "rgba(75, 192, 192, 0.1)", // Fondo para historial
                tension: 0.1,
                pointBackgroundColor: "black", // Color de puntos
                pointRadius: 4,
            },
        ],
    });


    const combinePriceHistoryWithPredictions = (historialPrecios, predicciones) => {

        // Verifica que ambos sean arrays antes de procesarlos
        if (!Array.isArray(historialPrecios)) historialPrecios = [];
        if (!Array.isArray(predicciones)) predicciones = [];

        // Combinar historial de precios y predicciones
        const combinedData = [
            ...historialPrecios.map((item) => ({
                fecha: new Date(item.fecha),
                precio: item.precio,
                tipo: "historial",
            })),
            ...predicciones.map((prediccion) => ({
                fecha: new Date(prediccion.fecha_futura),
                precio: prediccion.precio_futuro,
                tipo: "prediccion",
            })),
        ];
    
        // Ordenar por fecha
        combinedData.sort((a, b) => a.fecha - b.fecha);
    
        // Crear etiquetas (labels) y datasets sincronizados
        const labels = combinedData.map((item) => item.fecha.toISOString().split("T")[0]);
    
        const historialData = labels.map((label) => {
            const item = combinedData.find((data) => data.fecha.toISOString().split("T")[0] === label && data.tipo === "historial");
            return item ? item.precio : null;
        });
    
        const prediccionData = labels.map((label) => {
            const item = combinedData.find((data) => data.fecha.toISOString().split("T")[0] === label && data.tipo === "prediccion");
            return item ? item.precio : null;
        });
    
        // Identificar el último punto del historial y el primero de la predicción
        const lastHistorialIndex = labels.lastIndexOf(
            historialData.find((val) => val !== null)
        );
        const firstPrediccionIndex = labels.indexOf(
            prediccionData.find((val) => val !== null)
        );
        // Crear el área de conexión entre el último punto del historial y el primero de la predicción
        const areaData = labels.map((_, index) => {
            if (index >= lastHistorialIndex && index <= firstPrediccionIndex) {
                return historialData[index] || prediccionData[index];
            }
            return null;
        });
    
        return {
            labels,
            datasets: [
                {
                    label: "Historial de Precios",
                    data: historialData,
                    borderColor: "black",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    tension: 0.1,
                    pointBackgroundColor: "yellow",
                    pointRadius: 4,
                },
                {
                    label: "Predicción de Precio",
                    
                    data: prediccionData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.3)",
                    tension: 0.1,
                    pointBackgroundColor: "rgba(255, 99, 132, 1)",
                    pointRadius: 5,
                    borderDash: [5, 5],
                },
            ],
            options: {
                plugins: {
                    legend: {
                        display: true,
                        align: "end", // Mueve las leyendas hacia la derecha
                        labels: {
                            filter: (legendItem) => legendItem.text !== "Conexión", // Oculta la leyenda de "Conexión"
                        },
                    },
                },
            },
        };
        
        
        
    };
    

    const handlePurchase = (link) => {
        if (link) {
            window.open(link, "_blank");
        } else {
            alert("El enlace de compra no está disponible.");
        }
    };

    const fetchProductDetails = async (id) => {
        setIsLoading(true); // Inicia el estado de carga

        // Aquí deberías agregar la lógica para obtener los detalles del producto basado en el ID
        // Ejemplo:
        try {
            const response = await fetchWithFallback(`/productos/${id}`);
            const data = await response;
            setProduct(data);
            // Suponiendo que el producto tiene un campo 'relatedProducts'
            setRelatedProducts(data.relatedProducts || []);
        } catch (error) {
            console.error("Error fetching product details:", error);
            //setErrorMessage("Error al obtener los detalles del producto. Intenta más tarde.");
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
    }    };

    if (errorMessage) {
        return <Typography variant="h6" align="center">{errorMessage}</Typography>;
    }

    if (!producto) return <Typography variant="h6" align="center">Cargando producto...</Typography>;


        
    
      





    // Definir las variables para el cálculo de descuento o aumento
    // Calcular el último precio en el historial de precios y el cambio porcentual
    const lastPrice = producto.historial_precios?.length
    ? producto.historial_precios
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .at(-2)?.precio//Prnultimo precio del array historial
    : null;

    //formula para calcular el porcentaje de cambio respoecto al penultimo precio
    const priceDifference = lastPrice !== null ? producto.precio_actual - lastPrice : 0;
    const percentageChange =
    lastPrice !== null
        ? Math.round(Math.abs(priceDifference / lastPrice) * 100)
        : 0;

    
        // Mostrar por consola los valores
    console.log("Precio actual:", producto.precio_actual);
    console.log("Último precio en historial:", lastPrice);
    console.log("Diferencia de precio:", priceDifference);
    console.log("Cambio porcentual:", percentageChange);
    // Definir el estado del precio en base a la comparación
    const estado = priceDifference > 0
        ? `Aumentó: ${percentageChange}%`
        : priceDifference < 0
        ? `Bajó: ${percentageChange}%`
        : "Sin cambios";



    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        prevArrow: <IconButton sx={{ fontSize: 30, position: 'absolute', left: 10, top: '40%', zIndex: 10 }}>{"<"}</IconButton>,
        nextArrow: <IconButton sx={{ fontSize: 30, position: 'absolute', right: 10, top: '40%', zIndex: 10 }}>{">"}</IconButton>

    };


    
    
    
    

    // Configuración del carrusel para categorías y marcas
    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Por defecto muestra 4 elementos
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1280, // Pantallas grandes
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1024, // Pantallas medianas
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, // Tablets y pantallas pequeñas
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480, // Dispositivos móviles
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    // Configuración del carrusel para productos relacionados
    const productCarouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Por defecto muestra 3 elementos
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1280, // Pantallas grandes
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024, // Pantallas medianas
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // Tablets y pantallas pequeñas
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

        if (isLoading) {
        return <Typography variant="h6" align="center">Cargando producto...</Typography>;
    }

    if (errorMessage) {
        return <Typography variant="h6" align="center" color="error">{errorMessage}</Typography>;
    }



    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : null);
    };



    return (
        <Container>
            <Paper
            elevation={4}
            sx={{
                p: 3,
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch', // Asegura que ambas tarjetas se alineen verticalmente
                gap: 3,
                borderRadius: 4,
                minHeight: '250px', // Asegura una altura mínima

            }}
            >
            {/* Tarjeta principal del producto */}
            <Paper
                elevation={4}
                sx={{
                flex: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                borderRadius: 4,
                }}
            >
                {/* Imagen del producto */}
                <CardMedia
                component="img"
                image={producto.imagenUrl || placeholderImage}
                alt={producto.nombre}
                sx={{
                    width: '250px',
                    height: '250px',
                    objectFit: 'contain',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
                />

                {/* Información del producto */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {producto.nombre}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                    fontWeight: 'bold',
                    color: estado.includes('Bajó')
                        ? 'green'
                        : estado.includes('Aumentó')
                        ? 'red'
                        : 'gray',
                    mb: 1,
                    }}
                >
                    {estado || 'Estado no disponible'}
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Precio:{' '}
                    {producto.precio_actual
                    ? producto.precio_actual.toLocaleString('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        })
                    : '-'}
                </Typography>


            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                variant="contained"
                onClick={() => handlePurchase(producto.LinkPagina)}
                sx={{
                    backgroundColor: '#FFCC00', // Color naranja para resaltar

                    px: 4,
                    py: 1,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: 3,
                    '&:hover': {
                        backgroundColor: '#e64a19',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                {/* Obtener el logo correspondiente */}
                {tienda
                    .filter((tiendaItem) => tiendaItem.alt === producto.nombreTienda)
                    .map((logo, index) => (
                    <img
                        key={index}
                        src={logo.src}
                        alt={logo.alt}
                        style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'contain',
                        marginRight: '8px', // Espaciado adicional entre el logo y el texto
                        }}
                    />
                    ))}
                {/* Nombre de la tienda */}
                {`Visitar ${producto.nombreTienda || 'la tienda'}`}
                </Button>
                </Box>


                </Box>
            </Paper>

            {/* Características y Descripción en tarjetas separadas */}
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: 3,
                width: '100%',
                }}
            >

            {/* Características */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Características del producto
            </Typography>
            <Box
                component="table"
                sx={{
                width: '100%',
                borderCollapse: 'collapse',
                bgcolor: '#f9f9f9',
                }}
            >
                <tbody>
                {producto && (
                    <>
                    <tr>
                        <td
                        style={{
                            fontWeight: 'bold',
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                        }}
                        >
                        Marca
                        </td>
                        <td
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            color: producto.marca !== "null" && producto.marca !== undefined && producto.marca !== "No especificado"
                            ? 'black' // Color normal
                            : 'red', // Color para "No especificado"
                        }}
                        >
                        {producto.marca !== "null" && producto.marca !== undefined ? producto.marca : 'No especificado'}
                        </td>
                    </tr>
                    <tr>
                        <td
                        style={{
                            fontWeight: 'bold',
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                        }}
                        >
                        Modelo
                        </td>
                        <td
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            color: producto.modelo !== "null" && producto.modelo !== undefined && producto.modelo !== "No especificado"
                            ? 'black' // Color normal
                            : 'red', // Color para "No especificado"
                        }}
                        >
                        {producto.modelo !== "null" && producto.modelo !== undefined ? producto.modelo : 'No especificado'}
                        </td>
                    </tr>
                    <tr>
                        <td
                        style={{
                            fontWeight: 'bold',
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                        }}
                        >
                        Categoría
                        </td>
                        <td
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            color: producto.categoria !== "null" && producto.categoria !== undefined && producto.categoria !== "No especificado"
                            ? 'black' // Color normal
                            : 'red', // Color para "No especificado"
                        }}
                        >
                        {producto.categoria !== "null" && producto.categoria !== undefined ? producto.categoria : 'No especificado'}
                        </td>
                    </tr>
                    <tr>
                        <td
                        style={{
                            fontWeight: 'bold',
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                        }}
                        >
                        Color
                        </td>
                        <td
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            color: producto.color !== "null" && producto.color !== undefined && producto.color !== "No especificado"
                            ? 'black' // Color normal
                            : 'red', // Color para "No especificado"
                        }}
                        >
                        {producto.color !== "null" && producto.color !== undefined ? producto.color : 'No especificado'}
                        </td>
                    </tr>
                    <tr>
                        <td
                        style={{
                            fontWeight: 'bold',
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                        }}
                        >
                        Material
                        </td>
                        <td
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            textAlign: 'left',
                            color: producto.material !== "null" && producto.material !== undefined && producto.material !== "No especificado"
                            ? 'black' // Color normal
                            : 'red', // Color para "No especificado"
                        }}
                        >
                        {producto.material !== "null" && producto.material !== undefined ? producto.material : 'No especificado'}

                        </td>
                    </tr>
                    {/* Agregar más características si es necesario */}
                    </>
                )}
                </tbody>
            </Box>
            </Paper>


            {/* Descripción */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, maxWidth: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Descripción del producto
            </Typography>
            <Box
                sx={{
                maxHeight: '150px', // Altura máxima de la caja
                overflow: 'auto', // Scroll interno si el contenido excede
                bgcolor: '#f9f9f9',
                borderRadius: 2,
                p: 2,
                border: '1px solid #ddd',
                }}
            >
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: '1.5' }}>
                {producto.descripcion !== "null" && producto.descripcion !== undefined ? producto.descripcion : 'No especificado'}
                </Typography>
            </Box>
            </Paper>

            
            
            </Box>
            </Paper>



            {/* Historial de precios */}
            <Paper elevation={4} sx={{ mt: 4, p: 2, width: "100%" }}>
                <Typography variant="h6" gutterBottom>
                    Historial de Precios
                </Typography>
                {priceHistoryData ? (
                    <Line data={priceHistoryData} options={priceHistoryOptions} height={100} width={400} />
                ) : (
                    <Typography variant="body2">Cargando datos del historial de precios...</Typography>
                )}
            </Paper>






            

            {/* Comparación con productos similares */}
            <Paper elevation={4} sx={{ p: 2, mt: 4, mb: 5, borderRadius: 6, width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Compara con otros productos similares
            </Typography>

            {/* Tabla comparativa con tarjetas */}
            <TableContainer component={Paper} sx={{ mt: 4, overflowX: 'auto' }}>
                <Table>
                <TableHead>
                    <TableRow>
                    {/* Columna vacía para los títulos de la izquierda */}
                    <TableCell></TableCell>
                    {/* Tarjetas como encabezados de cada columna */}
                    {[producto, ...similarProducts].map((prod, index) => (
                        <TableCell
                        align="center"
                        key={index}
                        sx={{
                            width: '200px',
                            textAlign: 'center',
                            borderBottom: 'none',
                        }}
                        >
                        <Card
                            sx={{
                            width: '180px',
                            boxShadow: 3,
                            textAlign: 'center',
                            borderRadius: 2,
                            margin: '0 auto',
                            }}
                        >
                            <CardMedia
                            component="img"
                            image={prod.imagenUrl || placeholderImage}
                            alt={prod.nombre}
                            sx={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'contain',
                                borderBottom: '1px solid #ddd',
                            }}
                            />
                            <CardContent>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                mb: 1,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Limitar a 2 líneas
                                textOverflow: 'ellipsis',
                                lineHeight: '1.2rem',
                                maxHeight: '2.4rem',
                                }}
                            >
                                {prod.nombre}
                            </Typography>
                            {index === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                (Producto actual)
                                </Typography>
                            ) : (
                                <Button
                                variant="text"
                                color="primary"
                                href={`/product/${prod._id}`}
                                sx={{ fontSize: '0.8rem' }}
                                >
                                Ver producto
                                </Button>
                            )}
                            </CardContent>
                        </Card>
                        </TableCell>
                    ))}
                    </TableRow>
                    <TableRow>
                    <TableCell></TableCell>
                    {/* Títulos de productos */}
                    {[producto, ...similarProducts].map((prod, index) => (
                        <TableCell
                        align="center"
                        key={index}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                        }}
                        >
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[
                    { label: 'Precio', key: 'precio_actual', format: (val) => `$${val?.toLocaleString('es-CL')}` },
                    { label: 'Marca', key: 'marca' },
                    { label: 'Modelo', key: 'modelo' },
                    { label: 'Tienda procedencia:', key: 'empresa_procedencia' },
                    ].map((row, idx) => (
                    <TableRow key={idx}>
                        <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}
                        >
                        {row.label}
                        </TableCell>
                        {[producto, ...similarProducts].map((prod, index) => (
                        <TableCell
                            align="center"
                            key={index}
                            sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                        >
                            {row.format ? row.format(prod[row.key]) : prod[row.key] || '-'}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Paper>


            {/* Productos Destacados */}
{/* Productos Destacados */}
<Box
    sx={{
        bgcolor: '#f0f0f0',
        borderRadius: 2,
        p: 1,
        mb: 5,
    }}
>
    <div className="mt-8 px-4 relative">
        <h2 className="text-2xl font-bold mb-4">Productos Destacados</h2>

        {isLoadingDestacados ? (
            // Mostrar mensaje de carga
            <Typography variant="body2" align="center" color="textSecondary">
                Cargando productos destacados...
            </Typography>
        ) : errorDestacados ? (
            // Mostrar mensaje de error
            <Typography variant="body2" align="center" color="error">
                {errorDestacados}
            </Typography>
        ) : Array.isArray(productosDestacados) && productosDestacados.length > 0 ? (
            // Mostrar slider solo si hay productos destacados
            <Slider
                {...settings}
                arrows={false} // Eliminamos las flechas
                autoplay={true} // Activamos el desplazamiento automático
                autoplaySpeed={2000} // Intervalo de 2 segundos
            >
                {productosDestacados.map((producto, index) => (
                    <div key={index} className="px-2">
                        <Link
                            to={`/product/${producto._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {/* Enlace al ProductDetails.js con el ID */}
                            <div className="bg-white shadow-md rounded-lg overflow-hidden text-center">
                                <CardMedia
                                    component="img"
                                    image={producto.imagenUrl || 'https://via.placeholder.com/200'}
                                    alt={producto.nombre}
                                    sx={{
                                        width: '100%', // Ajusta al ancho del contenedor
                                        height: { xs: '120px', sm: '150px', md: '200px' }, // Altura variable por pantalla
                                        objectFit: 'contain', // Ajusta la imagen dentro del contenedor sin recortar
                                        borderRadius: '8px', // Opcional: redondea los bordes
                                        backgroundColor: '#f5f5f5', // Opcional: fondo para imágenes transparentes
                                        padding: '10px', // Opcional: espacio interno
                                    }}
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                                    <p className="text-green-500 font-bold mt-2">
                                        ${producto.precio_actual.toLocaleString("es-CL")}
                                    </p>

                                    {/* Descuento */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: producto.descuentoRelativo ? 'red' : 'gray', // Rojo si hay descuento
                                            fontWeight: 'bold', // Negrita para resaltar
                                            textAlign: 'center', // Centrado del texto
                                        }}
                                    >
                                        {producto.descuentoRelativo
                                            ? `Descuento: ${Math.round(producto.descuentoRelativo)}%` // Redondea y agrega el símbolo %
                                            : 'Sin descuento'}
                                    </Typography>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        ) : (
            // Mostrar mensaje si no hay productos destacados
            <Typography variant="body2" color="textSecondary" align="center">
                No hay productos destacados disponibles.
            </Typography>
        )}
    </div>
</Box>





        </Container>
    );
}

export default ProductDetails;
