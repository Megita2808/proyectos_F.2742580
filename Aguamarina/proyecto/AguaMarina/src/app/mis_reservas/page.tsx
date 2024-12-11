import Reservasclientes from "@/components/Clients/Reservas_clientes/index.tsx";
import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import ClienteLayout from "@/components/Layouts/ClienteLayout";

export default function Home() {
    return (
      <ClienteLayout>
        <>
          <Breadcrumb pageName="Mis reservas" />
          <Reservasclientes />
        </>
      </ClienteLayout>
    );
  }