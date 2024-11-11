// src/App.js
import React from 'react';
import './i18n';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';

function App() {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <main className="py-6">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/detalle/:id" element={<ProductDetails />} />
                        <Route path="/buscar" element={<SearchResults />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/categoria/:categoryName" element={<CategoryPage />} />
                        <Route path="/marca/:categoryName" element={<CategoryPage />} />
                        <Route path="/search" element={<SearchResults />} /> {/* Agrega esta línea */}
                        <Route path="/product/:id" element={<ProductDetails />} /> {/* Ruta para detalles del producto */}


                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
