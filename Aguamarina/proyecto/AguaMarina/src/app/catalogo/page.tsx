import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import Faq from "@/components/Clients/Faq";
import Pricing from "@/components/Clients/Pricing";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Catalogo | AguaMarina",
  description: "Catalogo AguaMarina",
};

const PricingPage = () => {
  return (
    <ClienteLayout>
      <>
        <Pricing />
      </>
    </ClienteLayout>
  );
};

export default PricingPage;
