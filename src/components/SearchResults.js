// src/components/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Select, MenuItem, FormControl, InputLabel, Pagination, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const query = useQuery();
    const searchTerm = query.get("q");
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null); // Estado para manejar el mensaje de error
    const [page, setPage] = useState(1);
    const productsPerPage = 20;
    const [sortOrder, setSortOrder] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, filter, sortOrder]);

    const fetchProducts = () => {
        setError(null); // Reiniciar el error antes de hacer una nueva solicitud
        axios.get(`http://localhost:3000/api/productos/buscar-similares`, {
            params: {
                nombre: searchTerm,
                filter: filter,
                sortOrder: sortOrder
            }
        })
        .then(response => {
            setProductos(response.data);
            if (response.data.length === 0) {
                setError("No se encontraron productos que coincidan con la búsqueda.");
            }
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
            setError(error.response?.data?.message || "Error al obtener productos de la API.");
        });
    };

    const handlePageChange = (event, value) => setPage(value);
    const handleSortChange = (event) => setSortOrder(event.target.value);
    const handleFilterChange = (event) => setFilter(event.target.value);

    const paginatedProducts = productos.slice((page - 1) * productsPerPage, page * productsPerPage);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#003366', fontWeight: 'bold' }}>
            Results for "{searchTerm}"
        </Typography>

        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
                {error}
            </Typography>
        )}

        <Grid container spacing={3}>
            {/* Filtro en el lado izquierdo */}
            <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Filtros</Typography>
                    <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Filtrar</InputLabel>
                        <Select value={filter} onChange={handleFilterChange} label="Filtrar">
                            <MenuItem value="inStock">En Stock</MenuItem>
                            <MenuItem value="outOfStock">Agotado</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>

            {/* Productos y Ordenación */}
            <Grid item xs={12} md={9}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                        <InputLabel>Ordenar por</InputLabel>
                        <Select value={sortOrder} onChange={handleSortChange} label="Ordenar por">
                            <MenuItem value="priceAsc">Precio: Menor a Mayor</MenuItem>
                            <MenuItem value="priceDesc">Precio: Mayor a Menor</MenuItem>
                            <MenuItem value="nameAsc">Nombre: A-Z</MenuItem>
                            <MenuItem value="nameDesc">Nombre: Z-A</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={3}>
                    {paginatedProducts.map((producto) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={producto._id}>
                            <Link to={`/product/${producto._id}`} style={{ textDecoration: 'none' }}>
                                <Card
                                    sx={{ bgcolor: '#f9f9f9', maxWidth: 300, boxShadow: 3, cursor: 'pointer' }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        width="200"
                                        image={producto.imagenUrl || 'https://via.placeholder.com/200'}
                                        alt={producto.nombre}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {producto.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {producto.descripcion}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mt: 1, color: '#003366' }}>
                                            ${producto.precio_actual}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(productos.length / productsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Grid>
        </Grid>
    </Container>
    );
}

export default SearchResults;
