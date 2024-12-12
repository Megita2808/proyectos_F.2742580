import React from "react";
import ReactECharts from "echarts-for-react";

const PieChart = ({ data }) => {
  const option = {
    title: {
      text: "Insumos Disponibles",
      subtext: "Datos simulados",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Cantidad",
        type: "pie",
        radius: "50%",
        data: data.map((insumo) => ({
          value: insumo.cantidad,
          name: insumo.nombre,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

export default PieChart;
