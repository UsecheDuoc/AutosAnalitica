import React from "react";
import GraficoCategorias from "./GraficoCategorias"; // Gráfico circular para categorías
import CategoryBar from "../CategoryBar"; // Gráfico de barras para empresas, precios u otros
import GraficoEmpresas from "./GraficoEmpresas";





const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Dashboard de Análisis
      </h1>
      
      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de empresas */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Distribución de Productos por Empresa
          </h2>
          <GraficoEmpresas />
        </div>

        {/* Espacio para el otro gráfico */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Productos por Categoría
          </h2>
        </div>
      </div>

      {/* Gráfico de categorías */}
      <div className="mt-12"> {/* Agregamos margen superior para separar */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Productos por Categoría</h2>
          <GraficoCategorias />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

