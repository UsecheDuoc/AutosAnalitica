import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate  } from 'react-router-dom';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Box, Button,IconButton , Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slick';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


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

    useEffect(() => {
        // Obtener detalles del producto actual
        axios.get(`http://localhost:3000/api/productos/${id}`)
            .then(response => {
                console.log("Producto obtenido:", response.data);
                setProducto(response.data);
                setErrorMessage(null);
            })
            .catch(error => {
                console.error("Error al obtener los detalles del producto:", error);
                setErrorMessage("Error al obtener los detalles del producto.");
            });
    
        // Obtener productos similares
        axios.get(`http://localhost:3000/api/productos/buscar-similares?id=${id}`)
            .then(response => {
                console.log("Productos similares:", response.data);
                setSimilarProducts(response.data.slice(0, 3)); // Limita a 3 productos similares
            })
            .catch(error => {
                console.error("Error al obtener productos similares:", error);
                setErrorMessage("Error al obtener productos similares.");
            });

    // Obtener productos relacionados
        axios.get(`http://localhost:3000/api/productos/relacionados/${id}`)
        .then(response => {
            console.log("Productos relacionados:", response.data);
            setRelatedProducts(response.data);
        })
            .catch(error => console.error("Error al obtener productos relacionados:", error));
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
        axios.get('http://localhost:3000/api/productos-con-descuento')
            .then(response => {
                setProductos(response.data); // `descuento` y `aumento` ahora están disponibles en cada producto
            })
            .catch(error => console.error("Error al obtener productos:", error));
    }, []);
    const productosConDescuento = productos.filter(producto => producto.descuento > 0);



    // Función para manejar la selección de un producto relacionado
    const handleRelatedProductClick = (relatedProductId) => {
        navigate(`/product/${relatedProductId}`);
    };

    const handlePurchase = (link) => {
        if (link) {
            window.open(link, "_blank");
        } else {
            alert("El enlace de compra no está disponible.");
        }
    };

    const fetchProductDetails = async (id) => {
        // Aquí deberías agregar la lógica para obtener los detalles del producto basado en el ID
        // Ejemplo:
        try {
            const response = await fetch(`http://localhost:3000/api/product/${id}`);
            const data = await response.json();
            setProduct(data);
            // Suponiendo que el producto tiene un campo 'relatedProducts'
            setRelatedProducts(data.relatedProducts || []);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

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
    const lastPrice = producto.historial_precios && producto.historial_precios.length > 0
        ? producto.historial_precios.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[producto.historial_precios.length - 1].precio
        : null;

    const priceDifference = lastPrice !== null ? producto.precio_actual - lastPrice : 0;
    const percentageChange = lastPrice !== null ? ((Math.abs(priceDifference) / lastPrice) * 100).toFixed(2) : 0;

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

    return (
        <Container sx={{ mt: 4 }}>
            {/* Detalles del producto */}
            <Paper elevation={4} sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={producto.imagenUrl || placeholderImage}
                    alt={producto.nombre}
                    sx={{ width: { xs: '100%', md: '40%' }, mr: { md: 3 }, borderRadius: 2 }}
                />
                <Box sx={{ flex: 1, mt: { xs: 3, md: 0 } }}>
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
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        {producto.descripcion}
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
                    <Typography variant="body2" color="text.secondary">
                        {/* Aquí puedes agregar el texto de descripción */}
                        Este dispensador de agua de 10 litros es fácil de usar y proporciona agua fresca en todo momento.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Historial de precios */}
            <Paper elevation={4}  sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6" gutterBottom>Historial de Precios</Typography>
                <Line data={priceHistoryData} options={priceHistoryOptions} height={100} width={400} />
            </Paper>

            {/* Comparación con productos similares */}
            <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 6, mt: 12 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Compara con otros productos similares
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, mb: 4 }}>
                    {[producto, ...similarProducts].map((prod, index) => (
                        <Card key={index} sx={{ width: 200, boxShadow: 3, textAlign: 'center' }}>
                            <CardMedia
                                component="img"
                                height="150"
                                image={prod.imagenUrl || placeholderImage}
                                alt={prod.nombre}
                                sx={{ objectFit: 'contain', margin: 'auto' }}
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

             {/* Productos Relacionados */}
            <Box
                sx={{
                    mt: 4,
                    mb: 2,
                    p: 2,
                    border: '1px solid #ddd', // Borde para distinguir la sección
                    borderRadius: 2,
                    position: 'relative',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Typography variant="h6" gutterBottom>Productos Relacionados</Typography>
                <Slider
                    {...settings}
                    arrows
                    prevArrow={<IconButton sx={{ fontSize: 30, position: 'absolute', left: 10, top: '40%', zIndex: 10 }}>{"<"}</IconButton>}
                    nextArrow={<IconButton sx={{ fontSize: 30, position: 'absolute', right: 10, top: '40%', zIndex: 10 }}>{">"}</IconButton>}
                >
                    {relatedProducts.map((related, index) => (
                        <Box key={index} sx={{ px: 1, mb: 2 }}> {/* Añadir padding horizontal entre las tarjetas */}
                            <Link to={`/product/${related._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Enlace al ProductDetails.js con el ID */}
                            <Card
                                sx={{
                                        width: 200,
                                    boxShadow: 3,
                                    textAlign: 'left',
                                    borderRadius: 2,
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                        cursor: 'pointer', // Cambia el cursor a pointer para indicar que es clickeable
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={related.imagenUrl || placeholderImage}
                                    alt={related.nombre}
                                    sx={{
                                        width: '100%',
                                        height: 160,
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        mb: 1,
                                    }}
                                />
                                <CardContent sx={{ padding: '10px' }}>
                                        {/* Precio y Descuento */}
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>
                                        ${related.precio_actual?.toLocaleString('es-CL')}
                                    </Typography>
                                        {related.descuento && (
                                            <Typography variant="body2" sx={{ color: '#ff0000', textDecoration: 'line-through' }}>
                                                ${related.precio_original?.toLocaleString('es-CL')}
                                            </Typography>
                                        )}
                                        {related.descuento && (
                                            <Typography variant="body2" sx={{ color: '#00a650', fontWeight: 'bold' }}>
                                                {related.descuento}% OFF
                                            </Typography>
                                        )}
                                        
                                        {/* Detalle adicional como cuotas */}
                                        <Typography variant="body2" sx={{ color: '#00a650' }}>
                                            6 cuotas de ${(related.precio_actual / 6).toLocaleString('es-CL')} sin interés
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#007aff' }}>
                                            Envío gratis por ser tu primera compra
                                        </Typography>
                                        
                                        {/* Nombre del producto */}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1 }}>
                                        {related.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {related.descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
                            </Link>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Container>
    );
}

export default ProductDetails;
