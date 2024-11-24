import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate  } from 'react-router-dom';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Box, Button,IconButton , Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slick';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import config from '../config';
import { fetchWithFallback } from "../utils/api"; //URL de utils en componentes principales

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

console.log('ProductDetails montado');


function Arrow(props) {
    const { className, style, onClick, icon } = props;
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                ...style,
                display: 'block',
                background: 'black',
                borderRadius: '50%',
                padding: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 1,
            }}
        >
            {icon}
        </div>
    );
}





function ProductDetails() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const placeholderImage = 'https://via.placeholder.com/150';
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productosDestacados, setProductosDestacados] = useState([]);

    //Productos destacados
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



    // Función para manejar la selección de un producto relacionado
    const handleRelatedProductClick = (relatedProductId) => {
        navigate(`${relatedProductId}`);
        console.log('Lo que tomo de la url para id: ', relatedProductId)
    };

    useEffect(() => {
        const fetchData = async () => {
            const productRequest = await fetchWithFallback(`/productos/${encodeURIComponent(id)}`);
            const similarProductsRequest = fetchWithFallback(`/productos/buscar-similares?id=${id}`);
            const relatedProductsRequest = fetchWithFallback(`/productos/relacionados/${id}`);
    
            const results = await Promise.allSettled([
                productRequest,
                similarProductsRequest,
                relatedProductsRequest,
            ]);
    
            // Manejo de resultados de cada solicitud
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const data = result; // Asegúrate de que siempre sea un array
                    console.log('Lo que me trae el primer fetch',data)
                    switch (index) {
                        case 0: // Detalles del producto
                            console.log("Producto obtenido:", result.value);
                            setProducto(result.value);
                            setErrorMessage(null);
                            break;
                        case 1: // Productos similares
                            console.log("Productos similares:", result);
                            setSimilarProducts(Array.isArray(result.value) ? result.value.slice(0, 3) : []); // Verificar que sea un array
                            break;
                        case 2: // Productos relacionados
                            console.log("Productos relacionados:", result);
                            setRelatedProducts(Array.isArray(result.value) ? result.value : []); // Verificar que sea un array
                            break;
                        default:
                            break;
                    }
                } else {
                    console.error(`Error en la solicitud ${index}:`, result.reason);
                    // Manejo de errores para cada caso
                    switch (index) {
                        case 0:
                            setErrorMessage("Error al obtener los detalles del producto.");
                            break;
                        case 1:
                            setSimilarProducts([]); // Asegura que sea un array vacío
                            break;
                        case 2:
                            setRelatedProducts([]); // Asegura que sea un array vacío
                            break;
                        default:
                            break;
                    }
                }
            });
        };
    
        fetchData();
    }, [id]);
    
    
    {/* Productos Relacionados */}
    // Llamada para obtener los detalles del producto basado en el ID
    useEffect(() => {
        fetchProductDetails(id);

        // Al cambiar el producto, desplazarse al inicio de la página
        window.scrollTo(0, 0);
    }, [id]);

    {/* Descuento de productos */}
    useEffect(() => {
        fetchWithFallback(`/productos/productos-con-descuento`)
            .then(response => {
                setProductos(response.data); // `descuento` y `aumento` ahora están disponibles en cada producto
            })
            .catch(error => console.error("Error al obtener productos:", error));
    }, []);
    //const productosConDescuento = productos.filter(producto => producto.descuento > 0);

  
    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const response = await fetchWithFallback(`/productos/relacionados/${id}`);
                const data = await response;
                console.log("Productos relacionados (API con fallback):", data);
                setRelatedProducts(data);
            } catch (error) {
                console.error("Error al obtener productos relacionados:", error);
                setRelatedProducts([]); // Asegura que el estado no sea indefinido en caso de error
            }
        };
    
        fetchRelated();
    }, [id]);



    const handlePurchase = (link) => {
        if (link) {
            window.open(link, "_blank");
        } else {
            alert("El enlace de compra no está disponible.");
        }
    };

    const fetchProductDetails = async (id) => {
        setIsLoading(true); // Inicia el estado de carga

        // Aquí deberías agregar la lógica para obtener los detalles del producto basado en el ID
        // Ejemplo:
        try {
            const response = await fetchWithFallback(`/productos/${id}`);
            const data = await response;
            setProduct(data);
            // Suponiendo que el producto tiene un campo 'relatedProducts'
            setRelatedProducts(data.relatedProducts || []);
        } catch (error) {
            console.error("Error fetching product details:", error);
            //setErrorMessage("Error al obtener los detalles del producto. Intenta más tarde.");
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
    }    };

    if (errorMessage) {
        return <Typography variant="h6" align="center">{errorMessage}</Typography>;
    }

    if (!producto) return <Typography variant="h6" align="center">Cargando producto...</Typography>;

    // Configuración del gráfico de historial de precios
    const priceHistoryData = {
        labels: producto.historial_precios?.map((precio) => precio.fecha) || [],
        datasets: [
            {
                label: 'Precio',
                data: producto.historial_precios?.map((precio) => precio.precio) || [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 4,
            },
        ],
    };

    // Definir las variables para el cálculo de descuento o aumento
    // Calcular el último precio en el historial de precios y el cambio porcentual
    const lastPrice = producto.historial_precios?.length
    ? producto.historial_precios
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .at(-2)?.precio//Prnultimo precio del array historial
    : null;

    //formula para calcular el porcentaje de cambio respoecto al penultimo precio
    const priceDifference = lastPrice !== null ? producto.precio_actual - lastPrice : 0;
    const percentageChange =
    lastPrice !== null
        ? Math.round(Math.abs(priceDifference / lastPrice) * 100)
        : 0;

    
        // Mostrar por consola los valores
    console.log("Precio actual:", producto.precio_actual);
    console.log("Último precio en historial:", lastPrice);
    console.log("Diferencia de precio:", priceDifference);
    console.log("Cambio porcentual:", percentageChange);
    // Definir el estado del precio en base a la comparación
    const estado = priceDifference > 0
        ? `Aumentó: ${percentageChange}%`
        : priceDifference < 0
        ? `Bajó: ${percentageChange}%`
        : "Sin cambios";



    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        prevArrow: <IconButton sx={{ fontSize: 30, position: 'absolute', left: 10, top: '40%', zIndex: 10 }}>{"<"}</IconButton>,
        nextArrow: <IconButton sx={{ fontSize: 30, position: 'absolute', right: 10, top: '40%', zIndex: 10 }}>{">"}</IconButton>

    };

    // Definición de las opciones del gráfico `priceHistoryOptions`
    const priceHistoryOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Precio: $${context.raw.toLocaleString('es-CL')}`
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Precio (CLP)'
                },
                beginAtZero: false
            }
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

    // Configuración del carrusel para productos relacionados
    const productCarouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Por defecto muestra 3 elementos
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1280, // Pantallas grandes
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024, // Pantallas medianas
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // Tablets y pantallas pequeñas
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

        if (isLoading) {
        return <Typography variant="h6" align="center">Cargando producto...</Typography>;
    }

    if (errorMessage) {
        return <Typography variant="h6" align="center" color="error">{errorMessage}</Typography>;
    }


    return (
        <Container     >

            
            {/* Detalles del producto */}
            <Paper elevation={4} sx={{ p: 2, width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={producto.imagenUrl || placeholderImage}
                    alt={producto.nombre}
                    sx={{ width: { xs: '100%', md: '40%' }, mr: { md: 3 }, borderRadius: 2 }}
                />
                <Box sx={{ flex: 1, mt: { xs: 3, md: 0 },width: '100%'  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {producto.nombre}
                    </Typography>
                    
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: estado.includes('Bajó') ? 'green' : estado.includes('Aumentó') ? 'red' : 'gray' 
                        }}
                    >
                        {estado || 'Estado no disponible'}
                    </Typography>


                    <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                        Precio: {producto.precio_actual ? producto.precio_actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : "-"}
                    </Typography>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handlePurchase(producto.LinkPagina)}
                        sx={{ mt: 3, py: 1, fontSize: '1.1rem' }}
                    >
                        Comprar
                    </Button>
                </Box>
            </Paper>




             {/* Caracteristicas del producto */}
             <Accordion sx={{ mt: 4 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Características del producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2,
                            p: 2,
                            bgcolor: '#f9f9f9',
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                    >
                        {/* Recuadros de características */}
                        {producto && (
                            <>
                                {/*Marca*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Marca:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.marca !== "null" && producto.marca !== undefined ? producto.marca : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Modelo:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Modelo:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.modelo !== "null" && producto.modelo !== undefined ? producto.modelo : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Categoría:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Categoría:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.categoria !== "null" && producto.categoria !== undefined ? producto.categoria : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Color:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Color:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {producto.color !== "null" && producto.color !== undefined ? producto.color : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Caracteristica:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Característica:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.caracteristica !== "null" && producto.caracteristica !== undefined ? producto.caracteristica : 'No especificado'}

                                    </Typography>
                                </Box>

                                {/*Numero de pieza:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Numero de pieza:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.numero_pieza !== "null" && producto.numero_pieza !== undefined ? producto.numero_pieza : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Tipo de vehiculo:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Tipo de vehiculo:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.tipo_vehiculo !== "null" && producto.tipo_vehiculo !== undefined ? producto.tipo_vehiculo : 'No especificado'}
                                    </Typography>
                                </Box>

                                {/*Material:*/}
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                    }}
                                >

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Material:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {producto.material !== "null" && producto.material !== undefined ? producto.material : 'No especificado'}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>




                </AccordionDetails>
            </Accordion>

            {/* Descripcion del producto */}
            <Accordion sx={{ mt: 4 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Descripción del producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        {producto.descripcion}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Historial de precios */}
            <Paper elevation={4} sx={{ mt: 4, p: 2, width: '100%' }}>
                <Typography variant="h6" gutterBottom>Historial de Precios</Typography>
                <Line data={priceHistoryData} options={priceHistoryOptions} height={100} width={400} />
            </Paper>

            {/* Comparación con productos similares */}
{/* Comparación con productos similares */}
<Paper elevation={4} sx={{ p: 2, mt: 4, mb: 5, borderRadius: 6, width: '100%' }}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
    Compara con otros productos similares
  </Typography>

  <Box sx={{ display: 'flex', overflowX: 'auto', p: 1, gap: 2 }}>
    {/* Contenedor de títulos fijos */}
    <Box
      sx={{
        minWidth: '120px',
        flexShrink: 0,
        textAlign: 'right',
        mr: 2,
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 2,
        borderRight: '1px solid #ddd',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Alinear verticalmente
        height: '100%',
      }}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>Opiniones</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Precio</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Marca</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Modelo</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Color</Typography>
    </Box>

    {/* Carrusel de productos */}
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
      {[producto, ...similarProducts].map((prod, index) => (
        <Box
          key={index}
          sx={{
            minWidth: { xs: '200px', sm: '220px' }, // Ajustar ancho
            border: '1px solid #ddd',
            borderRadius: 3,
            boxShadow: 2,
            backgroundColor: 'white',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* Imagen del producto */}
          <Box
            sx={{
              width: '100%',
              height: { xs: '120px', sm: '140px' },
              backgroundImage: `url(${prod.imagenUrl || placeholderImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              borderBottom: '1px solid #ddd',
            }}
          />

          {/* Información del producto */}
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 'bold', mb: 1, fontSize: '0.85rem' }}
            >
              {prod.nombre}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: index === 0 ? 'textSecondary' : 'primary', mb: 1 }}
            >
              {index === 0 ? '(Producto actual)' : 'Ver producto'}
            </Typography>

            <Box sx={{ textAlign: 'left', mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Opiniones:</strong> {prod.opiniones || '-'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Precio:</strong>{' '}
                {prod.precio_actual
                  ? `$${prod.precio_actual.toLocaleString('es-CL')}`
                  : '-'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Marca:</strong> {prod.marca || '-'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Modelo:</strong> {prod.modelo || '-'}
              </Typography>
              <Typography variant="body2">
                <strong>Color:</strong> {prod.color || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
</Paper>



            






            
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




        </Container>
    );
}

export default ProductDetails;
