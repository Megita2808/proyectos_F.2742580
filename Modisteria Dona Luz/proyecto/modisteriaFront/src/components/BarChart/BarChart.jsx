import React from "react";
import { useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";

const PieChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsivePie
      data={data.map((item) => ({
        id: item.nombre,
        label: item.nombre,
        value: item.cantidad,
      }))}
      theme={{
        axis: {
          ticks: {
            text: { fill: colors.grey[100] },
          },
        },
        legends: {
          text: { fill: colors.grey[100] },
        },
        tooltip: {
          container: {
            background: colors.grey[900],
            color: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5} // Radio interno para diseño tipo "dona"
      padAngle={1}
      cornerRadius={3}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      enableArcLabels
      arcLabel={(d) => `${d.value}`}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateY: 56,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: colors.grey[100],
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default PieChart;
