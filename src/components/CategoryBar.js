  import React from 'react';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
  import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
  import { Link } from 'react-router-dom';
  import { useNavigate, useLocation } from 'react-router-dom';

  const categories = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Categorías', id: 'categorias' },
    { name: 'Quienes somos', id: '#' },
    { name: 'Dashboard',href: '/graficos' }, // Ruta al Dashboard
  ];

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const CategoryBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (id) => {
      if (location.pathname !== '/') {
        // Si no estás en la página principal, navega primero al inicio
        navigate('/');
        // Espera un breve tiempo para garantizar que la página se cargue antes de desplazarte
        setTimeout(() => handleScrollToSection(id), 100); // Ajusta el tiempo si es necesario
      } else {
        // Si ya estás en la página principal, simplemente desplázate
        handleScrollToSection(id);
      }
    };
    
    return (
      <Disclosure as="nav" className="bg-black sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {categories.map((category) =>
                    category.id ? (
                      <button
                        key={category.name}
                        onClick={() => handleNavigation(category.id)}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {category.name}
                      </button>
                    ) : (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {category.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {categories.map((category) =>
                category.id ? (
                  <button
                    key={category.name}
                    onClick={() => handleNavigation(category.id)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  >
                    {category.name}
                  </button>
                ) : (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  >
                    {category.name}
                  </Link>
                )
              )}
            </div>
          </DisclosurePanel>
        </div>
      </Disclosure>
    );
  }

  export default CategoryBar;
