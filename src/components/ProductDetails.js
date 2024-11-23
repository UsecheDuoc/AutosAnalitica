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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    
    useEffect(() => {
        const fetchData = async () => {
            const productRequest = fetchWithFallback(`${id}`);
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
                    const data = result.value?.data || []; // Asegúrate de que siempre sea un array

                    switch (index) {
                        case 0: // Detalles del producto
                            console.log("Producto obtenido:", result.value);
                            setProducto(result.value);
                            setErrorMessage(null);
                            break;
                        case 1: // Productos similares
                            console.log("Productos similares:", result.value.data);
                            setSimilarProducts(Array.isArray(result.value?.data) ? result.value.data.slice(0, 3) : []); // Verificar que sea un array
                            break;
                        case 2: // Productos relacionados
                            console.log("Productos relacionados:", result.value.data);
                            setRelatedProducts(Array.isArray(result.value?.data) ? result.value.data : []); // Verificar que sea un array
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
        fetchProductDetails();

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
                const response = await fetchWithFallback(`/productos/relacionados/${id}`
                );
                const data = await response.json();
                console.log("Productos relacionados (API con fallback):", data);
                setRelatedProducts(data);
            } catch (error) {
                console.error("Error al obtener productos relacionados:", error);
                setRelatedProducts([]); // Asegura que el estado no sea indefinido en caso de error
            }
        };
    
        fetchRelated();
    }, [id]);

    // Función para manejar la selección de un producto relacionado
    const handleRelatedProductClick = (relatedProductId) => {
        navigate(`${relatedProductId}`);
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
            const data = await response.json();
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

    // Configuración del gráfico de historial de precios
    const priceHistoryData = {
        labels: producto.historial_precios?.map((precio) => precio.fecha) || [],
        datasets: [
            {
                label: 'Precio',
                data: producto.historial_precios?.map((precio) => precio.precio) || [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 4,
            },
        ],
    };
    // Definir las variables para el cálculo de descuento o aumento
    // Calcular el último precio en el historial de precios y el cambio porcentual
    const lastPrice = producto.historial_precios?.length
    ? producto.historial_precios
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .at(-1)?.precio
    : null;


    const priceDifference = lastPrice !== null ? producto.precio_actual - lastPrice : 0;
    const percentageChange =
        lastPrice !== null
            ? Math.abs(priceDifference / lastPrice) * 100
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

    // Definición de las opciones del gráfico `priceHistoryOptions`
    const priceHistoryOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Precio: $${context.raw.toLocaleString('es-CL')}`
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Precio (CLP)'
                },
                beginAtZero: false
            }
        }
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


    return (
        <Container maxWidth="md" sx={{ width: '100%', p: { xs: 1, sm: 2 } }}    >

            
            {/* Detalles del producto */}
            <Paper elevation={4} sx={{ p: 2, width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={producto.imagenUrl || placeholderImage}
                    alt={producto.nombre}
                    sx={{ width: { xs: '100%', md: '40%' }, mr: { md: 3 }, borderRadius: 2 }}
                />
                <Box sx={{ flex: 1, mt: { xs: 3, md: 0 },width: '100%'  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {producto.nombre}
                    </Typography>
                    
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: estado.includes('Bajó') ? 'green' : estado.includes('Aumentó') ? 'red' : 'gray' 
                        }}
                    >
                        {estado || 'Estado no disponible'}
                    </Typography>


                    <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                        Precio: {producto.precio_actual ? producto.precio_actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : "-"}
                    </Typography>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handlePurchase(producto.LinkPagina)}
                        sx={{ mt: 3, py: 1, fontSize: '1.1rem' }}
                    >
                        Comprar
                    </Button>
                </Box>
            </Paper>




             {/* Caracteristicas del producto */}
             <Accordion sx={{ mt: 4 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Características del producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                        {/* Aquí puedes agregar el texto de características */}
                        Este es un producto de alta calidad, ideal para uso en el hogar y la oficina.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Descripcion del producto */}
            <Accordion sx={{ mt: 4 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Descripción del producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        {producto.descripcion}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Historial de precios */}
            <Paper elevation={4} sx={{ mt: 4, p: 2, width: '100%' }}>
                <Typography variant="h6" gutterBottom>Historial de Precios</Typography>
                <Line data={priceHistoryData} options={priceHistoryOptions} height={100} width={400} />
            </Paper>

            {/* Comparación con productos similares */}
            <Paper elevation={4} sx={{ p: 2, mt: 4,mb: 5, borderRadius: 6, width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Compara con otros productos similares
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: '100%',
                    overflowX: { xs: 'auto', sm: 'unset' }, // Scroll en pantallas pequeñas
                    justifyContent: { sm: 'center' }
                }}>                    
                    {[producto, ...similarProducts].map((prod, index) => (
                        <Card key={index} sx={{ width: { xs: '100%', sm: '200px' }, boxShadow: 3, textAlign: 'center' , flexShrink: 0 }}>
                            <CardMedia
                                component="img"
                                image={prod.imagenUrl || placeholderImage} // Cambia 'related' a 'prod'
                                alt={prod.nombre} // Cambia 'related' a 'prod'
                                sx={{
                                    width: '100%',
                                    height: { xs: 120, sm: 160 },
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                    mb: 1,
                                }}
                            />  
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{prod.nombre}</Typography>
                                {index === 0 ? (
                                    <Typography variant="body2" color="textSecondary">(Producto actual)</Typography>
                                ) : (
                                    <Button variant="text" color="primary" href={`/product/${prod._id}`}>
                                        Ver producto
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index} sx={{ fontWeight: 'bold' }}>
                                        {prod.nombre}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Opiniones</TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index}>{prod.opiniones || "-"}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index}>
                                        {prod.precio_actual ? `$${prod.precio_actual.toLocaleString('es-CL')}` : "-"}
                                    </TableCell>
                                ))} 
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Marca</TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index}>{prod.marca || "-"}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Modelo</TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index}>{prod.modelo || "-"}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Color</TableCell>
                                {[producto, ...similarProducts].map((prod, index) => (
                                    <TableCell align="center" key={index}>{prod.color || "-"}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            

             {/* Productos Destacados */}
             <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p:1 , mb: 5 }}>
             <div className="mt-8 px-4 relative">
             <h2 className="text-2xl font-bold mb-4">Productos Destacados</h2>
             {Array.isArray(relatedProducts) && relatedProducts.length > 0 ? (
                <Slider
                    {...settings}
                    arrows={false}
                    autoplay={true}
                    autoplaySpeed={2000}
                >
                    {relatedProducts.map((related, index) => (
                        <div key={index} className="px-2">
                            <Link to={`/productos/${related._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="bg-white shadow-md rounded-lg overflow-hidden text-center">
                                    <img
                                        src={related.imagenUrl || "https://via.placeholder.com/300"}
                                        alt={related.nombre || "Sin nombre"}
                                        className="h-44 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">{related.nombre || "Sin nombre"}</h3>
                                        <p className="text-green-500 font-bold mt-2">
                                            ${related.precio_actual?.toLocaleString("es-CL") || "Precio no disponible"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            ) : (
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
