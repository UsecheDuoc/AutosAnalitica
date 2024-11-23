import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redirige al inicio
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '80vh', // Asegura que ocupe toda la ventana
            }}
        >
            <Typography variant="h3" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Página no encontrada
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                La página que estás buscando no existe o ha ocurrido un error.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{
                    backgroundColor: '#FFCC00', // Color distintivo
                    color: 'black',
                    '&:hover': { backgroundColor: '#e6b800' },
                }}
            >
                Volver al Inicio
            </Button>
        </Box>
    );
};

export default NotFoundPage;
