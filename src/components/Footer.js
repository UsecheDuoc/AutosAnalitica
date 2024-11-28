// src/components/Footer.js
import React, { useState }  from "react";
import { Box, Typography, Grid, TextField, Button, Divider, Link } from "@mui/material";
import { Facebook, Twitter, YouTube } from "@mui/icons-material";
import { useNavigate,useLocation } from 'react-router-dom';


const categories = [
  { name: 'Inicio', id: 'inicio' },
  { name: 'Categorías', id: 'categorias' },
  { name: 'Dashboard', href: '/graficos' }, // Incluye el href aquí
  { name: 'Suscripción', id: 'suscripcion' },
];

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (id, href) => {
      if (id) {
        if (location.pathname !== '/') {
          navigate('/'); // Navega primero al inicio si estás en otra página.
          setTimeout(() => handleScrollToSection(id), 100); // Desplázate después de navegar.
        } else {
          handleScrollToSection(id); // Desplázate directamente si ya estás en la página principal.
        }
      } else if (href) {
        navigate(href); // Redirige directamente si hay un `href`.
      }
    };

  const handleScrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };



  return (
    <Box sx={{ bgcolor: "#000000", color: "#e5e7eb", px: { xs: 4, md: 12 }, py: 6 }}>
      <Grid container spacing={4}>
        {/* Logo y Redes Sociales */}
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src="data:image/png;base64,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"
              alt="Logo"
              width="111"
            />
            <Typography variant="h6" fontWeight="bold" textTransform="uppercase">
              Autos
              Analítica
            </Typography>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            <Link href="#" color="inherit">
              <Facebook />
            </Link>
            <Link href="#" color="inherit">
              <Twitter />
            </Link>
            <Link href="#" color="inherit">
              <YouTube />
            </Link>
          </Box>
        </Grid>

        {/*Secciones*/}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" mb={2} color="#ffffff">
            Accesos Rápido
          </Typography>
            {/* Botones de categorías en pantallas grandes */}
            <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column', // Organiza los elementos en columna (uno debajo del otro)
                        alignItems: 'flex-start', // Alinea los textos a la izquierda
                        gap: 1, // Espaciado entre los elementos
                    }}
                    >
                    {categories.map((category) =>
                        category.id ? (
                        <button
                            key={category.name}
                            onClick={() => handleNavigation(category.id, null)}
                            style={{
                            background: 'none',
                            border: 'none',
                            color: '#FFD700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            }}
                        >
                            {category.name}
                        </button>
                        ) : (
                        <button
                            key={category.name}
                            onClick={() => handleNavigation(null, category.href)}
                            style={{
                            background: 'none',
                            border: 'none',
                            color: '#FFD700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            }}
                        >
                            {category.name}
                        </button>
                        )
                    )}
                    </Box>
        </Grid>

        {/* Newsletter Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" textTransform="uppercase" mb={2} color="#ffffff">
            Notificaciones
          </Typography>
          <Typography variant="body2" mb={2}>
            Te enviaremos notificaciones.
          </Typography>
          <Box display="flex">
            <Button
              variant="contained"
              //onClick={() => handleNavigation(null, Suscripcion.id)}
              sx={{
                backgroundColor: '#FFCC00', // Color naranja para resaltar
                color: 'black',
                fontWeight: "bold",
                borderRadius: "0 4px 4px 0",
                "&:hover": {
                  color: 'black', 

                },
              }}
            >
                Suscribirse 
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ borderColor: "gray.500", my: 4 }} />

      {/* Footer Bottom */}
      <Typography variant="body2" textAlign="center">
        © {new Date().getFullYear()} Autos Analítica S.A.
      </Typography>
    </Box>
  );
}

export default Footer;
