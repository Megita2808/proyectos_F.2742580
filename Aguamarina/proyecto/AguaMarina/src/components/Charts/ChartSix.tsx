import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchProducts } from "@/api/fetchs/get_productos"; // Asegúrate de que la ruta sea correcta  

// Función para formatear los datos para el gráfico
const formatDataForChart = (products) => {
  const categoryCount = {};

  // Contar productos por categoría
  products.forEach(product => {
    if (categoryCount[product.category]) {
      categoryCount[product.category] += product.total_quantity; // Suponiendo que 'total_quantity' es la cantidad de productos en stock
    } else {
      categoryCount[product.category] = product.total_quantity;
    }
  });

  // Transformar el objeto en un formato que el gráfico pueda usar
  return Object.entries(categoryCount).map(([category, quantity]) => ({
    category,
    quantity,
  }));
};

export default function PieActiveArc() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Estado de carga
  const [error, setError] = React.useState(null); // Estado de error

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts(); // Obtiene los productos
        const chartData = formatDataForChart(products); // Formatea los datos
        setData(chartData);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar productos.");
      } finally {
        setLoading(false); // Cambia el estado de carga
      }
    };
    
    loadProducts();
  }, []);



  if (error) {
    return <div>{error}</div>; // Mensaje de error si ocurre
  }

  if (data.length === 0) {
    return <div>No hay productos disponibles.</div>; // Mensaje cuando no hay productos
  }

  return (
    <PieChart
      series={[
        {
          data: data,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          valueFormatter: (value) => `${value.category}: ${value.quantity}`, // Muestra categoría y cantidad
        },
      ]}
      height={200}
    />
  );
}
