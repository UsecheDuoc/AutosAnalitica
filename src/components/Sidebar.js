// src/components/Sidebar.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import { categorias } from './ProductList'; // Importa la lista de categorías correctamente

function Sidebar({ onCategorySelect }) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (openState) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(openState);
    };

    return (
        <>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'black' }}>
                <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <div style={{ width: 250, padding: 16 }}>
                    <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Categorías</Typography>
                    
                    <Divider />
                    
                    <List>
                        {categorias.map((category, index) => (
                            <ListItem button key={index} onClick={() => onCategorySelect(category.nombre)}>
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary={category.nombre} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </>
    );
}

export default Sidebar;
