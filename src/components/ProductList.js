    // src/components/ProductList.js
    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button,IconButton, Pagination } from '@mui/material';
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

    const brands = [
        { src: 'logos/logo-repuestosCoroca.png', alt: 'Repuestos Coroca' },
        { src: '/logos/logo-repuestosCoroca.png', alt: 'Repuestos MaraCars' },
        { src: '/logo-repuestosCoroca.png', alt: 'Repuestos CYR' },
  
    ];


    function ProductList() {
        const [productos, setProductos] = useState([]);
        const [page, setPage] = useState(1);
        const productsPerPage = 20;
        const navigate = useNavigate();
        const [relatedProducts, setRelatedProducts] = useState([]);

        useEffect(() => {
            fetchProductos();
        }, []);

        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}`);
                setProductos(response.data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };

        // Configuración del carrusel para categorías y marcas
        const carouselSettings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4, // Por defecto muestra 4 elementos
            slidesToScroll: 1,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1280, // Pantallas grandes
                    settings: {
                        slidesToShow: 4,
                    },
                },
                {
                    breakpoint: 1024, // Pantallas medianas
                    settings: {
                        slidesToShow: 3,
                    },
                },
                {
                    breakpoint: 768, // Tablets y pantallas pequeñas
                    settings: {
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 480, // Dispositivos móviles
                    settings: {
                        slidesToShow: 1,
                    },
                },
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

        // Función para redirigir a CategoryPage con el nombre de la categoría
        const handleCategoriaClick = (nombreCategoria) => {
            navigate(`/categoria/${nombreCategoria}`);
        };

        // Función para redirigir a CategoryPage con el nombre de la marca
        const handleMarcaClick = (nombreMarca) => {
            navigate(`/marca/${nombreMarca}`);
        };

        const handleChangePage = (event, value) => setPage(value);
        const limitedProducts = productos.slice(0, 5);

        return (
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    {/* Sección de fondo y filtros */}
                    <Box
                        sx={{
                            width: '100vw',
                            height: { xs: '50vh', md: '60vh' },
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
                            mb: 4,
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
                                filter: 'blur(4px)', // Ajusta el nivel de desenfoque según prefieras
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
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, position: 'relative', zIndex: 2,fontSize: { xs: '1.8rem', md: '3rem' }}}>
                        Encuentra el respuesto que estas buscando
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
                        Tenemos más de 10.000 repuestos para ti
                        </Typography>
        
                        {/* Filtros de selección de vehículo */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 2,fontSize: { xs: '1rem', md: '1.2rem' } }}>
                            <Button variant="contained" color="primary" sx={{ width: 150 }}>
                                Select Year
                            </Button>
                            <Button variant="contained" color="primary" sx={{ width: 150 }}>
                                Select Maker
                            </Button>
                            <Button variant="contained" color="primary" sx={{ width: 150 }}>
                                Select Model
                            </Button>
                            <Button variant="contained" color="primary" sx={{ width: 150 }}>
                                Select Engine
                            </Button>
                            <Button variant="contained" color="error" sx={{ width: 150 }}>
                                Search Parts
                            </Button>
                        </Box>
                    </Box>
    
        
                    {/* Sección de Categorías */}
                    <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 3, mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
                            Productos por Categorias
                        </Typography>
                        <Slider {...carouselSettings}>
                            {categorias.map((categoria, index) => (
                                <Box key={index} sx={{ p: 1 }}>
                                    <Card
                                        onClick={() => handleCategoriaClick(categoria.nombre)}
                                        sx={{ cursor: 'pointer', height: 250, width: 300 }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="150"
                                            image={categoria.imageUrl}
                                            alt={categoria.nombre}
                                            sx={{
                                                objectFit: 'contain',
                                                width: '100%',
                                                height: '180px',
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
                            Productos por Marcas
                        </Typography>
                        <Slider {...carouselSettings}>
                            {marcas.map((marca, index) => (
                                <Box key={index} sx={{ p: 1, width: 200 }}>
                                    <Card
                                        onClick={() => handleMarcaClick(marca.nombre)}
                                        sx={{ p: 1, cursor: 'pointer', height: 250, width: 200 }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="150"
                                            image={marca.imageUrl}
                                            alt={marca.nombre}
                                            sx={{
                                                objectFit: 'contain',
                                                width: '100%',
                                                height: '150px',
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


                {/* Productos Destacados */}
                <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p:1 , mb: 5 }}>
                    <div className="mt-8 px-4 relative">
                    <h2 className="text-2xl font-bold mb-4">Productos Destacados</h2>
                    <Slider
                        {...settings}
                        arrows={false} // Eliminamos las flechas
                        autoplay={true} // Activamos el desplazamiento automático
                        autoplaySpeed={2000} // Intervalo de 2 segundos
                    >
                        {limitedProducts.map((producto, index) => (
                        <div key={index} className="px-2">
                            <Link to={`/product/${producto._id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Enlace al ProductDetails.js con el ID */}

                            <div className="bg-white shadow-md rounded-lg overflow-hidden text-center">
                            <img
                                src={producto.imagenUrl || "https://via.placeholder.com/300"}
                                alt={producto.nombre}
                                className="h-44 w-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                                <p className="text-green-500 font-bold mt-2">
                                ${producto.precio_actual.toLocaleString("es-CL")}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">{producto.descripcion}</p>
                            </div>
                            </div>
                            </Link>
                        </div>
                        ))}
                    </Slider>
                    </div>
                </Box>


                {/* Logos de las marcas */}
                <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, p: 1, mb: 6 }}>
                {/* Título de la sección */}
                <Box sx={{ textAlign: 'center', my: 5, pb: 2, borderBottom: '2px solid #ddd' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'black' }}>
                        Tiendas asociadas
                    </Typography>
                </Box>
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    {brands.map((brand, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index} sx={{ textAlign: 'center' }}>
                            <Box
                                component="img"
                                src={brand.src}
                                alt={brand.alt}
                                sx={{
                                    width: '100%',
                                    maxWidth: '150px',
                                    height: 'auto',
                                    margin: '0 auto',
                                    filter: 'grayscale(100%)', // Opcional: efecto en escala de grises
                                    transition: 'filter 0.3s',
                                    '&:hover': {
                                        filter: 'grayscale(0%)', // Restablece el color al pasar el cursor
                                    },
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                </Box>





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
