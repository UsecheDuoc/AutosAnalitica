// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Box, Select, MenuItem } from '@mui/material';
import { Search as SearchIcon, Language as LanguageIcon, Person as PersonIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [language, setLanguage] = useState('en');
    const categories = [
        { name: 'Auto Parts' },
        { name: 'Interior Accessories' },
        { name: 'Exterior Accessories' },
        { name: 'Truck and Towing' },
        { name: 'Tools' },
        { name: 'Chemicals, Oil & Wash' },
        { name: 'Performance' },
    ];

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

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        // Aquí puedes implementar la lógica para cambiar el idioma de la página
    };

    // Nueva función para manejar el clic en el logo
    const handleLogoClick = () => {
        setSearchQuery('');  // Limpia la barra de búsqueda
        navigate('/');       // Redirige al inicio
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#000', padding: '15px 50px' }}>
            <Toolbar     
            sx={{
                display: 'flex',
                justifyContent: 'space-between', // Distribuye los elementos a los lados y centro
                alignItems: 'center',
                maxWidth: '1400px', // Ancho máximo del navbar
                width: '100%',
                mx: 'auto', // Centra el Navbar horizontalmente con margen automático

                gap: 4, // Espacio entre los elementos
                padding: '0 20px'
                }}
                >
                <Sidebar categories={categories} onCategorySelect={handleCategorySelect} />

                {/* Logo y botón de añadir vehículo */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', color: '#FFD700', cursor: 'pointer' }}
                        onClick={handleLogoClick}  // Ejecuta handleLogoClick al hacer clic en el logo
                    >
                        AutosAnalítica
                    </Typography>
                </Box>

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
                        width: { xs: '100%', sm: '60%', md: '60%' },
                        maxWidth: '600px',
                        mx: 'auto', // Centra la barra de búsqueda en el navbar
                        boxShadow: 1,
                        mr: 30, // Ajusta este valor según cuánto quieras moverla hacia la izquierda

                    }}
                    >
                    <InputBase
                        placeholder="Buscar productos…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                    />


                    {/* Botones de sesión alineados a la derecha */}
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
                        <IconButton sx={{ color: 'white' }}>
                            <PersonIcon />
                        </IconButton>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Box>


                </Box>

                {/* Iconos y botones de sesión */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <IconButton sx={{ color: 'white' }}>
                        <PersonIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
