"use client";
import Breadcrumb from "@/components/administrador/Breadcrumbs/Breadcrumb";
import { AreaChart, SimpleBar, SimpleDonut } from "@/components/administrador/Charts";

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />
      <div className="space-y-5">
        <SimpleBar />
        <AreaChart />
        <SimpleDonut />
      </div>
    </>
  );
};

export default Chart;
