// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Box, Select, MenuItem,Link,  Drawer,List, ListItem, ListItemButton, ListItemText, } from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate,useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const categories = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Categorías', id: 'categorias' },
    { name: 'Dashboard', href: '/graficos' }, // Incluye el href aquí
  ];

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    const handleCategorySelect = (category) => {    
        console.log('Selected Category:', category);
        // Aquí puedes agregar la lógica para filtrar o mostrar los productos de la categoría seleccionada
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    // Nueva función para manejar el clic en el logo
    const handleLogoClick = () => {
        setSearchQuery('');  // Limpia la barra de búsqueda
        navigate('/');       // Redirige al inicio
    };
    
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
        <AppBar 
            position="sticky"
            sx={{ 
                bgcolor: '#000', 
                boxShadow: 3, // Agregar sombra al navbar

                //margin: 0,
                //padding: 0, 
                padding: { xs: '10px', md: '10px 20px' }, // Ajustar padding para pantallas pequeñas
            }}>
            
            <Toolbar
                sx={{
                display: 'flex',
                justifyContent: 'space-around', // Cambia a 'space-around' para distribuir los elementos de manera uniforme
                alignItems: 'center',
                maxWidth: '1400px',
                width: '100%',
                mx: 'auto',
                px: { xs: 2, md: 4 },
                }}
            >


                {/* Drawer para menú en pantallas pequeñas */}
                <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                    <List>
                    {categories.map((category) => (
                        <ListItem key={category.name} disablePadding>
                            <ListItemButton onClick={() => handleNavigation(category.id, category.href || null)}>
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                </Box>
                </Drawer>


                {/* Logo */}
                <Typography
                variant="h5"
                onClick={handleLogoClick}
                sx={{
                    fontWeight: 'bold',
                    color: '#FFD700',
                    cursor: 'pointer',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    ml: { md: '0' },
                }}
                >
                AutosAnalítica
                </Typography>

                {/* Barra de búsqueda */}
                <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                    borderRadius: 1,
                    px: 2,
                    width: { xs: '100%', sm: '60%', md: '40%' },
                    maxWidth: '600px',
                    mx: 'auto',
                    boxShadow: 1,
                }}
                >
                <InputBase
                    placeholder="Buscar productos…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <IconButton type="submit" sx={{ color: 'black' }}>
                    <SearchIcon />
                </IconButton>
                </Box>

                {/* Menú de hamburguesa en pantallas pequeñas */}
                <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setDrawerOpen(true)}
                >
                <MenuIcon />
                </IconButton>

                {/* Botones de categorías en pantallas grandes */}
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 2,
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


            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
