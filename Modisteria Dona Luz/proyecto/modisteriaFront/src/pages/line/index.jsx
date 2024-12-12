import { Box } from "@mui/material"; 
import Header from "../../components/Header/Header";
import LineChart from "../../components/LineChart/LineChart";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useJwt } from "../../context/JWTContext"; // Importar el contexto
import { URL_BACK } from "../../assets/constants.d";

const Line = () => {
  const { token } = useJwt(); // Obtener el token del contexto
  const { loading, triggerFetch } = useFetch();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("No token found, user may not be authenticated.");
        return;
      }

      const { data: responseData, status } = await triggerFetch(
        `${URL_BACK}/ventas/getAllVentas`,
        'GET',
        null,
        { "x-token": token } // Pasar el token en los headers
      );

      if (status === 200) {
        const formattedData = formatData(responseData);
        setData(formattedData);
      } else {
        console.error("Error fetching data:", responseData);
      }
    };

    fetchData();
  }, [token, triggerFetch]);

  const formatData = (ventas) => {
    const countsByDate = {};
    ventas.forEach(venta => {
      const fecha = venta.fecha; // Asegúrate de que 'fecha' sea el campo correcto
      countsByDate[fecha] = (countsByDate[fecha] || 0) + 1;
    });

    return [
      {
        id: "ventas",
        data: Object.entries(countsByDate).map(([fecha, cantidad]) => ({
          x: fecha,
          y: cantidad,
        })),
      },
    ];
  };

  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Ventas por Fecha" />
      <Box height="75vh">
        {loading ? <p>Cargando...</p> : <LineChart data={data} />}
      </Box>
    </Box>
  );
};

export default Line;
