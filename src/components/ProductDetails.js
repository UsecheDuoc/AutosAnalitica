import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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

    const handlePurchase = (link) => {
        if (link) {
            window.open(link, "_blank");
        } else {
            alert("El enlace de compra no está disponible.");
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
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        nextArrow: <Arrow icon={"›"} />,
        prevArrow: <Arrow icon={"‹"} />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    

    const priceHistoryOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Precio: $${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Precio ($)',
                },
                beginAtZero: false,
            },
        },
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
            <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 2, mt: 4 }}>
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
            <Box sx={{ mt: 4, justifyContent: 'flex-end', gap: 6, mb: 2  }}>
                <Typography variant="h6" gutterBottom>Productos Relacionados</Typography>
                <Slider {...settings}>
                    {relatedProducts.map((related, index) => (
                        <Card key={index} sx={{ width: 200, boxShadow: 3,gap: 6, textAlign: 'center' }}>

                            
                            <CardMedia
                                component="img"
                                image={related.imagenUrl || placeholderImage}
                                alt={related.nombre}
                                sx={{
                                    width: '100%',
                                    height: 150,  // Ajusta la altura para que todas las imágenes sean del mismo tamaño
                                    objectFit: 'cover',  // Hace que la imagen cubra el espacio sin distorsionarse
                                    borderRadius: 4,

                                }}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{related.nombre}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Precio: ${related.precio_actual?.toLocaleString('es-CL')}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Slider>


            </Box>
        </Container>
    );
}

export default ProductDetails;
