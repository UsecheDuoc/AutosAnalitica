// src/components/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Select, MenuItem, FormControl, InputLabel, Pagination, Paper, Checkbox, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link
import { Breadcrumbs } from '@mui/material';
import config from '../config';

// Función para capitalizar las rutas (opcional)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function CategoryPage() {
    const { categoryName = '' } = useParams(); // Inicializa categoryName como cadena vacía si está indefinido
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
    const [marcas, setMarcas] = useState([]); // Lista de marcas disponibles
    const [modelos, setModelos] = useState([]); // Lista de modelos específicos según la marca seleccionada
    const [categoryFilter, setCategoryFilter] = useState(''); // Nuevo estado para manejar la categoría seleccionada
    const [errorMessage, setErrorMessage] = useState(null);
    const [modelosDisponibles, setModelosDisponibles] = useState([]);
    
    //NUEVO
    const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setBrandFilter(selectedBrand);
        setModelFilter(''); // Reiniciar el modelo cuando cambia la marca
        fetchModelosPorMarca(selectedBrand); // Cargar modelos según la marca seleccionada
        applyFilters(); // Aplicar filtros después de seleccionar la marca
    };
    
    const handleModelChange = (event) => {
        setModelFilter(event.target.value);
        applyFilters(); // Llamar a `applyFilters` cada vez que cambie el filtro de modelo
    };
    const handleDiscountChange = (event) => setDiscountFilter(event.target.value);
    const handleStoreChange = (event) => setStoreFilter(event.target.value);
    // Estado adicional para el filtro de categoría

    // Función para manejar el cambio de categoría en el filtro
    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);  // Actualiza el estado local con la nueva categoría seleccionada
    };


    // Nueva función para manejar la carga de modelos basados en la marca seleccionada
    const fetchModelosPorMarca = async (marca) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/modelos`, { params: { marca } });
            setModelosDisponibles(response.data); // Cargar los modelos disponibles para la marca seleccionada
        } catch (error) {
            console.error("Error al obtener modelos:", error);
            setModelosDisponibles([]); // En caso de error, establecer modelos como vacío
        }
    };
    
    //const handleBrandChange = (event) => setBrandFilter(event.target.value);
    //const handleModelChange = (event) => setModelFilter(event.target.value);
    //const handleDiscountChange = (event) => setDiscountFilter(event.target.value);
    //const handleStoreChange = (event) => setStoreFilter(event.target.value);

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
    
    
    // useEffect para la carga inicial basada en la URL (marca o categoría)
    useEffect(() => {
        setBrandFilter('');  // Limpiar filtro de marca
        setModelFilter('');  // Limpiar filtro de modelo
        setDiscountFilter('');  // Limpiar filtro de descuento
        setStoreFilter('');  // Limpiar filtro de tienda
        setCategoryFilter('');  // Limpiar filtro de categoría
    
        if (location.pathname.includes('/marca/')) {
            setBrandFilter(categoryName); // Configura el filtro de marca inicial
            fetchProductosPorMarca(categoryName); // Búsqueda inicial por marca
        } else if (location.pathname.includes('/categoria/')) {
            setCategoryFilter(categoryName); // Configura el filtro de categoría inicial
            fetchProductosPorCategoria(categoryName); // Búsqueda inicial por categoría
        }
    }, [categoryName, location.pathname]);

    // useEffect para aplicar filtros cuando se cambian
    useEffect(() => {
        if (brandFilter || modelFilter || discountFilter || storeFilter || filter || sortOrder) {
            applyFilters();  // Aplica los filtros activos
        }
    }, [brandFilter, modelFilter, discountFilter, storeFilter, filter, sortOrder]);
    
    // useEffect para cargar los modelos basados en la marca seleccionada
    useEffect(() => {
        if (brandFilter) {
            fetchModelosPorMarca(brandFilter);  // Cargar modelos si hay una marca seleccionada
        } else {
            setModelos([]);  // Limpiar modelos si no hay marca seleccionada
        }
    }, [brandFilter]);
    
    useEffect(() => {
        if (categoryFilter || brandFilter || modelFilter || discountFilter || storeFilter || sortOrder) {
            applyFilters();  // Aplica los filtros automáticamente cuando cambia `categoryFilter`
        }
    }, [categoryFilter, brandFilter, modelFilter, discountFilter, storeFilter, sortOrder]);
    
    const pathnames = location.pathname.split('/').filter((x) => x);

    
    
    //CODIGO NUEVO
    const fetchProducts = () => {
        // Determinar si se está haciendo una búsqueda por marca o por categoría
        const searchType = location.pathname.includes('/marca/') ? 'marca' : 'categoria';
    
        axios.get(`${config.apiBaseUrl}`, {
            params: {
                [searchType]: categoryName, // Buscar por categoría o marca, según corresponda
                marca: brandFilter || undefined,
                modelo: modelFilter || undefined,
                descuento: discountFilter || undefined,
                tienda: storeFilter || undefined,
                sortOrder: sortOrder || undefined,
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
    
    const applyFilters = () => {
        axios.get(`${config.apiBaseUrl}`, {
            params: {
                categoria: categoryFilter || undefined,
                marca: brandFilter || undefined,
                modelo: modelFilter || undefined,
                descuento: discountFilter || undefined,
                tienda: storeFilter || undefined,
            }
        })
        .then(response => {

            let productosOrdenados = response.data;

            // Aplica el orden en el front-end en caso de que la API no realice el ordenamiento
            if (sortOrder) {
                productosOrdenados = productosOrdenados.sort((a, b) => {
                    if (sortOrder === 'priceAsc') {
                        return a.precio_actual - b.precio_actual;
                    } else if (sortOrder === 'priceDesc') {
                        return b.precio_actual - a.precio_actual;
                    } else if (sortOrder === 'nameAsc') {
                        return a.nombre.localeCompare(b.nombre);
                    } else if (sortOrder === 'nameDesc') {
                        return b.nombre.localeCompare(a.nombre);
                    }
                    return 0;
                });
            }
            setProductos(productosOrdenados);


            if (response.data.length === 0) {
                setErrorMessage("No se encontraron productos para los filtros seleccionados.");
                setProductos([]); // Asegúrate de limpiar la lista de productos
            } else {
                setErrorMessage(null); // Limpia cualquier mensaje de error si hay resultados
                setProductos(response.data);
            }
        })
        .catch(error => {
            console.error("Error al aplicar filtros:", error);
            setErrorMessage("Hubo un error al obtener los productos. Por favor, intenta de nuevo.");
        });
    };
    
    
    
    
    
    
    
    
    
    //CODIGO ANTIGUO
     {/*const fetchProducts = () => {
        axios.get(`${config.apiBaseUrl}/productos/api/productos`, {
            params: {
                [filterType]: categoryName, // Parámetro dinámico para buscar por categoría o marca
                filter: filter,
                sortOrder: sortOrder
            }
        })
        .then(response => setProductos(response.data))
        .catch(error => console.error("Error al obtener productos:", error));
    };*/}


    const fetchProductosPorMarca = async (nombreMarca) => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/marca`, { params: { nombre: nombreMarca } });
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
            const response = await axios.get(`${config.apiBaseUrl}/categoria`, {
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
        if (selectedProducts.length >= 2) { // Permite 2 o 3 productos
            setOpenModal(true);
        } else {
            alert("Selecciona al menos 2 productos para comparar.");
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
            {/* Breadcrumbs dinámico para la navegación */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={(e) => {
                e.preventDefault();
                navigate('/');
            }}>
                Inicio
            </Link>            
            {brandFilter ? (
                // Si hay un filtro de marca activo, muestra la marca en el historial
                <Typography color="text.primary">Marca - {brandFilter}</Typography>
            ) : (
                // Si hay una categoría activa, muestra la categoría
                <Typography color="text.primary">Categoría - {categoryName}</Typography>
            )}
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

                        {/* Filtro por marca */}
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
                        
                        {/* Filtro por modelo */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Modelo</InputLabel>
                            <Select value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} label="Modelo">
                            <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}
                            {modelosDisponibles && modelosDisponibles.length > 0 && modelosDisponibles.map((modelo, index) => (
                                <MenuItem key={index} value={modelo}>{modelo}</MenuItem>
                            ))}
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
                                <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}
                                {modelosDisponibles.map((modelo) => (
                                    <MenuItem key={modelo} value={modelo}>{modelo}</MenuItem>
                                ))}
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
    
                        {/* Filtro de Categoria */}
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

                        {/*<Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={applyFilters} // Llama a la función solo al hacer clic
                        >
                            Aplicar Filtros
                        </Button>*/}

    
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
                        {paginatedProducts.map((producto) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={producto._id}>
                                <Card
                                sx={{
                                    bgcolor: '#f9f9f9',
                                    maxWidth: 300,
                                    boxShadow: selectedProducts.includes(producto) ? '0 0 0 3px #1976d2' : 3, // Contorno azul si está seleccionado
                                    position: 'relative', // Necesario para posicionar el checkbox

                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: 3,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)', // Mantiene el efecto de escala solo en hover
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

export default CategoryPage;
