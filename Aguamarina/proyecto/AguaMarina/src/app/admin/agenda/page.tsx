import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import AgendaPrueba from "@/components/Agenda/AgendaPrueba";

export const metadata: Metadata = {
  title: "Agenda - Reservas",
  description:
    "This is Next.js Calender page for NextAdmin  Tailwind CSS Admin Dashboard Kit",
  // other metadata
};



const CalendarPage = () => {
  return (
    // <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Agenda" />

        {/* <CalendarBox /> */}
        <AgendaPrueba />
      </div>
    // </DefaultLayout>
  );
};

export default CalendarPage;
