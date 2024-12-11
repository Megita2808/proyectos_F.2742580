import ProfileClient from "@/components/Clients/profileClient/index";
import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import ClienteLayout from "@/components/Layouts/ClienteLayout";

export default function Home() {
    return (
      <ClienteLayout>
        <> 
          <Breadcrumb pageName="Perfil" />
          <ProfileClient />
        </>
      </ClienteLayout>
    );
  }