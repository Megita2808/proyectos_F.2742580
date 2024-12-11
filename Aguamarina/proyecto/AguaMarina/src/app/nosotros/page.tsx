import About from "@/components/Clients/About";
import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import Team from "@/components/Clients/Team";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Nosotros | AguaMarina",
  description: "Esta es una descripcion breve sobre nosotros",
};

const AboutPage = () => {
  return (
    <ClienteLayout>
      <main>
      <Breadcrumb pageName="Nosotros" />
      <About />
      </main>
    </ClienteLayout>
  );
};

export default AboutPage;
