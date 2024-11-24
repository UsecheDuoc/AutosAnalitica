import React from "react";
import GraficoCategorias from "./GraficoCategorias"; // Gráfico circular para categorías
import GraficoEmpresas from "./GraficoEmpresas";
import { Container, Typography, Box } from '@mui/material';
import GraficoClustering from "./GraficoClustering";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      {/* Sección con imagen de fondo */}
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
          mb: 5,
          p: 2,
          zIndex: 2,
        }}
      >
        {/* Imagen de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzqyFEz-j8Bjl9ZmNTVf1vHZyH2JAAcTM8hw&s)', // Coloca aquí tu URL de la imagen de fondo
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)', // Ajusta el nivel de desenfoque
            zIndex: 1,
          }}
        />
        {/* Capa de superposición oscura */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
            zIndex: 2,
          }}
        />
        {/* Texto encima de la imagen */}
        <Typography
          variant="h3"
          sx={{
            position: 'relative',
            zIndex: 3,
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', md: '3rem' },
          }}
        >
          Dashboard de Análisis
        </Typography>
      </Box>

        {/* Nuevo Box para el texto arriba de las tarjetas */}
        <Box
          sx={{
            backgroundColor: 'white',
            boxShadow: 3,
            borderRadius: 2,
            p: 2, // Espaciado interno
            mb: 3, // Espaciado inferior para separar de las tarjetas
            maxWidth: '100%', // Ajusta el ancho al contenedor
            textAlign: 'center', // Centra el texto dentro del Box
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: 'black', fontSize: { xs: '1rem', md: '1.2rem' } }}
          >
          En esta sección, te ofrecemos un análisis claro de los datos para que tomes decisiones informadas y descubras tendencias clave en nuestros productos.          </Typography>
        </Box>

        {/* Gráficos lado a lado */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '1fr 1fr' }} gap={4}>
          {/* Gráfico de empresas */}
          <Box
            sx={{
              backgroundColor: 'white',
              boxShadow: 3,
              borderRadius: 2,
              p: 2, // Reduce el padding (antes era 4)
              maxWidth: '100%', // Limita el ancho del box (opcional)
              height: 'auto', // Deja que la altura se ajuste automáticamente
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
              Distribución de Productos por Empresa
            </Typography>
            <GraficoEmpresas />
          </Box>

          {/* Espacio reservado para otro gráfico */}
        {/* Gráfico de clustering */}
          <Box
            sx={{
            backgroundColor: "white",
              boxShadow: 3,
              borderRadius: 2,
              p: 2,
              maxWidth: "100%",
              height: "auto",
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Análisis de Clustering
            </Typography>
          <GraficoClustering /> {/* Llama al componente del gráfico de clustering */}
          </Box>
        </Box>

        {/* Sección de productos por categoría */}
        <Box mt={6}>
          <Box
            sx={{
              backgroundColor: 'white',
              boxShadow: 3,
              borderRadius: 2,
              p: 2, // Reduce el padding (antes era 4)
              maxWidth: '100%', // Limita el ancho del box (opcional)
              height: 'auto', // Deja que la altura se ajuste automáticamente
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
              Productos por Categoría
            </Typography>
            <GraficoCategorias />
          </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;

