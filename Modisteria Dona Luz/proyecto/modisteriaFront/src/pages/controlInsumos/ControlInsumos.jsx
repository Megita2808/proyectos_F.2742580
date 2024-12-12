import "./controlInsumos.css";
import Card from "../../components/card/Card";
import { useState, useEffect } from "react";
import useInsumosData from "../../hooks/useInsumosData";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import Header from "../../components/Header/Header";
import { HistoryOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export default function ControlInsumos() {
  const [controlInsumosData, setControlInsumosData] = useState([]);
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const [inputDateFilter, setInputDateFilter] = useState();
  const { loadingInsumoHistorial, initialFetchAllInsumosHistory } =
    useInsumosData();

  useEffect(() => {
    const loadInsumosHistory = async () => {
      const response = await initialFetchAllInsumosHistory();
      if (response.status === 200) {
        setControlInsumosData(response.data);
        setFilteredData(response.data);
      }
    };
    loadInsumosHistory();
  }, []);

  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  const handleSpecificDate = (e) => setInputDateFilter(e.target.value);

  useEffect(() => {
    if (isFirstRender) return;
    const initialInsumosData = inputDateFilter
      ? controlInsumosData.filter((cInsumo) =>
          cInsumo.fecha.includes(inputDateFilter)
        )
      : controlInsumosData;
    if (lastModifications) {
      setFilteredData(initialInsumosData);
    } else {
      const sortedData = [...initialInsumosData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, controlInsumosData, inputDateFilter]);

  const exportToExcel = () => {
    const formattedData = filteredData.map((item) => ({
      "Nombre del Insumo": item.insumos.nombre,
      "Cantidad Modificada": item.cantidad_modificada,
      "Unidad de Medida": item.insumos.unidades_de_medida.nombre,
      Autor: item.usuario.nombre,
      Fecha: item.fecha,
      Motivo: item.motivo,
      "Correo Autor": item.usuario.email,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Insumos");
    XLSX.writeFile(wb, "control_insumos.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Control de Insumos", 20, 20);
    doc.text("", 20, 30);

    let yPosition = 40;
    const marginBottom = 20;

    filteredData.forEach((data) => {
      if (yPosition + 50 > 290) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`Insumo: ${data.insumos.nombre}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Fecha: ${data.fecha}`, 20, yPosition);
      yPosition += 10;
      doc.text(
        `Cantidad Modificada: ${data.cantidad_modificada}`,
        20,
        yPosition
      );
      yPosition += 10;
      doc.text(`Motivo: ${data.motivo}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Autor: ${data.usuario.nombre}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Correo Autor: ${data.usuario.email}`, 20, yPosition);
      yPosition += 20;

      if (yPosition + marginBottom > 290) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("control_insumos.pdf");
  };

  return (
    <>
      <Header
        title="Control de los insumos"
        handleAdd={exportToExcel}
        buttonText={"Exporta a excel"}
        secondButton
        secondButtonText={"Exportar a PDF"}
        handleSecondButtonFunction={exportToPDF}
        icon={HistoryOutlined}
      />

      <div className="filtrosControl">
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
            {lastModifications ? "Recientes" : "Viejas"}
          </Button>
        </div>
        <div className="textInputWrapper">
          <input
            value={inputDateFilter}
            onChange={handleSpecificDate}
            type="date"
            className="textInput"
          />
        </div>
      </div>

      <main className="main-control-insumo">
        {loadingInsumoHistorial ? (
          <LoadingTableData />
        ) : filteredData.length ? (
          <Box width={"1000px"} marginLeft={"10%"}>
            {filteredData &&
              filteredData.map((insumoHistory) => (
                <Card
                  key={insumoHistory.id}
                  cantidad={insumoHistory.cantidad_modificada}
                  unidadMedida={insumoHistory.insumos.unidades_de_medida.nombre}
                  autor={insumoHistory.usuario.nombre}
                  tela={insumoHistory.insumos.nombre}
                  fecha={insumoHistory.fecha}
                  correoAutor={insumoHistory.usuario.email}
                  motivo={'"' + insumoHistory.motivo + '"'}
                ></Card>
              ))}
            <br />
          </Box>
        ) : (
          <div className="sin-insumos">¡Sin insumos repuestos!</div>
        )}
      </main>
    </>
  );
}
