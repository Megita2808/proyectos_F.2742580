import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import NotFound from "@/components/Clients/NotFound";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ERROR | AguaMarina",
};

const ErrorPage = () => {
  return (
      <>
        <Breadcrumb pageName="404 Pagina" />
        <NotFound />
      </>
  );
};

export default ErrorPage;
