// src/components/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent,Checkbox, Box, Select, MenuItem, FormControl, InputLabel, Button, Pagination, Paper, Modal } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link
import config from '../config';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const query = useQuery();
    const searchTerm = query.get("q");
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(1);
    const productsPerPage = 20;
    const [sortOrder, setSortOrder] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [modelosDisponibles, setModelosDisponibles] = useState([]);
    const [marcas, setMarcas] = useState([]); // Lista de marcas disponibles
    const [compareMode, setCompareMode] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modelos, setModelos] = useState([]); // Lista de modelos específicos según la marca seleccionada
    const { categoryName = '' } = useParams(); // Inicializa categoryName como cadena vacía si está indefinido
    const location = useLocation();

    // Llama a applyFilters cada vez que cambie un filtro
    useEffect(() => {
        applyFilters();
    }, [searchTerm, brandFilter, modelFilter, discountFilter, storeFilter, categoryFilter, sortOrder]);
    

    const fetchProducts = () => {
        setErrorMessage(null); // Reiniciar el error antes de hacer una nueva solicitud
        axios.get(`${config.apiBaseUrl}/buscar-similares`, {
            params: {
                nombre: searchTerm, // Solo aplicar la búsqueda en el nombre
                marca: brandFilter || undefined,
                //modelo: modelFilter || undefined,
                categoria: categoryFilter || undefined,
                descuento: discountFilter || undefined,
                tienda: storeFilter || undefined
            }
        })
        .then(response => {
            console.log("Productos recibidos:", response.data);
            setProductos(response.data);
            if (response.data.length === 0) {
                setErrorMessage("No se encontraron productos que coincidan con la búsqueda.");
            }
        })
        .catch(error => {
            console.error("Error al obtener productos:", error);
            setErrorMessage(error.response?.data?.message || "Error al obtener productos de la API.");
        });
    };
    
    const handlePageChange = (event, value) => setPage(value);

    //Función para restablecer filtros
    const resetFilters = () => {
        setBrandFilter('');
        setModelFilter('');
        setDiscountFilter('');
        setStoreFilter('');
        setCategoryFilter('');
        setSortOrder('');
        setErrorMessage(null);
        
        // Llama a la función inicial de carga de productos basada en la categoría o marca en la URL
        fetchInitialProducts();
    };

    const fetchInitialProducts = () => {
        if (location.pathname.includes('/marca/')) {
            fetchProductosPorMarca(categoryName); // Si es búsqueda por marca
        } else if (location.pathname.includes('/categoria/')) {
            setCategoryFilter(categoryName); // Configura el filtro de categoría inicial
            fetchProductosPorCategoria(categoryName); // Si es búsqueda por categoría
        } else {
            applyFilters(); // Aplica los filtros en cualquier otro caso
        }
    };
    
    const fetchProductosPorMarca = async (nombreMarca) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/productos/marca`, { params: { nombre: nombreMarca } });
            setProductos(response.data);
            if (response.data.length === 0) {
                setErrorMessage("No se encontraron productos para la marca seleccionada.");
                setProductos([]); // Limpia los productos si la respuesta está vacía
            } else {
                setErrorMessage(null); // Limpia cualquier mensaje de error si hay resultados
                setProductos(response.data);
            }
        } catch (error) {
            console.error("Error al obtener productos por marca:", error);
            setErrorMessage("Hubo un error al obtener los productos por marca. Por favor, intenta de nuevo.");
        }
    };

    const fetchProductosPorCategoria = async (nombreCategoria) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/productos/categoria`, {
                params: {
                    categoria: nombreCategoria,
                    marca: brandFilter || undefined,
                    modelo: modelFilter || undefined,
                    descuento: discountFilter || undefined,
                    tienda: storeFilter || undefined,
                },
            });
            if (response.data.length === 0) {
                setErrorMessage("No se encontraron productos en esta categoría.");
                setProductos([]); // Limpia los productos si la respuesta está vacía
            } else {
                setErrorMessage(null); // Limpia cualquier mensaje de error si hay resultados
                setProductos(response.data);
            }
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos por categoría:", error);
            setErrorMessage("No se encontraron productos en esta categoría.");
        }
    };

    const handleBrandChange = async (event) => {
        const selectedBrand = event.target.value;
        setBrandFilter(selectedBrand);
        setBrandFilter(selectedBrand);
        setModelFilter(''); // Reinicia el filtro de modelo cuando cambia la marca
        fetchModelosPorMarca(selectedBrand); // Carga los modelos basados en la marca seleccionada
        applyFilters(); // Aplica los filtros después de seleccionar la marca
        // Llama a la API para obtener los modelos de la marca seleccionada
        if (selectedBrand) {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/productos/modelos`, {
                    params: { marca: selectedBrand }
                });
                setModelosDisponibles(response.data); // Actualizar la lista de modelos disponibles
            } catch (error) {
                console.error("Error al obtener modelos:", error);
                setModelosDisponibles([]); // Limpiar modelos en caso de error
            }
        } else {
            setModelosDisponibles([]); // Limpiar modelos si no hay marca seleccionada
        }
    
        applyFilters(); // Aplicar filtros después de seleccionar la marca
    };
    
    
    const handleModelChange = (event) => {
        setModelFilter(event.target.value);
        applyFilters(); // Llama a applyFilters después de actualizar el filtro de modelo
    };
    
    const handleDiscountChange = (event) => {
        setDiscountFilter(event.target.value);
        applyFilters(); // Llama a applyFilters después de actualizar el filtro de descuento
    };
    
    const handleStoreChange = (event) => {
        setStoreFilter(event.target.value);
        applyFilters(); // Llama a applyFilters después de actualizar el filtro de tienda
    };
    
    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
        applyFilters(); // Llama a applyFilters después de actualizar el filtro de categoría
    };
    
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        applyFilters(); // Llama a applyFilters después de actualizar el orden
    };
    
    const fetchModelosPorMarca = async (marca) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/productos/modelos`, { params: { marca } });
            
            // Filtra los modelos únicos
            const modelosUnicos = [...new Set(response.data.map((producto) => producto.modelo))];
            
            setModelosDisponibles(modelosUnicos); // Establece los modelos disponibles
        } catch (error) {
            console.error("Error al obtener modelos:", error);
            setModelosDisponibles([]); // En caso de error, establece modelos como vacío
        }
    };
    
    const handleShowComparison = () => {
        if (selectedProducts.length >= 2) {
            setOpenModal(true);
        } else {
            alert("Selecciona al menos 2 productos para comparar.");
        }
    };
    const paginatedProducts = productos.slice((page - 1) * productsPerPage, page * productsPerPage);

    const handleCompareToggle = () => {
        setCompareMode(!compareMode);
        setSelectedProducts([]);
    };
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSelectProduct = (producto) => {
        if (selectedProducts.includes(producto)) {
            setSelectedProducts(selectedProducts.filter((p) => p !== producto));
        } else if (selectedProducts.length < 3) {
            setSelectedProducts([...selectedProducts, producto]);
        } else {
            alert("Solo puedes comparar hasta 3 productos.");
        }
    };

    const applyFilters = () => {
        setErrorMessage(null); // Reiniciar el mensaje de error antes de aplicar filtros

        const params = {
            nombre: searchTerm,
            marca: brandFilter || undefined,
            modelo: modelFilter || undefined,
            categoria: categoryFilter || undefined,
            descuento: discountFilter || undefined,
            tienda: storeFilter || undefined,
            sortOrder: sortOrder || undefined,
        };
    
        console.log("Aplicando filtros:", params); // Verifica los filtros en la consola
        fetchProducts(params); // Envía los filtros a fetchProducts    };
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#003366', fontWeight: 'bold' }}>
                Results for "{searchTerm}"
            </Typography>



            <Grid container spacing={3}>
                
                {/* Filtro en el lado izquierdo */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                        {/* Encabezado de Filtros con enlace para limpiar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Filtros</Typography>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={resetFilters}
                            >
                                Limpiar Filtros
                            </Typography>
                        </Box>

                        {/* Filtro por Marca */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Marca</InputLabel>
                            <Select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)} label="Marca">
                            <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}
                            {marcas && marcas.length > 0 && marcas.map((marca, index) => (
                                <MenuItem key={index} value={marca}>{marca}</MenuItem>
                            ))}                                
                                <MenuItem value="Toyota">Toyota</MenuItem>
                                <MenuItem value="jeep">Jeep</MenuItem>
                                <MenuItem value="Chevrolet">Chevrolet</MenuItem>
                                <MenuItem value="Honda">Honda</MenuItem>
                                <MenuItem value="Ford">Ford</MenuItem>
                                <MenuItem value="Nissan">Nissan</MenuItem>
                                <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                                <MenuItem value="Hyundai">Hyundai</MenuItem>
                                <MenuItem value="BMW">BMW</MenuItem>
                                <MenuItem value="Audi">Audi</MenuItem>
                                {/* Agrega más marcas aquí */}

                            </Select>
                        </FormControl>

                        {/* Filtro por Modelo */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Modelo</InputLabel>
                            <Select value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} label="Modelo">
                            <MenuItem value="">Ninguno</MenuItem> {/* Opción para limpiar el filtro */}
                            {modelosDisponibles.map((modelo, index) => (
                                <MenuItem key={index} value={modelo}>{modelo}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>


                        {/* Filtro por Descuento */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Descuento</InputLabel>
                            <Select value={discountFilter} onChange={handleDiscountChange} label="Descuento">
                                <MenuItem value={10}>10% o más</MenuItem>
                                <MenuItem value={20}>20% o más</MenuItem>
                                <MenuItem value={30}>30% o más</MenuItem>
                                {/* Agrega más niveles de descuento aquí */}
                                <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}

                            </Select>
                        </FormControl>

                        {/* Filtro por Tienda */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tienda</InputLabel>
                            <Select value={storeFilter} onChange={handleStoreChange} label="Tienda">
                                <MenuItem value="Paris">Paris</MenuItem>
                                <MenuItem value="Falabella">Falabella</MenuItem>
                                <MenuItem value="">Ninguno</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Filtro por Categoría */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoría</InputLabel>
                            <Select value={categoryFilter} onChange={handleCategoryChange} label="Categoría">
                            <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}
                                <MenuItem value="Frenos">Frenos</MenuItem>
                                <MenuItem value="Motor">Motor</MenuItem>
                                <MenuItem value="Eléctrico">Eléctrico</MenuItem>
                                <MenuItem value="Suspensión">Suspensión</MenuItem>
                                <MenuItem value="Transmisión">Transmisión</MenuItem>
                                <MenuItem value="Carrocería">Carrocería</MenuItem>
                                <MenuItem value="Refrigeración">Refrigeración</MenuItem>
                                <MenuItem value="Escape">Escape</MenuItem>


                            </Select>
                        </FormControl>
                        {/* Botón de comparar o mostrar comparación */}
                        {compareMode ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleShowComparison}
                                disabled={selectedProducts.length < 2} // Habilita el botón si hay al menos 2 productos seleccionados
                            >
                                Mostrar Comparación
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleCompareToggle}
                            >
                                Comparar productos
                            </Button>
                        )}

                        {/* Enlace para cancelar comparación */}
                        {compareMode && (
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ mt: 1, cursor: 'pointer', textDecoration: 'underline', textAlign: 'center' }}
                                onClick={handleCompareToggle}
                            >
                                Cancelar comparación
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Columna de productos y ordenación */}
                <Grid item xs={12} md={9}>      
                    {errorMessage ? (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="error">
                                {errorMessage}
                            </Typography>
                        </Box>
                    ) : (
                    <>
                    {/* Listado de productos */}
                    <Grid container spacing={3}>
                        {productos.length > 0 ? (
                            paginatedProducts.map((producto) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={producto._id}>
                                    <Card
                                        sx={{
                                            bgcolor: '#f9f9f9',
                                            maxWidth: 300,
                                            boxShadow: selectedProducts.includes(producto) ? '0 0 0 3px #1976d2' : 3,
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                        onClick={() => !compareMode && navigate(`/product/${producto._id}`)}
                                    >
                                        {compareMode && (
                                        <Checkbox
                                                checked={selectedProducts.includes(producto)}
                                                onChange={() => handleSelectProduct(producto)}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'select to compare' }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
                                                    borderRadius: '50%', // Checkbox circular
                                                    boxShadow: 1, // Sombra para destacar el checkbox
                                                    '&.Mui-checked': {
                                                        color: '#1976d2', // Color al estar seleccionado
                                                    },
                                                }}
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
                                                ${producto.precio_actual}
                                            </Typography>
                                            <Typography variant="body2">{producto.marca}</Typography>
                                            <Typography variant="body2">Categoria: {producto.categoria}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ mt: 2 }}>No se encontraron productos</Typography>
                        )}
                    </Grid>

    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={Math.ceil(productos.length / productsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                    </>
                     )}
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
                                    <Box
                                        sx={{
                                            height: 150, // Altura fija para el área de la imagen
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 2,
                                            backgroundColor: '#f2f2f2', // Color de fondo para diferenciar el espacio reservado
                                        }}
                                    >
                                        {producto.imagenUrl ? (
                                            <CardMedia
                                                component="img"
                                                height="100%" // Ajusta la altura de la imagen dentro del contenedor
                                                image={producto.imagenUrl}
                                                alt={producto.nombre}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Imagen no disponible</Typography>
                                        )}
                                    </Box>
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

export default SearchResults;
