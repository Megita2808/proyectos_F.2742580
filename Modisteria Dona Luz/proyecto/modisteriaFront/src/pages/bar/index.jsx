import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import BarChart from "../../components/BarChart/BarChart";
import { useJwt } from "../../context/JWTContext";
import useFetch from "../../hooks/useFetch";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { URL_BACK } from "../../assets/constants.d";

const Bar = () => {
  const { token } = useJwt();
  const { loading, triggerFetch } = useFetch();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await triggerFetch(
          `${URL_BACK}/insumos/getAllInsumos`,
          "GET",
          null,
          { "x-token": token }
        );

        if (response.status === 200 && response.data) {
          setData(response.data);
        } else {
          console.error("Error al obtener datos: ", response);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    fetchData();
  }, [triggerFetch, token]);

  return (
    <Box m="20px">
      <Header
        title="Grafica Insumos"
        subtitle="Insumos"
        icon={BarChartOutlinedIcon}
      />
      <Box height="75vh">
        {loading ? (
          <Box marginLeft={"160px"}>
            <LoadingTableData></LoadingTableData>
          </Box>
        ) : (
          <BarChart data={data} />
        )}
      </Box>
    </Box>
  );
};

export default Bar;
