// src/components/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Select, MenuItem, FormControl, InputLabel, Pagination, Paper, Checkbox, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link
import { Breadcrumbs } from '@mui/material';


function CategoryPage() {
    const { categoryName, filterType } = useParams(); // Usar filterType para distinguir entre 'categoria' y 'marca'
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(1);
    const productsPerPage = 20;
    const [sortOrder, setSortOrder] = useState('');
    const [filter, setFilter] = useState('');
    const [compareMode, setCompareMode] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();

    const [brandFilter, setBrandFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('');
    const [storeFilter, setStoreFilter] = useState('');

    const handleBrandChange = (event) => setBrandFilter(event.target.value);
    const handleModelChange = (event) => setModelFilter(event.target.value);
    const handleDiscountChange = (event) => setDiscountFilter(event.target.value);
    const handleStoreChange = (event) => setStoreFilter(event.target.value);
    
    
    useEffect(() => {
        // Si la ruta incluye '/marca/', configura el filtro de marca y llama a la función de búsqueda por marca
        if (location.pathname.includes('/marca/')) {
            setBrandFilter(categoryName); // Configura el filtro de marca
            fetchProductosPorMarca(categoryName);
        } else {
            // Si es una categoría, configura el filtro de categoría y llama a la función de búsqueda por categoría
            setFilter(categoryName); // Configura el filtro de categoría
            fetchProductosPorCategoria(categoryName);
        }
    }, [categoryName, filterType]);
    

    
    const fetchProducts = () => {
        axios.get(`http://localhost:3000/api/productos`, {
            params: {
                [filterType]: categoryName, // Parámetro dinámico para buscar por categoría o marca
                filter: filter,
                sortOrder: sortOrder
            }
        })
        .then(response => setProductos(response.data))
        .catch(error => console.error("Error al obtener productos:", error));
    };



    const fetchProductosPorMarca = async (nombreMarca) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/productos/marca`, { params: { nombre: nombreMarca } });
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos por marca:", error);
        }
    };

    const fetchProductosPorCategoria = async (nombreCategoria) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/productos/categoria`, { params: { categoria: nombreCategoria } });
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos por categoría:", error);
        }
    };

    const handlePageChange = (event, value) => setPage(value);
    const handleSortChange = (event) => setSortOrder(event.target.value);
    const handleFilterChange = (event) => setFilter(event.target.value);

    const handleCompareToggle = () => {
        setCompareMode(!compareMode);
        setSelectedProducts([]);
    };

    const handleSelectProduct = (producto) => {
        if (selectedProducts.includes(producto)) {
            setSelectedProducts(selectedProducts.filter((p) => p !== producto));
        } else if (selectedProducts.length < 3) {
            setSelectedProducts([...selectedProducts, producto]);
        } else {
            alert("Solo puedes comparar hasta 3 productos.");
        }
    };

    const handleShowComparison = () => {
        if (selectedProducts.length === 3) {
            setOpenModal(true);
        } else {
            alert("Selecciona 3 productos para comparar.");
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const paginatedProducts = productos.slice((page - 1) * productsPerPage, page * productsPerPage);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#003366', fontWeight: 'bold' }}>
                {categoryName} Products
            </Typography>
    
            {/* Breadcrumbs para navegación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/">Inicio</Link>
                    <Link color="inherit" href="/electro-linea-blanca">Electro y Línea Blanca</Link>
                    <Link color="inherit" href="/electrodomesticos">Electrodomésticos</Link>
                    <Typography color="text.primary">Dispensadores de Agua y Filtros</Typography>
                </Breadcrumbs>

                {/* Ordenar por al mismo nivel que Breadcrumbs */}
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

    
            {/* Contenedor en dos columnas para filtros y productos */}
            <Grid container spacing={3}>
                {/* Columna de filtros */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Filtros</Typography>

                        {/* Filtro por marca */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Marca</InputLabel>
                            <Select value={brandFilter} onChange={handleBrandChange} label="Marca">
                                <MenuItem value="Toyota">Toyota</MenuItem>
                                <MenuItem value="Honda">Honda</MenuItem>
                                {/* Agrega más marcas aquí */}
                            </Select>
                        </FormControl>
                        
                        {/* Filtro por modelo */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Modelo</InputLabel>
                            <Select value={modelFilter} onChange={handleModelChange} label="Modelo">
                                <MenuItem value="Corolla">Corolla</MenuItem>
                                <MenuItem value="Civic">Civic</MenuItem>
                                {/* Agrega más modelos aquí */}
                            </Select>
                        </FormControl>
    
                        {/* Filtro por descuento */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Descuento</InputLabel>
                            <Select value={discountFilter} onChange={handleDiscountChange} label="Descuento">
                                <MenuItem value={10}>10% o más</MenuItem>
                                <MenuItem value={20}>20% o más</MenuItem>
                                <MenuItem value={30}>30% o más</MenuItem>
                                {/* Agrega más niveles de descuento aquí */}
                            </Select>
                        </FormControl>
    
                        {/* Filtro por tienda */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tienda</InputLabel>
                            <Select value={storeFilter} onChange={handleStoreChange} label="Tienda">
                                <MenuItem value="Paris">Paris</MenuItem>
                                <MenuItem value="Falabella">Falabella</MenuItem>
                                {/* Agrega más tiendas aquí */}
                            </Select>
                        </FormControl>
    
                        {/* Filtro de stock */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Filtrar por stock</InputLabel>
                            <Select value={filter} onChange={handleFilterChange} label="Filtrar por stock">
                                <MenuItem value="inStock">En Stock</MenuItem>
                                <MenuItem value="outOfStock">Agotado</MenuItem>
                            </Select>
                        </FormControl>
    
                        {/* Botón de comparar */}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleCompareToggle}
                        >
                            {compareMode ? "Cancelar Comparación" : "Comparar"}
                        </Button>
    
                        {compareMode && (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleShowComparison}
                                disabled={selectedProducts.length !== 3}
                            >
                                Mostrar Comparación
                            </Button>
                        )}
                    </Paper>
                </Grid>
    
                {/* Columna de productos y ordenación */}
                <Grid item xs={12} md={9}>        
                    {/* Listado de productos */}
                    <Grid container spacing={3}>
                        {paginatedProducts.map((producto) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={producto._id}>
                                <Card
                                    sx={{
                                        bgcolor: '#f9f9f9',
                                        maxWidth: 300,
                                        boxShadow: 3,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                    onClick={() => !compareMode && navigate(`/product/${producto._id}`)}
                                >
                                    {compareMode && (
                                        <Checkbox
                                            checked={selectedProducts.includes(producto)}
                                            onChange={() => handleSelectProduct(producto)}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'select to compare' }}
                                        />
                                    )}
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
                                            ${producto.precio}
                                        </Typography>
                                        <Typography variant="body2" >
                                            {producto.marca}
                                        </Typography>
                                        <Typography variant="body2" >
                                            Categoria: {producto.categoria}
                                        </Typography>
                                    </CardContent>
                                </Card>
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
            
            {/* Modal de comparación */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, width: '80%', maxWidth: 800
                }}>
                    <Typography variant="h6" gutterBottom>Comparación de Productos</Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {selectedProducts.map((producto, index) => (
                            <Grid item xs={12} sm={4} key={index} gutterBottom>
                                <Card 
                                    sx={{ boxShadow: 3, p: 2, textAlign: 'center', height: '100%', cursor: 'pointer' }}
                                    onClick={() => navigate(`/product/${producto._id}`)}
                                >   
                                    <Typography> IMAGEN </Typography>
                                    <Typography variant="h6">{producto.nombre || "-"}</Typography>
                                    <Typography>Precio: {producto.precio_actual ? producto.precio_actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : "-"}</Typography>
                                    <Typography>Marca: {producto.marca || "-"}</Typography>
                                    <Typography>Descuento: {producto.descuento || "-"}</Typography>
                                    <Typography>Tienda: {producto.descuento || "-"}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Button onClick={handleCloseModal} variant="contained" color="secondary" sx={{ mt: 2 }}>
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
    
}

export default CategoryPage;
