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
        <AppBar position="static" sx={{ bgcolor: '#000', padding: '10px 0' }}>
            <Toolbar sx={{ justifyContent: 'space-between', padding: '0 20px' }}>
                <Sidebar categories={categories} onCategorySelect={handleCategorySelect} />

                {/* Logo y botón de añadir vehículo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 2, width: '50%' }}
                >
                    <InputBase
                        placeholder="Buscar productos…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <IconButton type="submit" sx={{ p: '10px', color: '#FFD700' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>

                {/* Iconos y botones de sesión */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select
                        value={language}
                        onChange={handleLanguageChange}
                        sx={{ color: 'white', borderColor: 'white', minWidth: '50px', mr: 1 }}
                        variant="outlined"
                    >
                        <MenuItem value="en">EN</MenuItem>
                        <MenuItem value="es">ES</MenuItem>
                    </Select>
                    <IconButton sx={{ color: 'white' }}>
                        <PersonIcon />
                    </IconButton>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/register">Register</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
