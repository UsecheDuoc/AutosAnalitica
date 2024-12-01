// src/components/CategoryPage.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Select, MenuItem, FormControl, InputLabel, Pagination, Paper, Checkbox, Button, Modal,IconButton } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Asegúrate de importar Link
import { Breadcrumbs } from '@mui/material';
import config from '../config';
import ProductList from './ProductList';
import { ModelosContext } from '../contexts/ModelosContext';
import { initialMarcas } from '../constants';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import { fetchWithFallback } from "../utils/api"; //URL de utils en componentes principales
import { CATEGORIES } from "../constants";
import { tienda } from "../constants";


// Función para capitalizar las rutas (opcional)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function CategoryPage() {
    const { categoryName = '' } = useParams(); // Inicializa categoryName como cadena vacía si está indefinido
    const navigate = useNavigate();
    const query = useQuery();
    const searchTerm = query.get("q");
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
    const { modelosDisponibles, setModelosDisponibles } = useContext(ModelosContext);
    const imageUrl = location.state?.imageUrl || 'URL_DE_IMAGEN_POR_DEFECTO';
    const [filtersOpen, setFiltersOpen] = useState(false); // Estado para el colapso
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    //const paginatedProducts = productos.slice((page - 1) * productsPerPage, page * productsPerPage);
    //console.warn('Lo que tiene:',paginatedProducts)
    const [isLoading, setIsLoading] = useState(false);
    const [counter, setCounter] = useState(0); // Estado para contar las ejecuciones del efecto
    //console.log(counter)
    //NUEVO


    //Comentado para aplicar FilterSection
    const handleModelChange = (event) => {
        setModelFilter(event.target.value);
        applyFilters(); // Llamar a `applyFilters` cada vez que cambie el filtro de modelo
    };


    const handleDiscountChange = (event) => setDiscountFilter(event.target.value);
    
    const handleStoreChange = (event) => {
        setStoreFilter(event.target.value);
        applyFilters(); // Llamar a `applyFilters` cada vez que cambie el filtro 
    };
    // Estado adicional para el filtro de categoría

    // Función para manejar el cambio de categoría en el filtro
    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);  // Actualiza el estado local con la nueva categoría seleccionada
    };


    // Nueva función para manejar la carga de modelos basados en la marca seleccionada
    const fetchModelosPorMarca = async (marca) => {
        try {
            const response = await fetchWithFallback(`/productos/modelos?marca=${encodeURIComponent(marca)}`);
            //                const response = await fetchWithFallback(`/productos/modelos?marca=${encodeURIComponent(marca)}`);

            //fetchWithFallback(`/productos/buscar-similares?marca=${encodeURIComponent(params.marca || '')
            setModelosDisponibles(response); // Cargar los modelos disponibles para la marca seleccionada
        } catch (error) {
            console.error("Error al obtener modelos:", error);
            setModelosDisponibles([]); // En caso de error, establecer modelos como vacío
        }
    };
    

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


    useEffect(() => {
        if (productos.length > 0) {
            const sorted = sortProducts(productos); // Ordena los productos
            setProductos(sorted); // Actualiza el estado con los productos ordenados
        }
    }, [sortOrder]); // Ejecuta el efecto cuando cambia sortOrder
    
    
    
    // useEffect para la carga inicial basada en la URL (marca o categoría)
    useEffect(() => {
        setModelFilter('');  // Limpiar filtro de modelo
        setDiscountFilter('');  // Limpiar filtro de descuento
        setStoreFilter('');  // Limpiar filtro de tienda
        console.log("Ruta actual:", location.pathname);
        console.log("Valor de categoryName:", categoryName);

        if (location.pathname.includes('/marca/')) {
            // Extrae la marca desde la URL
            const brandFromPath = decodeURIComponent(location.pathname.split('/marca/')[1]);
            //const brandFromPath = location.pathname.split('/marca/')[1]; // Extrae la marca de la URL
            console.log("Marca detectada en la ruta:", brandFromPath);
            setBrandFilter(brandFromPath); // Decodifica si hay caracteres especiales
            fetchProductosPorMarca(categoryName); // Llama a la función con fallback
        } else if (location.pathname.includes('/categoria/')) {
            setCategoryFilter('');  // Limpiar filtro de categoría
            setCategoryFilter(categoryName); // Configura el filtro de categoría inicial
            fetchProductosPorCategoria(categoryName); // Búsqueda inicial por categoría
        }
    }, [categoryName, location.pathname]);

    // useEffect para aplicar filtros cuando se cambian
    useEffect(() => {
        if (brandFilter || modelFilter || discountFilter || storeFilter || filter ) {
            applyFilters();  // Aplica los filtros activos
        }
    }, [brandFilter, modelFilter, discountFilter, storeFilter, filter]);
    
    
    // useEffect para cargar los modelos basados en la marca seleccionada
    useEffect(() => {
        if (brandFilter) {
            fetchModelosPorMarca(brandFilter);  // Cargar modelos si hay una marca seleccionada
        } else {
            setModelos([]);  // Limpiar modelos si no hay marca seleccionada
        }
    }, [brandFilter]);
    

    useEffect(() => {
        if (categoryFilter || brandFilter || modelFilter || discountFilter || storeFilter) {
            applyFilters();  // Aplica los filtros automáticamente cuando cambia `categoryFilter`
        }
    }, [categoryFilter, brandFilter, modelFilter, discountFilter, storeFilter]);
    

    
    const pathnames = location.pathname.split('/').filter((x) => x);

    //Para los filtros de se aplican desde el home
    //REVISAR YA QUE ESTA DUPLICADO ABAJO
    useEffect(() => {
        //console.warn('PRIMER EFECTO')
        const queryParams = new URLSearchParams(location.search);
    
        const marca = queryParams.get('marca') || '';
        const modelo = queryParams.get('modelo') || '';
        const categoria = queryParams.get('categoria') || '';
        const tienda = queryParams.get('empresa_procedencia') || '';
        const searchParams = new URLSearchParams();

        setBrandFilter(marca || "");
        setModelFilter(modelo || "");
        setStoreFilter(tienda || "");

        setCategoryFilter(categoria || "");
    
        if (marca || modelo || categoria ||tienda) {
            applyFilters(); // Solo aplica si hay filtros válidos
        }    
    }, [location.search]);


    const [selectedFilters, setSelectedFilters] = useState({
        marca: '',
        modelo: '',
        categoria: '',
    });
    
    //Importamos las marcas desde mi constants.js
    useEffect(() => {
        setMarcas(initialMarcas);
    }, []);

    useEffect(() => {
        applyFilters(); // Aplica los filtros automáticamente cuando cambian
    }, [brandFilter, modelFilter, discountFilter, storeFilter, categoryFilter]);
    

    //PRUEBA TRAYENDO LA LOGICA DE FILTROS DESDE SEARCHRESULTS:JS
/*     useEffect(() => {
        console.warn('SEGUNDO EFECTO')

        const queryParams = new URLSearchParams(location.search);
    
        const marca = queryParams.get('marca') || '';
        const modelo = queryParams.get('modelo') || '';
        const categoria = queryParams.get('categoria') || '';
    
        // Actualiza los filtros solo si hay valores definidos
        setBrandFilter(marca || "");
        setModelFilter(modelo || "");
        setCategoryFilter(categoria || "");
    
        applyFilters();
    }, [location.search]); */


        // Leer parámetros de búsqueda desde la URL
        useEffect(() => {
            //console.warn('TERCER EFECTO')

            const searchParams = new URLSearchParams(location.search);
            const marca = searchParams.get("marca") || '';
            const modelo = searchParams.get("modelo") || '';
            const categoria = searchParams.get("categoria") || '';
            const searchTerm = searchParams.get('q') || ''; // Para búsquedas por nombre
    
            const descuento = searchParams.get("descuento") || '';
            const tienda = searchParams.get('empresa_procedencia') || '';
            const sortOrder = searchParams.get("sortOrder") || '';
    
            // Actualiza los filtros en el estado
            setBrandFilter(marca);
            setModelFilter(modelo);
            setCategoryFilter(categoria);
            setDiscountFilter(descuento);
            setStoreFilter(tienda);
    
            // Fetch inicial combinando filtros y búsqueda
            const params = {
            nombre: searchTerm || undefined,
            marca: marca || undefined,
            modelo: modelo || undefined,
            categoria: categoria || undefined,
            descuento: descuento || undefined,
            tienda: tienda || undefined,
        };
    
    
        
    
        fetchProducts(params);
        }, [location.search]);
    
    
        const fetchProducts = async (params) => {
            setIsLoading(true); // Inicia el estado de carga        
            setErrorMessage(null); // Reiniciar el error antes de hacer una nueva solicitud

/*             if (!params.marca && !params.modelo && !params.categoria && !params.nombre&& !params.tienda) {
                console.log("No hay parámetros válidos para ejecutar fetchProducts.");
                return;
            } */

            try {
                const response = await fetchWithFallback(`/productos/buscar-similares?marca=${encodeURIComponent(params.marca || '')}&modelo=${encodeURIComponent(params.modelo || '')}&categoria=${encodeURIComponent(params.categoria || '')}&nombre=${encodeURIComponent(params.nombre || '')}&empresa_procedencia=${encodeURIComponent(params.tienda || '')}`);

                //fetchWithFallback(`/productos/buscar-similares?marca=${encodeURIComponent(params.marca || '')}&modelo=${encodeURIComponent(params.modelo || '')}&categoria=${encodeURIComponent(params.categoria || '')}&nombre=${encodeURIComponent(params.nombre || '')}&empresa_procedencia=${encodeURIComponent(params.tienda || '')}`)
                if (!Array.isArray(response) || response.length === 0) {
                    setErrorMessage("No se encontraron productos que coincidan con la búsqueda.");
                    setProductos([]);
                    //return;
                } else {
                    setErrorMessage(null); // Limpia cualquier mensaje de error
                    setProductos(response);

                }
                                
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setErrorMessage(error.response?.message || "No se encontraron productos que coincidan con la búsqueda.");
                setProductos([]); // Limpia los productos en caso de error
            } finally {
                setIsLoading(false); // Finaliza el estado de carga
            }
        };
    

    
    //Efecto para inicializar los filtros en categoty cuando viene de home
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
        setErrorMessage(null); // Reiniciar el mensaje de error antes de aplicar filtros

        const params = {
            nombre: searchTerm|| undefined,
            marca: brandFilter || undefined,
            modelo: modelFilter || undefined,
            categoria: categoryFilter || undefined,
            descuento: discountFilter || undefined,
            tienda: storeFilter || undefined,
        };

        // Verifica si hay parámetros válidos
        if (!params.nombre && !params.marca && !params.modelo && !params.categoria && !params.tienda) {
            console.log("Filtros inválidos o vacíos.");
            setProductos([]);
            //setErrorMessage("No se encontraron productos.");
            return;
        }
    
        console.log("Aplicando filtros:", params); // Verifica los filtros en la consola

        // Evitar llamar a fetchProducts si no hay búsqueda activa
        if (location.pathname === "/search" || searchTerm || params.marca || params.categoria || params.modelo|| params.tienda) {
            fetchProducts(params); // Envía los filtros a fetchProducts
        } else {
            console.log("No se ejecuta fetchProducts porque no hay parámetros relevantes.");
        }

    };
    
    const fetchProductosPorMarca = async (nombreMarca) => {
            //console.warn('Entreeeee')
            // Incrementar el contador después de ejecutar el efecto
            //setCounter((prev) => prev + 1);
            try {
                // Usa el endpoint correspondiente con fetchWithFallback
                const productos = await fetchWithFallback(`/productos/marca?nombre=${encodeURIComponent(nombreMarca)}`);
                
                if (productos.length === 0) {
                    setErrorMessage("No se encontraron productos para la marca seleccionada.");
                    setProductos([]); // Limpia el estado si no hay productos
                  } else {
                    setErrorMessage(null); // Limpia cualquier mensaje de error
                    setProductos(productos); // Almacena los productos obtenidos
                  }
            } catch (error) {
                console.error("Error al obtener productos por marca:", error);
                setErrorMessage("No se encontraron productos para la marca seleccionada.");
            }
        }
         
    //Seccion de filtros
    const fetchProductosPorCategoria = async (nombreCategoria) => {
        try {
            //const productos = await fetchWithFallback(`/categoria?categoria=${encodeURIComponent(categoria)}`);
            console.log("Categoria que trae: ",{nombreCategoria})
            const productos = await fetchWithFallback(`/productos/categoria?categoria=${encodeURIComponent(nombreCategoria)}`);
            console.log('Productos recibidos por filtro categoria desde home',{productos})
            setProductos(productos);

            // Construye los parámetros
            const params = {
                categoria: nombreCategoria,
                marca: brandFilter || undefined,
                modelo: modelFilter || undefined,
                descuento: discountFilter || undefined,
                tienda: storeFilter || undefined,
              };


            if (productos.length === 0) {
                setErrorMessage("No se encontraron productos en esta categoría.");
                setProductos([]); // Limpia los productos si la respuesta está vacía
            } else {
                setErrorMessage(null); // Limpia cualquier mensaje de error si hay resultados
                //setProductos(data); // Almacena los productos en el estado
            }
        } catch (error) {
            console.error("Error al obtener productos por categoría:", error);
            setErrorMessage("No se encontraron productos en esta categoría.");
        }
    };

    const handlePageChange = (event, value) => setPage(value);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value); // Actualiza el estado de sortOrder
    };
    
    const handleFilterChange = (event) => setFilter(event.target.value);

    //Para el ordenamiento
    const sortProducts = (products) => {
        let sortedProducts = [...products]; // Crea una copia para evitar mutaciones
        if (sortOrder === 'priceAsc') {
            sortedProducts.sort((a, b) => a.precio_actual - b.precio_actual);
            console.log('aplico orden por precio')
        } else if (sortOrder === 'priceDesc') {
            sortedProducts.sort((a, b) => b.precio_actual - a.precio_actual);
            console.log('aplico orden por precio')
        } else if (sortOrder === 'nameAsc') {
            sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
            console.log('aplico orden por letras')
        } else if (sortOrder === 'nameDesc') {
            sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
            console.log('aplico orden por letras')
        }
        return sortedProducts;
    };

    //Seccion de comparacion de productos
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
    const handleCompareToggle = () => {
        setCompareMode(!compareMode);
        setSelectedProducts([]);
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

        ];
    
        // Busca el logo correspondiente al nombre de la tienda
        const logo = tiendaLogos.find((tienda) => tienda.alt.toLowerCase() === storeName.toLowerCase());
        return logo ? logo.src : null; // Devuelve la URL del logo o null si no se encuentra
    };

    
    /*if (isLoading) {
        return <Typography variant="h6" align="center">Cargando producto...</Typography>;
    }

    if (errorMessage) {
        return <Typography variant="h6" align="center" color="error">{errorMessage}</Typography>;
    }*/
    //Funcion para paginado
    console.log('Productos:   ',productos)
    const paginatedProducts = Array.isArray(productos)
    ? productos.slice((page - 1) * productsPerPage, page * productsPerPage)
    : [];
    console.log('Productos con paginated:',paginatedProducts)


    return (
            <Container maxWidth="lg" sx={{ mt: 1 }}>
                            {/* Sección de fondo y filtros */}
                            <Box
                            sx={{
                                width: '100vw',
                                height: { xs: '15vh', md: '20vh' }, // Cambia la altura para dispositivos más pequeños
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
                                mb: 0,
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
                                    //backgroundImage: 'url(https://img.freepik.com/fotos-premium/sistema-frenos-disco-freno-coche-pinza-aislado-sobre-fondo-blanco_708636-433.jpg)', // Tu imagen de fondo
                                    backgroundImage: `url(${imageUrl})`,

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
                            <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                mb: 0,
                                position: 'relative',
                                zIndex: 2,
                                fontSize: { xs: '1.8rem', md: '3rem' },
                            }}
                            >
                            {location.pathname.includes('/marca/') 
                                ? `Marca: ${categoryName}` 
                                : `Categoría: ${categoryName}`}
                            </Typography>
                        </Box>

                {/* Breadcrumbs dinámico para la navegación */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt:3 }}>
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
                    <Box sx={{ mb: 2 }}>
                        {/* Botón de hamburguesa */}
                        <IconButton 
                            onClick={() => setOpen(!open)} 
                            sx={{ display: { xs: 'block', md: 'none' } }} // Solo visible en dispositivos pequeños
                            color="primary"
                        >
                            <MenuIcon />
                        </IconButton>



                        {/* Contenedor colapsable de filtros */}
                        <Collapse in={open || window.innerWidth >= 960} timeout="auto" unmountOnExit>
                        
                        <Paper elevation={3} sx={{ p: 2, bgcolor: '#f9black9f9' }}>
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
                                        onChange={(event) => setBrandFilter(event.target.value)} 
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
                            
                            {/* Filtro por modelo */}
                            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Modelo</InputLabel>
                                <Select 
                                value={modelFilter} 
                                onChange={(event) => setModelFilter(event.target.value)} 
                                label="Modelo"
                                disabled={!brandFilter} // Deshabilita si no hay marca seleccionada o modelos disponibles
                                >
                                <MenuItem value="">Ninguno</MenuItem> {/* Añade una opción vacía */}
                                {modelosDisponibles && modelosDisponibles.length > 0 && modelosDisponibles.map((modelo, index) => (
                                    <MenuItem key={index} value={modelo}>{modelo}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>

        
                            {/* Filtro por tienda */}
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
        
                            {/* Filtro de Categoria */}
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
                                    sx={{
                                         mt: 2,
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
                                        backgroundColor: '#FFD700', // Color naranja para resaltar
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
                                    sx={{ 
                                        mt: 1, 
                                        cursor: 'pointer', 
                                        textDecoration: 'underline', 
                                        textAlign: 'center',
                                     }}
                                        
                                    onClick={handleCompareToggle}
                                >
                                    Cancelar comparación
                                </Typography>
                            )}
                        </Paper>
                        </Collapse>
                        </Box>
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
                                height: '50vh', // Centra verticalmente dentro de un contenedor
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
                                {Array.isArray(paginatedProducts) && paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((producto) => (
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
                                                    },
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
                                                            boxShadow: 1, // Sombra para    r el checkbox
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
                                                        objectFit: 'contain',
                                                        height: '150px',
                                                        width: '150px',
                                                        margin: 'auto',
                                                        padding: '10px',
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
                                                    <Typography variant="body2">
                                                        <strong>Categoría:</strong> {producto.categoria || '-'}
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
                                                                    width: '40px', // Tamaño ancho del logo
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
                                // Mostrar mensaje de "no productos" si no hay resultados
                                <Box
                                sx={{
                                    mt: 4,
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '50vh',
                                }}
                                >
                                <Typography variant="h6" color="error">
                                    No se encontraron productos que coincidan con la búsqueda.
                                </Typography>
                                </Box>
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
                                ) : null}
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
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Comparación de Productos
                        </Typography>
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

                                            
                                            {/* Tienda*/}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: -1, // Margen superior para separación
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

export default CategoryPage;
