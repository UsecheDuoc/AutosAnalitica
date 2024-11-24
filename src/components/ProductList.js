    // src/components/ProductList.js
    import React, { useState, useEffect, useContext } from 'react';
    import axios from 'axios';
    import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button,IconButton, Pagination, Select, MenuItem,TextField } from '@mui/material';
    import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
    import "slick-carousel/slick/slick.css";
    import "slick-carousel/slick/slick-theme.css";
    import { useNavigate } from 'react-router-dom';
    import "slick-carousel/slick/slick.css";
    import "slick-carousel/slick/slick-theme.css";
    import { Link } from 'react-router-dom';
    import Slider from "react-slick"; // Importa react-slick
    import CloseIcon from '@mui/icons-material/Close';
    import config from '../config';
    import { ModelosContext } from '../contexts/ModelosContext';
    import { initialMarcas } from '../constants';
    import { CATEGORIES } from "../constants";
    import { fetchWithFallback } from "../utils/api"; //URL de utils en componentes principales
    import { tienda } from "../constants";


    

    // Datos de categorías y marcas
    export const categorias = [
        { nombre: 'Frenos', imageUrl: 'https://img.freepik.com/fotos-premium/sistema-frenos-disco-freno-coche-pinza-aislado-sobre-fondo-blanco_708636-433.jpg' },
        { nombre: 'Motores', imageUrl: '	https://as1.ftcdn.net/v2/jpg/08/88/36/22/1000_F_888362297_gmDqHowGPe4Luk8CI7TOr3jYKG4ognSB.jpg' },
        { nombre: 'Eléctricas', imageUrl: 'https://as1.ftcdn.net/v2/jpg/08/60/45/44/1000_F_860454407_7v24BykanIJYmRR2WTARPrlfWjOqOLCs.jpg' },
        { nombre: 'Suspensión', imageUrl: 'https://as2.ftcdn.net/v2/jpg/01/29/37/69/1000_F_129376964_8yGskWA0GxqOTjn9jmf0EzXjEAHDdPhb.jpg' },
        { nombre: 'Transmisión', imageUrl: '	https://as1.ftcdn.net/v2/jpg/04/59/19/90/1000_F_459199042_8SRpQjSsz5RGyutk0ZM0nscM0lKYPkr5.jpg' },
        { nombre: 'Exterior', imageUrl: 'https://as1.ftcdn.net/v2/jpg/00/12/33/76/1000_F_12337609_4LQkQteGlsfTQVpFUTAcdFCSLQOI9io3.jpg' },
        { nombre: 'Refrigeración', imageUrl: 'https://as2.ftcdn.net/v2/jpg/04/57/25/23/1000_F_457252397_P79Knbn6ueRcv4wOwnJHbeUkfYg7iaCf.jpg' },
        { nombre: 'Embragues', imageUrl: 'https://noticias.coches.com/wp-content/uploads/2018/11/embrague-2.jpg' },

        // Más categorías...
    ];

    export const InicioMarcas = [
        { nombre: 'Toyota', imageUrl: 'https://www.diariomotor.com/imagenes/2022/11/logo-de-toyota-6376f7ae393e5-1280x720.webp' },
        { nombre: 'Chery', imageUrl: 'https://i.pinimg.com/736x/d4/e6/de/d4e6de24c4d2cc3344766e23330d588a.jpg' },
        { nombre: 'Chevrolet', imageUrl: 'https://www.shutterstock.com/image-vector/chattogram-bangladesh-may-29-2023-600nw-2309781029.jpg' },
        { nombre: 'Changan', imageUrl: 'https://1000marcas.net/wp-content/uploads/2021/02/Changan-Logo-2016.png' },
        { nombre: 'Maxus', imageUrl: 'https://www.msrepuestos.cl/cdn/shop/collections/MAXUS.png?v=1719593851&width=1296' },
        { nombre: 'Foton', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyo0MGZ0AAKTm9_9ux1S1u1D7f-DgrTRvlIA&s' },
        { nombre: 'Volkswagen', imageUrl: 'https://cdn.autobild.es/sites/navi.axelspringer.es/public/media/image/2019/04/logotipo-volkswagen-historia_21.jpg?tf=3840x' },
        { nombre: 'Hyundai', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/05/hyundai-logo-3.png' },
        { nombre: 'BMW', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png' },
        { nombre: 'Audi', imageUrl: 'https://e7.pngegg.com/pngimages/905/811/png-clipart-audi-logo-audi-logo-transport-cars.png' },

        // Más marcas...
    ];


    
    
    function ProductList() {
        const { modelosDisponibles = [], setModelosDisponibles } = useContext(ModelosContext);
        console.log(modelosDisponibles); // Aquí puedes usar modelosDisponibles
        const [productos, setProductos] = useState([]);
        const [page, setPage] = useState(1);
        const productsPerPage = 20;
        const navigate = useNavigate();
        const [relatedProducts, setRelatedProducts] = useState([]);
        const [marcas, setMarcas] = useState([]); // Lista de marcas disponibles
        const [errorMessage, setErrorMessage] = useState('');
        const [isLoading, setIsLoading] = useState(false);

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
            fetchProductos();
        }, []);



        useEffect(() => {
            if (selectedFilters.marca) {
                console.log("Marca seleccionada:", selectedFilters.marca);
                //fetchModelosPorMarca(selectedFilters.marca);
            } else {
                setModelosDisponibles([]);
            }
        }, [selectedFilters.marca]);



        //Control de errores
        const fetchProductos = async () => {
            try {
                setIsLoading(true); // Muestra el indicador de carga
                const response = await axios.get(`${config.apiBaseUrl}`);
                setProductos(response.data);
        
                // Si no hay productos, muestra un mensaje
                if (response.data.length === 0) {
                    setErrorMessage("No se encontraron productos disponibles.");
                }
            } catch (error) {
                if (error.response) {
                    // Error en la respuesta del servidor
                    const status = error.response.status;
                    switch (status) {
                        case 400:
                            console.error("Error 400: Solicitud incorrecta");
                            setErrorMessage("Hubo un problema con tu solicitud. Verifica los datos e inténtalo de nuevo.");
                            break;
                        case 401:
                            console.error("Error 401: No autorizado");
                            setErrorMessage("No estás autorizado para realizar esta acción. Por favor, inicia sesión.");
                            break;
                        case 403:
                            console.error("Error 403: Acceso denegado");
                            setErrorMessage("No tienes permiso para acceder a este recurso.");
                            break;
                        case 404:
                            console.error("Error 404: No encontrado");
                            setErrorMessage("El recurso solicitado no existe. Verifica el enlace o la información proporcionada.");
                            break;
                        case 500:
                            console.error("Error 500: Error interno del servidor");
                            setErrorMessage("El servidor encontró un problema. Por favor, inténtalo más tarde.");
                            break;
                        case 502:
                            console.error("Error 502: Puerta de enlace incorrecta");
                            setErrorMessage("Error en la comunicación con el servidor. Por favor, inténtalo nuevamente.");
                            break;
                        case 503:
                            console.error("Error 503: Servicio no disponible");
                            setErrorMessage("El servicio está temporalmente no disponible. Intenta más tarde.");
                            break;
                        case 504:
                            console.error("Error 504: Tiempo de espera agotado");
                            setErrorMessage("El servidor tardó demasiado en responder. Por favor, inténtalo de nuevo.");
                            break;
                        default:
                            console.error(`Error ${status}: ${error.message}`);
                            setErrorMessage("Ocurrió un error inesperado. Intenta más tarde.");
                            break;
                        }
                        // Redirige a la página 404 en caso de un error no encontrado
                        if (status === 404) {
                            navigate('/404');
                        }
                } else {
                    // Error en la conexión con el servidor
                    console.error("Error de red o conexión");
                    setErrorMessage("No se pudo conectar al servidor. Verifica tu conexión a internet.");
                }
            }finally {
                setIsLoading(false); // Oculta el indicador de carga
            }
        };

        // Configuración del carrusel para categorías y marcas
        const carouselSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 5, // Por defecto muestra 4 elementos
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                { breakpoint: 1280, settings: { slidesToShow: 4 }, slidesToScroll: 3 },
                { breakpoint: 1024, settings: { slidesToShow: 3 }, slidesToScroll: 2 },
                { breakpoint: 768, settings: { slidesToShow: 3 }, slidesToScroll: 2 },
                { breakpoint: 480, settings: { slidesToShow: 2 }, slidesToScroll: 2 },
            ],
        };

        {/*const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3, // Ajusta según el número de productos que deseas mostrar
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        }; */}

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                },
              },
            ],
            nextArrow: (
              <button className="absolute top-0 right-0 h-full w-12 bg-gray-300 bg-opacity-70 flex justify-center items-center rounded-l-lg shadow-lg hover:bg-gray-400">
                <span className="text-2xl text-black font-bold">→</span>
              </button>
            ),
            prevArrow: (
              <button className="absolute top-0 left-0 h-full w-12 bg-gray-300 bg-opacity-70 flex justify-center items-center rounded-r-lg shadow-lg hover:bg-gray-400">
                <span className="text-2xl text-black font-bold">←</span>
              </button>
            ),
          };

        // Función para redirigir a CategoryPage con el nombre de la categoría y la imagen
        const handleCategoriaClick = (nombreCategoria) => {
            const categoriaSeleccionada = categorias.find((categoria) => categoria.nombre === nombreCategoria);
            navigate(`/categoria/${nombreCategoria}`, { state: { imageUrl: categoriaSeleccionada?.imageUrl } });
        };

        // Función para redirigir a CategoryPage con el nombre de la marca y la imagen
        const handleMarcaClick = (nombreMarca) => {
            const marcaSeleccionada = InicioMarcas.find((marca) => marca.nombre === nombreMarca);
            navigate(`/marca/${nombreMarca}`, { state: { imageUrl: marcaSeleccionada?.imageUrl } });
        };

        const handleChangePage = (event, value) => setPage(value);
        const limitedProducts = Array.isArray(productos) && productos.length > 0 ? productos.slice(0, 5) : [];
        const [selectedMarca, setSelectedMarca] = React.useState('');

        const handleFilterChange = (filtro, valor) => {
            const searchParams = new URLSearchParams();

            if (filtro === 'marca') {
                searchParams.set('marca', valor);
            } else if (filtro === 'modelo') {
                searchParams.set('modelo', valor);
            } else if (filtro === 'categoria') {
                searchParams.set('categoria', valor);
            }
            navigate(`/buscar-similares?${searchParams.toString()}`); // Redirige con los filtros seleccionados
        };

        const fetchModelosPorMarca = async (marca) => {
            try {
                const response = await fetchWithFallback(`/productos/modelos?marca=${encodeURIComponent(marca)}`);
                const data = response;
                console.log("Modelos recibidos:", data);

                setModelosDisponibles(response); // Actualiza el estado con los modelos únicos
                console.log("Modelos disponibles para la marca:", response);



            } catch (error) {
                console.error("Error al obtener modelos por marca:", error);
                setModelosDisponibles([]); // En caso de error, limpia los modelos disponibles
            }
        };

        const applyFilters = () => {
            const params = {};
            if (selectedFilters.marca) params.marca = selectedFilters.marca;
            if (selectedFilters.modelo) params.modelo = selectedFilters.modelo;
            if (selectedFilters.categoria) params.categoria = selectedFilters.categoria;

            fetchWithFallback(`/productos/`, { params })
                .then((response) => setProductos(response.data))
                .catch((error) => console.error("Error al aplicar filtros:", error));
        };

        const handleSearch = () => {
            const { marca, modelo, categoria } = selectedFilters;        
            const params = {
                ...(marca && { marca }),
                ...(modelo && { modelo }),
                ...(categoria && { categoria }),
            };
        
            fetchWithFallback(`/productos`, { params })
            .then((response) => {
                console.log("Resultados de búsqueda:", response.data);
                setProductos(response.data); // Actualiza los productos en el estado
                // Construye la URL con los parámetros para la redirección
                const searchParams = new URLSearchParams(params).toString();
                console.log('Aplique estos filtros desde productLists.js',{searchParams})

                navigate(`/search?${searchParams}`); // Redirige a SearchResults con los parámetros de búsqueda
            })
            .catch((error) => {
                console.error("Error al realizar la búsqueda:", error.message);
                if (error.response) {
                    console.error("Detalles del error del servidor:", error.response.data);
                } else {
                    console.error("Error sin respuesta del servidor");
                }
            });
        };
        
        const renderModelosOptions = () => {
            if (!Array.isArray(modelosDisponibles)) {
                return (
                    <MenuItem value="" disabled>
                        No hay modelos disponibles
                    </MenuItem>
                );
            }
        
            if (modelosDisponibles.length === 0) {
                return (
                    <MenuItem value="" disabled>
                        No hay modelos disponibles
                    </MenuItem>
                );
            }
        
            return modelosDisponibles.map((modelo, index) => (
                <MenuItem key={index} value={modelo}>
                    {modelo}
                </MenuItem>
            ));
        };
        
        const [productosDestacados, setProductosDestacados] = useState([]);
    
        useEffect(() => {
            fetchProductosDestacados();
        }, []);
    
        const fetchProductosDestacados = async () => {
            try {
                const response = await fetchWithFallback(`/productos/destacados-descuento`);
                console.log('Productos destacados que trae la apo:',response)
                setProductosDestacados(response);

            } catch (error) {
                console.error("Error al obtener productos destacados:", error.message);
                setErrorMessage("No se pudieron cargar los productos destacados.");
            }
        };

        //FUNCION QUE TOMA LOS LOGOS DE LA LISTA DE TIENDAS
        const getStoreLogo = (storeName) => {
            // Normaliza los nombres para compararlos sin importar mayúsculas, minúsculas o espacios
            const normalizeString = (str) => str?.toLowerCase().replace(/\s+/g, '') || '';
        
            // Normaliza el nombre de la tienda
            const normalizedStoreName = normalizeString(storeName);
        
            // Busca el logo correspondiente
            const logo = tienda.find((tienda) => normalizeString(tienda.alt) === normalizedStoreName);
        
            return logo ? logo.src : null; // Devuelve la URL del logo o null si no se encuentra
        };
    
        
        return (
                <Container 
                maxWidth="lg" // Cambia a lg para añadir márgenes laterales.
                sx={{
                    //NO MOVER
                    //p: { xs: 2, md: 4 }, // Espaciado interno
                    //mt: 1,
                    p: 0, // Elimina el padding interno
                    mt: 0, // Elimina el margen superior
                }}>
                    {/* Sección de fondo y filtros */}
                    <Box
                    id="inicio"
                    sx={{
                        width: '100vw',
                        height:  { xs: '50vh', md: '60vh' },
                        minHeight: { xs: '70vh', md: '60vh' },
                        height: { xs: '70vh', md: '60vh' },
                        transform: 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative', // Cambiado de 'absolute' a 'relative'
                        left: '50%', // Posiciona el contenedor al centro horizontalmente
                        transform: 'translateX(-50%)', // Corrige el desalineamiento por el `left`

                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        color: 'white',
                        mb: 0,
                        p: 0,
                        ml: 0, // Sin margen izquierdo
                        mr: 0, // Sin margen derecho
                        zIndex: 2,
                        overflow: 'hidden',
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
                            backgroundImage: 'url(https://guiaautomotrizcr.com/wp-content/uploads/2023/04/porqu.jpeg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            filter: 'blur(4px)',
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
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            zIndex: 2,
                        }}
                    />

                        <Typography 
                        variant="h3" 
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            color: 'white',
                            position: 'relative',
                            zIndex: 3,// Encima del overlay
                            fontSize: { xs: '1.5rem', md: '2.5rem' }, // Ajustar tamaño del texto
                            mb: 2, // Margen inferior
                        }}
                        >
                             Encuentra el respuesto que estas buscando
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                position: 'relative',
                                zIndex: 3,
                                fontSize: { xs: '0.9rem', md: '1rem' }, // Ajustar tamaño del texto
                                mb: 4, // Margen inferior

                            }}
                        >
                            Tenemos más de 10.000 repuestos para ti
                        </Typography>
        
                        <Box
                            sx={{
                                position: 'relative',// Asegura que los menús se posicionen de forma adecuada
                                zIndex: 3,
                                overflow: 'visible', // Permite que los menús sean visibles fuera del contenedor

                                display: 'flex',
                                flexWrap: 'wrap', // Permitir que los filtros se acomoden en filas
                                gap: 2,// Espaciado entre los elementos
                                justifyContent: 'center', // Centrar los elementos horizontalmente
                                alignItems: 'center', // Centrar verticalmente
                                padding: 2, // Espaciado interno
                                height: { xs: '100%', md: 'auto' }, // Asegura altura adaptativa en pantallas pequeñas
                                maxWidth: '600px', // Limita el ancho para mantenerlo dentro del contenedor
                                margin: '0 auto', // Centra horizontalmente el contenedor
                                overflow: 'visible', // Permitir que los menús desplegables sean visibles
                                width: { xs: '90%', md: '60%' }, // Ajustar ancho para pantallas pequeñas

                                //mt: { xs: 2, md: 4 }, // Reducir el margen superior en pantallas pequeñas
                                //p: 2, // Agregar padding interno
                                mt: 0, // Ajusta el margen superior
                                p: 0,  // Ajusta el padding
                                maxWidth: '100%', // Limitar el ancho al tamaño del contenedor
                                boxSizing: 'border-box', // Asegurarse de que padding no aumente el tamaño total
                            }}
                        >

                        {/* Filtro de Marca */}
                        <Box sx={{ minWidth: 200 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Marca
                        </Typography>
                            <Select
                            id="marca"
                            value={selectedFilters.marca ?? ''}// Usa el valor de marca en selectedFilters
                            onChange={(event) => {
                                const marca = event.target.value;
                                setSelectedFilters((prevFilters) => ({
                                    ...prevFilters,
                                    marca,
                                    modelo: '', // Limpia el modelo cuando cambia la marca
                                }));
                                fetchModelosPorMarca(marca); // Carga los modelos para la marca seleccionada
                            }}
                            displayEmpty
                            defaultValue=""
                            sx={{
                                width: '200px', // Tamaño fijo para mantener uniformidad
                                maxWidth: '300px', // Limitar el tamaño máximo                                
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                                '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Limita la altura del menú
                                        overflowY: 'auto', // Habilita el scroll vertical
                                    },
                                },
                            }}
                            >
                            <MenuItem value="">Selecciona una marca</MenuItem>
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
                        </Box>

                        {/* Filtro de Modelo */}
                        <Box sx={{ minWidth: 200 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Modelo: 
                        </Typography>
                            <Select
                            id="modelo"
                            value={selectedFilters.modelo || ''} // Usa el valor de modelo en selectedFilters
                            onChange={(event) =>
                                setSelectedFilters((prevFilters) => ({
                                    ...prevFilters,
                                    modelo: event.target.value,
                                }))
                            }
                            disabled={!selectedFilters.marca} // Deshabilita si no hay marca seleccionada
                            displayEmpty
                            defaultValue=""
                            renderValue={(selected) => {
                                if (!selected) {
                                    return "Seleccione un modelo"; // Texto predeterminado
                                }
                                return selected; // Muestra el modelo seleccionado
                            }}
                            sx={{
                                width: { xs: '90%', sm: '200px' }, // Tamaño responsivo: 90% en pantallas pequeñas, fijo en pantallas grandes
                                maxWidth: '300px', // Limitar el tamaño máximo                                
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                                '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Limita la altura del menú
                                        overflowY: 'auto', // Habilita el scroll vertical
                                    },
                                },
                            }}
                            >
                            {/* Opciones del Select */}
                            {Array.isArray(modelosDisponibles) && modelosDisponibles.length > 0 ? (
                                modelosDisponibles.map((modelo, index) => (
                                    <MenuItem key={index} value={modelo}>
                                        {modelo}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No hay modelos disponibles
                                </MenuItem>
                            )}

                            {renderModelosOptions()}
                            </Select>
                        </Box>

                        {/* Filtro de Categoría */}
                        <Box sx={{ minWidth: 200 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Categoria:
                        </Typography>
                            <Select
                            id="categoria"
                            value={selectedFilters.categoria || ''} // Usa el valor de categoría en selectedFilters
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedFilters((prev) => ({
                                    ...prev,
                                    categoria: value, // Solo actualiza el estado local
                                }));
                            }}
                            displayEmpty
                            defaultValue=""
                            sx={{
                                width: { xs: '90%', sm: '200px' }, // Tamaño responsivo: 90% en pantallas pequeñas, fijo en pantallas grandes
                                maxWidth: '300px', // Limitar el tamaño máximo
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                },
                                '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Limita la altura del menú
                                        overflowY: 'auto', // Habilita el scroll vertical
                                    },
                                },
                            }}
                            >
                            <MenuItem value="">Selecciona una categoría</MenuItem>
                            {CATEGORIES.map((category, index) => (
                                <MenuItem key={index} value={category.value}>
                                    {category.label}
                                </MenuItem>
                            ))}
                            </Select>
                        </Box>

                        {/* Botón de Buscar */}
                        <Box sx={{ minWidth: 150, textAlign: 'center', mt:3 }}>
                        <Button
                            variant="contained"
                            onClick={handleSearch}

                            
                            sx={{
                                width: { xs: '90%', sm: '150px' }, // Ancho responsivo
                                backgroundColor: '#FFCC00', // Color naranja para resaltar
                                height: '40px', // Iguala la altura de los select
                                color: 'black',
                                fontWeight: 'bold',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                '&:hover': {
                                backgroundColor: '#e64a19',
                                },
                            }}
                            >
                            Buscar
                            </Button>
                        </Box>
                        </Box>
                    </Box>
    
        
                    {/* Sección de Categorías */}   
                    <Box  id="categorias" 
                    sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 3, mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                            Principales Categorias
                        </Typography>
                        <Slider 
                        {...carouselSettings}>
                            {categorias.map((categoria, index) => (
                                <Box key={index} sx={{p: 1, width: 200 }}>
                                    <Card
                                        onClick={() => handleCategoriaClick(categoria.nombre)}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',

                                            height: { xs: 180, sm: 200, md: 250 }, // Altura responsiva
                                            width: { xs: 140, sm: 180, md: 200 }, // Ancho responsivo
                                            mx: 'auto', // Centra la tarjeta
                                            boxShadow: 3, // Sombra de la tarjeta
                                            borderRadius: 2,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)', // Efecto al pasar el mouse
                                            },
                                            padding: 2, // Espaciado interno para separar imagen y título

                                        }}                                    >
                                        {/* Contenedor de la imagen */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '70%', // Ocupa el 70% de la tarjeta
                                                width: '100%',
                                            }}>
                                            <CardMedia
                                                component="img"
                                                image={categoria.imageUrl}
                                                alt={categoria.nombre}
                                                sx={{
                                                    maxHeight: { xs: 80, sm: 100, md: 120 }, // Altura máxima responsiva
                                                    maxWidth: '100%', // Ajusta el ancho al contenedor
                                                    objectFit: 'contain', // Asegura que la imagen se ajuste sin recortes
                                                }}
                                            />
                                        </Box>
                                        <CardContent 
                                                sx={{
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexGrow: 1, // Permite que el contenido se ajuste dinámicamente
                                                }}>
                                            <Typography variant="subtitle1"
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' }, // Tamaño del texto responsivo
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis', // Muestra puntos suspensivos si el texto es muy largo
                                            }}
                                            >
                                            {categoria.nombre}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
        
                    {/* Sección de Marcas */}
                    <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 3, mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                         Principales Marcas
                        </Typography>
                        <Slider {...carouselSettings}>
                            {InicioMarcas.map((marca, index) => (
                                <Box key={index} sx={{ p: 1, width: 200 }}>
                                    <Card
                                        onClick={() => handleMarcaClick(marca.nombre)}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',

                                            height: { xs: 180, sm: 200, md: 250 }, // Altura responsiva
                                            width: { xs: 140, sm: 180, md: 200 }, // Ancho responsivo
                                            mx: 'auto', // Centra la tarjeta
                                            boxShadow: 3, // Sombra de la tarjeta
                                            borderRadius: 2,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)', // Efecto al pasar el mouse
                                            },
                                        }}                                         >
                                         {/* Contenedor de la imagen */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '70%', // Ocupa el 70% de la tarjeta
                                                width: '100%',
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={marca.imageUrl}
                                                alt={marca.nombre}
                                                sx={{
                                                    maxHeight: { xs: 80, sm: 100, md: 120 }, // Altura máxima responsiva
                                                    maxWidth: '100%', // Ajusta el ancho al contenedor
                                                    objectFit: 'contain', // Asegura que la imagen se ajuste sin recortes
                                                }}
                                            />
                                        </Box>
                                        <CardContent 
                                        sx={{
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexGrow: 1, // Permite que el contenido se ajuste dinámicamente
                                        }}
                                        >
                                            <Typography variant="subtitle1"
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' }, // Tamaño del texto responsivo
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis', // Muestra puntos suspensivos si el texto es muy largo
                                            }}
                                            >
                                            {marca.nombre}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>

                   {/* Sección de Suscripción */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: 'url("https://guiaautomotrizcr.com/wp-content/uploads/2023/04/porqu.jpeg")', // Imagen de fondo
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            py: 8, // Espaciado vertical
                            width: '100vw', // Asegura que ocupe todo el ancho de la página
                            marginLeft: 'calc(-50vw + 50%)', // Truco para evitar el contenedor limitado por Material-UI
                            position: 'relative',
                            color: 'white',
                            textAlign: 'center',
                            overflow: 'hidden', // Evita que los elementos hijos se desborden
                        }}
                    >
                        {/* Difuminado sobre la imagen */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Capa oscura con opacidad
                                filter: 'blur(4px)', // Difuminado

                                zIndex: 2,
                            }}
                        />
                        {/* Contenido de la sección */}
                        <Box
                            sx={{
                                position: 'relative', // Asegura que el contenido esté por encima del difuminado
                                zIndex: 2, // Eleva el contenido para que no quede debajo del fondo
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    fontSize: { xs: '1.5rem', md: '2.5rem' }, // Texto responsivo

                                }}
                            >
                                Suscríbete y recibe ofertas exclusivas
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    fontSize: { xs: '0.9rem', md: '1.2rem' }, // Texto responsivo

                                }}
                            >
                                Ingresa tu correo electrónico para estar al día con nuestras novedades.
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    flexDirection: { xs: 'column', sm: 'row' }, // Coloca el botón debajo en pantallas pequeñas

                                }}
                            >
                                <TextField
                                    variant="outlined"
                                    placeholder="Tu correo electrónico"
                                    fullWidth // Hace que el botón ocupe todo el ancho en pantallas pequeñas
                                    sx={{
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        '& input': { color: 'black' },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    //color="primary"
                                    fullWidth // Hace que el botón ocupe todo el ancho en pantallas pequeñas

                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        fontSize: { xs: '0.8rem', sm: '1rem' }, // Tamaño responsivo del texto
                                        backgroundColor: '#FFCC00', // Color naranja para resaltar
                                        color: 'black',
                                    }}
                                >
                                    Suscribirse
                                </Button>
                            </Box>
                        </Box>
                    </Box>




                    {/* Productos Destacados */}
                    <Box 
                    sx={{ bgcolor: '#f0f0f0',
                        borderRadius: 2,
                        p:1 ,
                        mb: 5,
                     }}
                    >
                        <div className="mt-8 px-4 relative">
                        <h2 className="text-2xl font-bold mb-4">
                            Productos Destacados
                        </h2>
                        <Slider
                            {...settings}
                            arrows={false} // Eliminamos las flechas
                            autoplay={true} // Activamos el desplazamiento automático
                            autoplaySpeed={2000} // Intervalo de 2 segundos
                        >
                            {productosDestacados.map((producto, index) => (
                                <div key={index} className="px-2">
                                    <Link to={`/product/${producto._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {/* Enlace al ProductDetails.js con el ID */}
                                        <div className="bg-white shadow-md rounded-lg overflow-hidden text-center">
                                        <CardMedia
                                            component="img"
                                            image={producto.imagenUrl || 'https://via.placeholder.com/200'}
                                            alt={producto.nombre}
                                            sx={{
                                                width: '100%', // Ajusta al ancho del contenedor
                                                height: { xs: '120px', sm: '150px', md: '200px' }, // Altura variable por pantalla
                                                objectFit: 'contain', // Ajusta la imagen dentro del contenedor sin recortar
                                                borderRadius: '8px', // Opcional: redondea los bordes
                                                backgroundColor: '#f5f5f5', // Opcional: fondo para imágenes transparentes
                                                padding: '10px', // Opcional: espacio interno
                                            }}
                                        />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                                                <p className="text-green-500 font-bold mt-2">
                                                    ${producto.precio_actual.toLocaleString("es-CL")}
                                                </p>

                                                {/*Descuento*/}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: producto.descuentoRelativo ? 'red' : 'gray', // Rojo si hay descuento
                                                        fontWeight: 'bold', // Negrita para resaltar
                                                        textAlign: 'center', // Centrado del texto
                                                    }}
                                                >
                                                    {producto.descuentoRelativo
                                                        ? `Descuento: ${Math.round(producto.descuentoRelativo)}%` // Redondea y agrega el símbolo %
                                                        : 'Sin descuento'}
                                                </Typography>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                        </div>
                    </Box>


                   
                    {/* Sección para los logos de tiendas */}
                    <Box sx={{ mt: 4 }}>
                        {/* Título */}
                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                mb: 2,
                            }}
                        >
                            Tiendas disponibles
                        </Typography>

                        {/* Logos de las tiendas */}
                        <Grid container spacing={2} justifyContent="center">
                            {tienda.map((store, index) => (
                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                    lg={2}
                                    key={index}
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Logo en blanco y negro */}
                                    <img
                                        src={store.src}
                                        alt={store.alt}
                                        style={{
                                            width: '100%', // Ajusta el tamaño de las imágenes
                                            height: '80px',
                                            objectFit: 'contain',
                                            marginBottom: '8px',
                                            filter: 'grayscale(100%)', // Aplica el filtro en blanco y negro
                                            transition: 'filter 0.3s ease', // Efecto suave al pasar el ratón
                                        }}
                                        onMouseOver={(e) => (e.target.style.filter = 'grayscale(0%)')} // Color al pasar el ratón
                                        onMouseOut={(e) => (e.target.style.filter = 'grayscale(100%)')} // Blanco y negro al salir
                                    />
                                    {/* Nombre de la tienda */}
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {store.alt}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

            </Container>
        );
    }

    export default ProductList;
