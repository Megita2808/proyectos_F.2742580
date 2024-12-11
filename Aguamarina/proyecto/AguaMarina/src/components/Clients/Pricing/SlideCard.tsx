import React, { useState } from "react";
import Buscar from "./FiltroBuscar";
import Precio from "./FiltroPrecio";
import Categoria from "./FiltroCategoria";
import Fecha from "./FiltroFecha";
import Image from "next/image";

interface SlideCardProps {
  onSearch: (term: string) => void;
  onPriceFilter: (minPrice: number, maxPrice: number) => void;
  onDateChange: (dates: [string, string] | null) => void;
  products: { price: number }[];
  categories: { id_category: number; name: string }[];
  onCategorySelect: (selectedCategories: number[]) => void;
  pathUrl?: string;
}

const SlideCard: React.FC<SlideCardProps> = ({
  onSearch,
  onPriceFilter,
  onDateChange,
  products,
  categories,
  onCategorySelect,
  pathUrl
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`relative duration-300 ${
        isHovered ? "w-full md:w-[350px]" : "w-64 md:w-64"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`overflow-x-hidden box-border h-auto overflow-y-auto rounded-r-xl border-r border-gray-300 bg-white p-5 shadow-md transition-transform duration-300 transform dark:bg-dark-2`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="items-center space-x-4">
            {pathUrl !== "/" ? (
              <>
                <Image
                  src={`/images/logo/logoSimbolo.png`}
                  alt="logo"
                  width={50}
                  height={50}
                  className="h-16 w-16 object-cover dark:hidden"
                />
                <Image
                  src={`/images/logo/LogoSimboloNegativo.png`}
                  alt="logo"
                  width={50}
                  height={50}
                  className="h-16 w-16 object-cover hidden dark:block"
                />
              </>
            ) : (
              <>
                <Image
                  src={`/images/logo/logoSimbolo.png`}
                  alt="logo"
                  width={50}
                  height={50}
                  className="h-16 w-16 object-cover dark:hidden"
                />
                <Image
                  src={`/images/logo/LogoSimboloNegativo.png`}
                  alt="logo"
                  width={50}
                  height={50}
                  className="h-16 w-16 object-cover hidden dark:block"
                />
              </>
            )}
          </div>
          <h2 className="flex-1 text-left text-2xl font-bold text-gray-800 dark:text-white">
            Filtros
          </h2>
        </div>

        {/* Filtros */}
        <div
          className={`space-y-5 transition-all duration-300 ${
            isHovered ? "block" : "hidden"
          }`}
        >
          <div>
            <span className="block mb-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Filtrar por Nombre o Descripción
            </span>
            <Buscar onSearch={onSearch} />
          </div>
          <div>
            <span className="block mb-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Filtrar por Categoría
            </span>
            <Categoria categories={categories} onCategorySelect={onCategorySelect} />
          </div>
          <div>
            <span className="block mb-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Filtrar por Precio
            </span>
            <Precio products={products} onFilterChange={onPriceFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
