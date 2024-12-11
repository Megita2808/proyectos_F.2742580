import AgendaPrueba from "@/components/Agenda/AgendaPrueba";
import Agenda from "@/components/Clients/agenda/index";
import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import ClienteLayout from "@/components/Layouts/ClienteLayout";

export default function Home() {
    return (
      <ClienteLayout>
        <>
          <Breadcrumb pageName="Agenda" />
          <Agenda />
          {/* <AgendaPrueba /> */}
        </>
      </ClienteLayout>
    );
  }