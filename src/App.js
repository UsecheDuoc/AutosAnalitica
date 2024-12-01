// src/App.js
import React from 'react';
import './i18n';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import SearchResults from './components/SearchResults';
import CategoryPage from './components/CategoryPage';
import { ModelosProvider } from './contexts/ModelosContext';
import FooterComponent from "./components/Footer";
import CategoryBar from './components/CategoryBar';
import Dashboard from "./components/graficos/Dashboard"; // Importar Dashboard
import NotFoundPage from './components/NotFoundPage'; // Página 404

function App() {    
    return (
        <ModelosProvider>
            <Router>
                <div className="bg-gray-100 min-h-screen">
                    <Navbar />
                    <main className="py-6">
                            <Routes>
                                <Route path="/" element={<ProductList />} />
                                <Route path="/categoria/:categoryName" element={<CategoryPage />} />{/* Para llamar a categoria */} 
                                <Route path="/marca/:categoryName" element={<CategoryPage />} />{/* Para llamar a Marca */}
                                <Route path="/search" element={<SearchResults />} /> {/* Agrega esta línea */}
                                <Route path="/product/:id" element={<ProductDetails />} /> {/* Ruta para detalles del producto */}
                                <Route path="/graficos" element={<Dashboard />} /> {/* Nueva ruta para Dashboard */}
                                <Route path="*" element={<NotFoundPage />} /> {/* Ruta 404 */}

                            </Routes>
                    </main>
                    <FooterComponent />
                </div>
            </Router>
        </ModelosProvider>

    );
}

export default App;
