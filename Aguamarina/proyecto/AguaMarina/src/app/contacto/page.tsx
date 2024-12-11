import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import Contact from "@/components/Clients/Contact";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contacto | AguaMarina",
  description: "Contactanos",
};

const ContactPage = () => {
  return (
   <ClienteLayout> 
    <>
      <Breadcrumb pageName="Contacto" />
      <Contact />
    </>
   </ClienteLayout> 
  );
};

export default ContactPage;
