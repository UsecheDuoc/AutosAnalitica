// src/components/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent,Checkbox, Box, Select, MenuItem, FormControl, InputLabel, Button, Pagination, Paper, Modal } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link
import config from '../config';
import { initialMarcas } from '../constants';
import { Breadcrumbs } from '@mui/material';
import { CATEGORIES } from "../constants";
import { fetchWithFallback } from "../utils/api"; //URL de utils en componentes principales
import { tienda } from "../constants";

function useQuery() {
    const location = useLocation(); // Obtenemos la ubicación actual
    console.log("URL completa:", location.pathname + location.search); // Mostramos la URL en la consola
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
    const [errorMessage, setErrorMessage] = useState(null); // Mensaje de error
    const [filtros, setFiltros] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Llama a applyFilters cada vez que cambie un filtro
    useEffect(() => {
        applyFilters();
    }, [searchTerm, brandFilter, modelFilter, discountFilter, storeFilter, categoryFilter, sortOrder]);
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
    
        const marca = queryParams.get('marca') || '';
        const modelo = queryParams.get('modelo') || '';
        const tienda = queryParams.get('empresa_procedencia') || '';
        const categoria = queryParams.get('categoria') || '';
        const nombre = queryParams.get("q") || "";

        // Actualiza los filtros solo si hay valores definidos
        setBrandFilter(nombre|| "");
        setBrandFilter(marca || "");
        setModelFilter(modelo || "");
        setStoreFilter(tienda || "");
        setCategoryFilter(categoria || "");

        applyFilters();
    }, [location.search]);


    //Importar las marcas desde mi constants.js
    useEffect(() => {
        setMarcas(initialMarcas);
    }, []);


    //Funcion QUE LLAMA A LA API CON LOS FILTROS QUE VIENEN DEL HOME O LA BUSQUEDA DE LA BARRA
    //NO MODIFICAR A MENOS QUE SEPA QUE HACE
    const fetchProducts = async (params) => {
        //setIsLoading(true); // Inicia el estado de carga

        if (!params.marca && !params.modelo && !params.categoria && !params.nombre) {
            console.log("No hay parámetros válidos para ejecutar fetchProducts.");
            setErrorMessage("Filtros vacíos. Por favor, ajusta tu búsqueda.");
            //setProductos([]); // Limpia productos si no hay filtros
            return;
        }
        try {

            console.log("Parámetros recibidos en FetchProducts desde apply:", params);

            
            setErrorMessage(null); // Reiniciar el error antes de hacer una nueva solicitud
            const productos = await fetchWithFallback(`/productos/buscar-similares?marca=${encodeURIComponent(params.marca || '')}&modelo=${encodeURIComponent(params.modelo || '')}&categoria=${encodeURIComponent(params.categoria || '')}&nombre=${encodeURIComponent(params.nombre || '')}&empresa_procedencia=${encodeURIComponent(params.tienda || '')}`
            );            
            setProductos(productos);
            console.log("Respuesta completa de la API:", productos);
            if (productos === 0) {
                setErrorMessage("No se encontraron productos que coincidan con la búsqueda.");
            }

    }   catch(error ) {
            console.error("Error al obtener productos:", error);
            setErrorMessage(error.response?.message || "No se encontraron productos que coincidan con la búsqueda.");
        
            
        };
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
        //setIsLoading(true); // Inicia el estado de carga

        try {
            const response = await fetchWithFallback(`/productos/marca`, { params: { nombre: nombreMarca } });
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
            const response = await fetchWithFallback(`/productos/categoria`, {
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
        setModelFilter(''); // Reinicia el filtro de modelo cuando cambia la marca
        fetchModelosPorMarca(selectedBrand); // Carga los modelos basados en la marca seleccionada
        // Llama a la API para obtener los modelos de la marca seleccionada
        if (selectedBrand) {
            try {
                const response = fetchWithFallback(`/productos/modelos`, { params: { marca: selectedBrand } });
                const modelos = response;
                setModelosDisponibles(modelos);
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
    
    const handleSortChange = (event) => setSortOrder(event.target.value);

    
    const fetchModelosPorMarca = async (marca) => {
        //setIsLoading(true); // Inicia el estado de carga

        try {
            if (!marca) {
                setModelosDisponibles([]);
                return;
            }
            const response = await fetchWithFallback(`/productos/modelos`, { params: { marca } });
            
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

    const applyFilters = () => {
        setErrorMessage(null); // Reiniciar el mensaje de error antes de aplicar filtros

        const params = {
            nombre: searchTerm|| undefined,
            marca: brandFilter || undefined,
            modelo: modelFilter || undefined,
            categoria: categoryFilter || undefined,
            descuento: discountFilter || undefined,
            tienda: storeFilter || undefined,
            sortOrder: sortOrder || undefined,
        };

        // Verifica si hay parámetros válidos
        if (!params.nombre && !params.marca && !params.modelo && !params.categoria) {
            console.log("Filtros inválidos o vacíos.");
            setProductos([]);
            //setErrorMessage("No se encontraron productos.");
            return;
        }
    
        console.log("Aplicando filtros en applyfilter en SearhcResults:", params); // Verifica los filtros en la consola

        if (location.pathname === "/search" || searchTerm || params.marca || params.categoria || params.modelo|| params.tienda) {
            fetchProducts(params); // Envía los filtros a fetchProducts
            console.log('Esto lo podro colocar? ', params)
        } else {
            console.log("No se ejecuta fetchProducts porque no hay parámetros relevantes.");
        }

    };


    const handleCloseModal = () => {
        setOpenModal(false);
    };

    //FUNCION QUE TOMA LOS LOGOS DE LA LISTA DE TIENDAS
    const getStoreLogo = (storeName) => {
        const tiendaLogos = [
            { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBd52oJwbk2yXum3Ons59Xs_nFeul7Z7kK7w&s', alt: 'RepuestosCoroca' },
            { src: 'https://http2.mlstatic.com/D_NQ_NP_790984-MLA78333190102_082024-F.jpg', alt: 'RepuestosMaraCars' },
            { src: 'https://repuestoscr.com.do/wp-content/uploads/sites/248/2022/05/logo.jpg', alt: 'RepuestosCYR' },
            { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvM45GeQwsnw244fJUIQHMVgWY776TF11X6w&s', alt: 'Bolomey' },
            { src: 'https://cdn.worldvectorlogo.com/logos/mercadolibre.svg', alt: 'MercadoLibre' },


        ];
    
        // Busca el logo correspondiente al nombre de la tienda
        const logo = tiendaLogos.find((tienda) => tienda.alt.toLowerCase() === storeName.toLowerCase());
        return logo ? logo.src : null; // Devuelve la URL del logo o null si no se encuentra
    };

    //Funcion para paginado
    console.log('Productos:   ',productos)
    const paginatedProducts = Array.isArray(productos)
    ? productos.slice((page - 1) * productsPerPage, page * productsPerPage)
    : [];

    



    return (
        <Container maxWidth="lg" sx={{ mt: 1 }}>
                    {/* Sección de fondo y filtros */}
                    <Box
                        sx={{
                            width: '100vw',
                            height: { xs: '50vh', md: '20vh' },
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'white',
                            mb: 6,// Aquí defines el margen inferior
                            p: 2,
                            zIndex: 2,
                        }}
                    >
                        {/* Imagen de fondo desenfocada */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: 'url(https://guiaautomotrizcr.com/wp-content/uploads/2023/04/porqu.jpeg)', // Tu imagen de fondo
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                filter: 'blur(2px)', // Ajusta el nivel de desenfoque según prefieras
                                zIndex: 1,
                            }}
                        />

                        {/* Overlay oscuro para mejorar la visibilidad del texto */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Opacidad ajustable
                                zIndex: 1,
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0, position: 'relative', zIndex: 2,fontSize: { xs: '1.8rem', md: '3rem' }}}>
                            Resultados de tu busqueda:
                        </Typography>
                    </Box>

                    {/* Breadcrumbs dinámico para la navegación */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 3 }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" href="/" onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}>
                            Inicio
                        </Link>        
                        {location.pathname.includes('/marca/') 
                            ? <Typography color="text.primary">Marca - {categoryName}</Typography>
                            : <Typography color="text.primary">Categoría - {categoryName}</Typography>}

                    </Breadcrumbs>
                    <FormControl variant="outlined"
                        sx={{
                            mt: 0, // Añade más margen superior
                            minWidth: 160, // Opcional para controlar el ancho
                        }}
                    >
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
                
                {/* Filtros en el lado izquierdo */}
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
                                <Select 
                                    value={brandFilter} 
                                    onChange={(event) => 
                                        setBrandFilter(event.target.value)} 
                                        label="Marca"
                                    >
                                    <MenuItem value="">Ninguno</MenuItem>
                                    {marcas && marcas.length > 0 ? (
                                        marcas.map((marca, index) => (
                                            <MenuItem key={index} value={marca}>
                                                {marca}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Cargando marcas...</MenuItem>
                                    )}
                                </Select>
                        </FormControl>


                        {/* Filtro por Modelo */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                value={modelFilter || ""}
                                onChange={(event) => {
                                    setModelFilter(event.target.value);
                                }}
                                disabled={!brandFilter} // Deshabilita si no hay marca seleccionada
                                label="Modelo"

                            >
                                {modelosDisponibles.length > 0 ? (
                                    modelosDisponibles.map((modelo, index) => (
                                        <MenuItem key={index} value={modelo}>
                                            {modelo}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No hay modelos disponibles</MenuItem>
                                )}
                            </Select>
                        </FormControl>


                        {/* Filtro por Tienda */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tienda</InputLabel>
                            <Select 
                                value={storeFilter} 
                                onChange={(event) => 
                                    setStoreFilter(event.target.value)} 
                                    label="tienda"
                            >
                                {tienda.map((tienda, index) => (
                                <MenuItem key={index} value={tienda.alt}>
                                    {tienda.alt}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filtro por Categoría */}
                        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                label="Categoría"
                            >
                                {CATEGORIES.map((category, index) => (
                                    <MenuItem key={index} value={category.value}>
                                        {category.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Botón de comparar o mostrar comparación */}
                        {compareMode ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2,
                                    backgroundColor: '#FFCC00', // Color naranja para resaltar
                                    color: 'black',
                                 }}
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
                                sx={{ 
                                    mt: 2,
                                    backgroundColor: '#FFCC00', // Color naranja para resaltar
                                    color: 'black',
                                 }}
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
                {isLoading ? (
                        <Box
                        sx={{
                            mt: 4,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '50vh', // Ajusta la altura para centrar verticalmente
                        }}
                        >
                        <Typography variant="h6">Cargando productos...</Typography>
                        </Box>
                            ) : errorMessage ? (
                                <Box
                                sx={{
                                    mt: 4,
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '50vh', // Centra verticalmente dentro de un contenedor
                                }}
                            >
                            <Typography variant="h6" color="error">
                                {errorMessage}
                            </Typography>
                        </Box>
                    ) : (
                    <>
                    {/* Listado de productos */}
                    <Grid container spacing={3}>
                    {Array.isArray(productos) && productos.length > 0 ? (
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
                                            mt: 0, // Añade un margen superior

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
                                                    top: 5,
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
                                            sx={{
                                                objectFit: 'contain', // Ajusta la imagen para que quepa dentro del contenedor sin recortarla
                                                height: '150px', // Altura específica
                                                width: '150px', // Anchura específica
                                                margin: 'auto', // Centra la imagen en su contenedor
                                                padding: '10px', // Espaciado interno
                                            }}
                                        />
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                {producto.nombre}
                                            </Typography>

                                            <Typography variant="h6" sx={{ mt: 1, color: '#003366' }}>
                                            {`$${producto.precio_actual.toLocaleString("es-CL")}`}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Marca:</strong> {producto.marca || '-'}
                                            </Typography>
                                            <Typography variant="body2" >
                                                <strong>Categoria:</strong> {producto.categoria || '-'}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 1, // Margen superior para separación
                                                }}
                                            >
                                                {getStoreLogo(producto.empresa_procedencia) ? (
                                                    <img
                                                        src={getStoreLogo(producto.empresa_procedencia)}
                                                        alt={producto.empresa_procedencia}
                                                        style={{
                                                            width: '40px',  // Tamaño ancho del logo
                                                            height: '50px', // Tamaño alto del logo
                                                            objectFit: 'contain', // Ajuste para mantener la proporción
                                                            marginLeft: '8px', // Espaciado entre "Tienda:" y el logo
                                                        }}
                                                    />
                                                ) : (
                                                    producto.empresa_procedencia || '-'
                                                )}
                                                <strong>{producto.empresa_procedencia}</strong>&nbsp;

                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" color="error">
                                {errorMessage || "No se encontraron productos que coincidan con la búsqueda."}
                            </Typography>
                        )}
                    </Grid>

    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    {Array.isArray(productos) && productos.length > 0 ? (
                        <Pagination
                            count={Math.ceil(productos.length / productsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                            </Typography>
                        )}
                    </Box>
                    </>
                     )}
                </Grid>
            </Grid>

            {/* Modal de comparación */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box                         
                    sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 4,
                            width: '80%',
                            maxWidth: 800,
                    }}>
                    <Typography variant="h6" gutterBottom>Comparación de Productos</Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {selectedProducts.map((producto, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Card
                                        sx={{
                                            boxShadow: 3,
                                            textAlign: 'center',
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            height: '100%',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/product/${producto._id}`)}
                                >
                                    <Box
                                            sx={{
                                                height: 150, // Altura fija para el área de la imagen
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#f2f2f2',
                                                marginBottom: 2,
                                                borderRadius: 2,
                                            }}
                                    >
                                      {producto.imagenUrl ? (
                                                <CardMedia
                                                    component="img"
                                                    image={producto.imagenUrl}
                                                    alt={producto.nombre}
                                                    sx={{
                                                        maxHeight: '100%',
                                                        maxWidth: '100%',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Imagen no disponible
                                            </Typography>
                                        )}
                                    </Box>
                                        {/* Contenedor del título */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                display: '-webkit-box', // Usamos un contenedor flexible para cortar texto
                                                WebkitBoxOrient: 'vertical', // Orientación en vertical
                                                WebkitLineClamp: 2, // Máximo 2 líneas visibles
                                                overflow: 'hidden', // Oculta el texto que exceda las líneas
                                                textAlign: 'center',
                                                fontSize: { xs: '1rem', sm: '1.2rem' }, // Responsivo en pantallas pequeñas
                                                marginBottom: 2,
                                            }}
                                        >
                                            {producto.nombre || '-'}
                                        </Typography>
                                        {/* Contenedor de las características */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                width: '100%', // Asegura que todo quede alineado
                                                gap: 1, // Espaciado entre líneas
                                            }}
                                        >
                                            {/*Precio*/}
                                            <Typography variant="body2">
                                                <strong>Precio:</strong> {producto.precio_actual ? producto.precio_actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '-'}
                                            </Typography>

                                            {/*Marca*/}
                                            <Typography variant="body2">
                                                <strong>Marca:</strong> {producto.marca !== "null" && producto.marca !== undefined ? producto.marca : 'No especificado'}
                                            </Typography>
                                            
                                            {/* Modelo*/}
                                            <Typography variant="body2">
                                                <strong>Modelo:</strong> {producto.modelo !== "null" && producto.modelo !== undefined ? producto.modelo : 'No especificado'}
                                            </Typography>

                                            {/* Numero de pieza*/}
                                            <Typography variant="body2">
                                                <strong>N. Pieza:</strong> {producto.numero_pieza !== "null" && producto.numero_pieza !== undefined ? producto.numero_pieza : 'No especificado'}
                                            </Typography>

                                            {/*Tipo de vehiculo*/}
                                            <Typography variant="body2">
                                                <strong>Tipo vehiculo:</strong> {producto.tipo_vehiculo !== "null" && producto.tipo_vehiculo !== undefined ? producto.tipo_vehiculo : 'No especificado'}
                                            </Typography>

                                            {/*Material*/}
                                            <Typography variant="body2">
                                                <strong>Material:</strong> {producto.material !== "null" && producto.material !== undefined ? producto.material : 'No especificado'}
                                            </Typography>
                                            
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 0, // Margen superior para separación
                                                }}
                                            >
                                                {getStoreLogo(producto.empresa_procedencia) ? (
                                                    <img
                                                        src={getStoreLogo(producto.empresa_procedencia)}
                                                        alt={producto.empresa_procedencia}
                                                        style={{
                                                            width: '40px',  // Tamaño ancho del logo
                                                            height: '50px', // Tamaño alto del logo
                                                            objectFit: 'contain', // Ajuste para mantener la proporción
                                                            marginLeft: '8px', // Espaciado entre "Tienda:" y el logo
                                                        }}
                                                    />
                                                ) : (
                                                    producto.empresa_procedencia || '-'
                                                )}
                                                <strong>{producto.empresa_procedencia}</strong>&nbsp;

                                            </Typography>
                                        </Box>
                                
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Modal>
        </Container>
    );
}

export default SearchResults;
