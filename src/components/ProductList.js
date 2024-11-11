// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import Slider from "react-slick"; // Importa react-slick
import CloseIcon from '@mui/icons-material/Close';


// Datos de categorías y marcas
export const categorias = [
    { nombre: 'Frenos', imageUrl: 'https://img.freepik.com/fotos-premium/sistema-frenos-disco-freno-coche-pinza-aislado-sobre-fondo-blanco_708636-433.jpg' },
    { nombre: 'Motor', imageUrl: '	https://as1.ftcdn.net/v2/jpg/08/88/36/22/1000_F_888362297_gmDqHowGPe4Luk8CI7TOr3jYKG4ognSB.jpg' },
    { nombre: 'Eléctrico', imageUrl: 'https://as1.ftcdn.net/v2/jpg/08/60/45/44/1000_F_860454407_7v24BykanIJYmRR2WTARPrlfWjOqOLCs.jpg' },
    { nombre: 'Suspensión', imageUrl: 'https://as2.ftcdn.net/v2/jpg/01/29/37/69/1000_F_129376964_8yGskWA0GxqOTjn9jmf0EzXjEAHDdPhb.jpg' },
    { nombre: 'Transmisión', imageUrl: '	https://as1.ftcdn.net/v2/jpg/04/59/19/90/1000_F_459199042_8SRpQjSsz5RGyutk0ZM0nscM0lKYPkr5.jpg' },
    { nombre: 'Carrocería', imageUrl: 'https://as1.ftcdn.net/v2/jpg/00/12/33/76/1000_F_12337609_4LQkQteGlsfTQVpFUTAcdFCSLQOI9io3.jpg' },
    { nombre: 'Refrigeración', imageUrl: 'https://as2.ftcdn.net/v2/jpg/04/57/25/23/1000_F_457252397_P79Knbn6ueRcv4wOwnJHbeUkfYg7iaCf.jpg' },
    { nombre: 'Escape', imageUrl: '	https://img.freepik.com/vector-premium/silenciador-pieza-coche-tubo-escape-vector_272963-322.jpg' },

    // Más categorías...
];

export const marcas = [
    { nombre: 'Toyota', imageUrl: 'https://www.diariomotor.com/imagenes/2022/11/logo-de-toyota-6376f7ae393e5-1280x720.webp' },
    { nombre: 'jeep', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeiVT1uEyXq3jvQ2NsqR5rqpZc-e4tO-mOoQ&s' },
    { nombre: 'Chevrolet', imageUrl: 'https://www.shutterstock.com/image-vector/chattogram-bangladesh-may-29-2023-600nw-2309781029.jpg' },
    { nombre: 'Honda', imageUrl: 'https://thumbs.dreamstime.com/b/logotipo-del-vecto…-imprimir-viajes-y-autom%C3%B3viles-183281772.jpg' },
    { nombre: 'Ford', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Nissan', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Volkswagen', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Hyundai', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'BMW', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Audi', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },

    // Más marcas...
];

function ProductList() {
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(1);
    const productsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    // Configuración del carrusel
    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
    };

    // Función para redirigir a CategoryPage con el nombre de la categoría
    const handleCategoriaClick = (nombreCategoria) => {
        navigate(`/categoria/${nombreCategoria}`);
    };

    // Función para redirigir a CategoryPage con el nombre de la marca
    const handleMarcaClick = (nombreMarca) => {
        navigate(`/marca/${nombreMarca}`);
    };

    const handleChangePage = (event, value) => setPage(value);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                AutosAnalítica
            </Typography>

            {/* Sección de Categorías */}
            <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 3, mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                    Top Categories
                </Typography>
                <Slider {...carouselSettings}>
                    {categorias.map((categoria, index) => (
                        <Box key={index} sx={{ p: 1 }}>
                        <Card 
                            onClick={() => handleCategoriaClick(categoria.nombre)} 
                            sx={{ cursor: 'pointer', height: 250, width: 200 }}  
                            
                        >
                            {/* Tamaño uniforme para todas las tarjetas */}
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={categoria.imageUrl}
                                    alt={categoria.nombre}
                                    sx={{
                                        objectFit: 'contain',  // Ajusta la imagen sin recortarla
                                        width: '100%',         // Asegura que ocupe el ancho completo del CardMedia
                                        height: '180px',       // Altura fija para todas las imágenes
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1">{categoria.nombre}</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Sección de Marcas */}
            <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 3, mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                    Marcas
                </Typography>
                <Slider {...carouselSettings}>
                    {marcas.map((marca, index) => (
                        <Box key={index} sx={{ p: 1, width: 200 }}>  
                            {/* Establece un ancho fijo para las tarjetas */}
                            <Card 
                                onClick={() => handleMarcaClick(marca.nombre)} 
                                sx={{p: 1, cursor: 'pointer', height: 250, width: 200 }}  
                            >
                                <CardMedia
                                    component="img"
                                    height="150"
                                    image={marca.imageUrl}
                                    alt={marca.nombre}
                                    sx={{
                                        objectFit: 'contain',  // Ajusta la imagen sin recortarla
                                        width: '100%',         // Asegura que ocupe el ancho completo del CardMedia
                                        height: '150px',       // Altura fija para todas las imágenes
                                    }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1">{marca.nombre}</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Lista de Productos */}
            <Typography variant="h4" gutterBottom>Productos</Typography>
            <Grid container spacing={2}>
                {productos.slice((page - 1) * productsPerPage, page * productsPerPage).map((producto, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardMedia component="img" height="150" image={producto.imagenUrl || 'https://via.placeholder.com/200'} alt={producto.nombre} />
                            <CardContent>
                                <Typography variant="h6">{producto.nombre}</Typography>
                                <Typography variant="body2">Marca: {producto.marca}</Typography>
                                <Typography variant="body2">Precio: ${producto.precio_actual}</Typography>
                                <Button variant="contained" href={`/detalle/${producto._id}`}>
                                    Ver detalles
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil(productos.length / productsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Container>
    );
}

export default ProductList;
