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
    { nombre: 'Frenos', imageUrl: 'https://via.placeholder.com/200x150?text=Toyota' },
    { nombre: 'Motor', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Eléctrico', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Suspensión', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Transmisión', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Carrocería', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Refrigeración', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Escape', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },

    // Más categorías...
];

export const marcas = [
    { nombre: 'Toyota', imageUrl: 'https://via.placeholder.com/200x150?text=Toyota' },
    { nombre: 'jeep', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Chevrolet', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
    { nombre: 'Honda', imageUrl: 'https://via.placeholder.com/200x150?text=Honda' },
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
                            <Card onClick={() => handleCategoriaClick(categoria.nombre)} sx={{ cursor: 'pointer' }}>
                                <CardMedia component="img" height="150" image={categoria.imageUrl} alt={categoria.nombre} />
                                <CardContent>
                                    <Typography variant="subtitle1" textAlign="center">{categoria.nombre}</Typography>
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
                        <Box key={index} sx={{ p: 1 }}>
                            <Card onClick={() => handleMarcaClick(marca.nombre)} sx={{ cursor: 'pointer' }}>
                                <CardMedia component="img" height="150" image={marca.imageUrl} alt={marca.nombre} />
                                <CardContent>
                                    <Typography variant="subtitle1" textAlign="center">{marca.nombre}</Typography>
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
