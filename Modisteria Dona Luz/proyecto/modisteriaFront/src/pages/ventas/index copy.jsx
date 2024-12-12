import Card from "../../components/card/Card";
import { useState, useEffect } from "react";
import Loading from "../../components/loading/Loading";
import useVentasData from "../../hooks/useVentasData";
import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount";
export default function Ventas() {
  const [ventasData, setVentasData] = useState([]);
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const { initialFetchAllVentas, loading } = useVentasData();
  useEffect(() => {
    const loadVentas = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) {
        setVentasData(response.data);
        setFilteredData(response.data);
      }
    };
    loadVentas();
  }, []);
  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  useEffect(() => {
    if (isFirstRender) return;
    console.log(lastModifications);

    if (lastModifications) {
      setFilteredData(ventasData);
    } else {
      const sortedData = [...ventasData].sort((a, b) => b.id - a.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, ventasData]);

  return (
    <>
      {loading && <Loading></Loading>}
      <header className="header">
        <h4>Ventas</h4>
        <div className="header-actions">
          <Button
            variant="contained"
            onClick={handleFilterDataDates}
            color="primary"
            startIcon={<FilterListIcon />}
            endIcon={
              lastModifications ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon></ArrowDownwardIcon>
              )
            }
          >
            {lastModifications ? "Más recientes" : "Más viejas"}
          </Button>
        </div>
      </header>
      <main className="main-control-insumo">
        {filteredData &&
          filteredData.map((venta) => <h5>{JSON.stringify(venta)}</h5>)}
        <footer className="footer-history">¡Has llegado al final!</footer>
      </main>
    </>
  );
}
