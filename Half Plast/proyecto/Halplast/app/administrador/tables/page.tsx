import Breadcrumb from "@/components/administrador/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/administrador/Tables/TableOne";
import TableThree from "@/components/administrador/Tables/TableThree";
import TableTwo from "@/components/administrador/Tables/TableTwo";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tables Page | Next.js E-commerce Dashboard Template",
  description: "This is Tables page for TailAdmin Next.js",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default TablesPage;
