// src/components/FilterSection.js
import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { initialMarcas, CATEGORIES } from '../constants';

const FilterSection = ({
  onFiltersChange, // Función para notificar cambios en los filtros
  initialFilters = {}, // Filtros iniciales, opcional
}) => {
  const [brandFilter, setBrandFilter] = useState(initialFilters.marca || '');
  const [modelFilter, setModelFilter] = useState(initialFilters.modelo || '');
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.categoria || '');
  const [modelosDisponibles, setModelosDisponibles] = useState([]);

  useEffect(() => {
    // Lógica para actualizar los modelos disponibles cuando cambia la marca
    if (brandFilter) {
      fetchModelosPorMarca(brandFilter);
    } else {
      setModelosDisponibles([]);
    }
  }, [brandFilter]);

  // Simulación de fetch de modelos
  const fetchModelosPorMarca = (marca) => {
    const modelosDummy = {
      Toyota: ['Corolla', 'Camry', 'RAV4'],
      Ford: ['Fiesta', 'Focus', 'Mustang'],
      Mazda: ['CX-5', 'Mazda3', 'Mazda6'],
    };
    setModelosDisponibles(modelosDummy[marca] || []);
  };

  const handleBrandChange = (event) => {
    setBrandFilter(event.target.value);
    fetchModelosPorMarca(event.target.value); // Llamar a la función para obtener los modelos
    handleApplyFilters(); // Aplicar los filtros actualizados
};

const handleModelChange = (event) => {
    setModelFilter(event.target.value);
    handleApplyFilters(); // Aplicar los filtros actualizados
};

  const handleApplyFilters = () => {
    const filters = {
      marca: brandFilter,
      modelo: modelFilter,
      categoria: categoryFilter,
    };
    onFiltersChange(filters); // Notifica los filtros aplicados al componente padre
  };

  const handleResetFilters = () => {
    setBrandFilter('');
    setModelFilter('');
    setCategoryFilter('');
    setModelosDisponibles([]);
    onFiltersChange({}); // Resetea los filtros en el componente padre
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
      {/* Filtro por Marca */}
      <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Marca</InputLabel>
        <Select
          value={brandFilter}
          onChange={(event) => setBrandFilter(event.target.value)}
          label="Marca"
        >
          <MenuItem value="">Ninguna</MenuItem>
          {initialMarcas.map((marca, index) => (
            <MenuItem key={index} value={marca}>
              {marca}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Filtro por Modelo */}
      <FormControl variant="outlined" fullWidth sx={{ mb: 2 }} disabled={!brandFilter}>
        <InputLabel>Modelo</InputLabel>
        <Select
          value={modelFilter}
          onChange={(event) => setModelFilter(event.target.value)}
          label="Modelo"
        >
          <MenuItem value="">Ninguno</MenuItem>
          {modelosDisponibles.length > 0 ? (
            modelosDisponibles.map((modelo, index) => (
              <MenuItem key={index} value={modelo}>
                {modelo}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay modelos disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Filtro por Categoría */}
      <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Categoría</InputLabel>
        <Select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          label="Categoría"
        >
          <MenuItem value="">Ninguna</MenuItem>
          {CATEGORIES.map((category, index) => (
            <MenuItem key={index} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botones de Aplicar y Resetear */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleResetFilters}>
          Limpiar
        </Button>
        <Button variant="contained" onClick={handleApplyFilters}>
          Aplicar
        </Button>
      </Box>
    </Box>
  );
};

export default FilterSection;
