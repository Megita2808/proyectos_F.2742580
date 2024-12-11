"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar, dayjsLocalizer, EventProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";
import { fetchReservations } from "@/api/fetchs/get_reservas";
import Swal from "sweetalert2";

dayjs.locale("es"); 

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const convertirFecha = (fecha: Date) => {
  const fechaFormateada = dayjs(fecha).format('D [de] MMMM [del] YYYY');
  // Convertir la primera letra del mes a mayúscula
  return fechaFormateada.replace(/de (\w)/, (match, p1) => `de ${p1.toUpperCase()}`);
};

//Agenda General
const AgendaPrueba = () => {
  const localizer = dayjsLocalizer(dayjs);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  //Carga Inicial de las reservas como eventos
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservas = await fetchReservations();
        const approvedReservations = reservas.filter((reservation : any) => reservation.status === "Aprobada");
        const formattedEvents = approvedReservations.map(reservation => ({
          start: new Date(reservation.start_date), 
          end: dayjs(reservation.end_date).add(1, 'day').toDate(), 
          title: `#${reservation.id_reservation} - ${reservation.name_client}`, 
          reservation,
          description : "Esta es la descripcion"
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error obteniendo las reservas:", error);
      }
    };

    loadReservations();
  }, []);

  //Mensajes personalizados
  const messages = {
    today: "Hoy",
    previous: "Anterior",
    next: "Siguiente",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    allDay: "Todo el día",
    noEventsInRange: "No hay eventos en este rango",
    showMore: (total: number) => (
        `+ Ver más (${total})`
    ),
  };

  const customViews = {
    month: true,
    week: true,
    day: false,
    agenda: true,
    
  };

  //Generar tabla de eventos ShowMore
  const generateEventTable = (events: any[], handleSelectEvent : any) => {
    let tableHTML = `
      <table style="width: 100%; text-align: left; border-radius: 12px;">
        <thead>
          <tr>
            <th style="padding: 8px; background-color: #f4f4f4; border-top-left-radius: 12px;">Reserva</th>
            <th style="padding: 8px; background-color: #f4f4f4;">Fechas</th>
            <th style="padding: 8px; background-color: #f4f4f4; border-top-right-radius: 12px;">Fechas</th>
          </tr>
        </thead>
        <tbody style="background-color: rgba(0, 0, 0, 0.8) !important; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); color: white;">
    `;
    
    // Genera las filas para cada evento
    events.forEach(event => {
      tableHTML += `
        <tr style="cursor : pointer;" id="row-${event.id_reservation}">
          <td style="padding: 8px; border: 1px solid #ddd;">${event.title}</td>
          <td style="padding: 8px; border: 1px solid #ddd; white-space: nowrap;">${new Date(event.start).toLocaleDateString()}</td>
          <td style="padding: 8px; border: 1px solid #ddd; white-space: nowrap;">${new Date(event.end).toLocaleDateString()}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
  };

  //Diseño de Evento personalizado
  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    return (
      <div className="z-99 mb-1 w-full h-full  border-l-[5px] rounded-r-lg hover:rounded-lg hover:border-l-[30px] shadow-2xl hover:shadow-lg duration-150 border-primary bg-gray-2 px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100  dark:bg-dark-3 md:visible md:opacity-100">
        <span className="event-name font-medium text-dark-4 dark:text-dark-7">
        <strong style={{ fontSize: "16px", fontWeight: "600" }}>
          {event.title}
        </strong>
        </span>
      </div>
    );
  };

  //Accion cuando selecciona un evento
  const handleSelectEvent = async(event : any) => {
    console.log(event)
    setSelectedEvent(event);
    const reservation = event.reservation;

    const reservationTable = `
      <table style="width: 100%; text-align: left; border-radius : 12px;">
        <thead>
          <tr>
            <th style="padding: 8px; background-color: #f4f4f4; border-top-left-radius: 12px;">Campo</th>
            <th style="padding: 8px; background-color: #f4f4f4; border-top-right-radius: 12px;">Valor</th>
          </tr>
        </thead>
        <tbody style="
            background-color: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            color : white;
            ">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Número de Reserva</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.id_reservation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd">Nombre Cliente</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.name_client}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Fecha de Inicio</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${convertirFecha(reservation.start_date)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Fecha de Fin</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${convertirFecha(reservation.end_date)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; border-bottom-left-radius: 12px;">Estado</td>
            <td style="padding: 8px; border: 1px solid #ddd; border-bottom-right-radius: 12px;"><strong style="margin : 2px; padding : 4px; color : #60c82c; border: 3px solid #b7eb8f; border-radius : 8px">${reservation.status}</strong></td>
          </tr>
        </tbody>
      </table>
    `;

    //Alerta - Modal de los datos de la reserva seleccionada
    await Swal.fire({
      title: 'Datos de Reserva',
      html: reservationTable,
      iconColor: "#000",
      color: "#000",
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: "#000",
      cancelButtonText: 'Cerrar',
      reverseButtons: true,
      background: "url(/images/grids/bg-morado-bordes.avif)",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: 'custom-background',
        cancelButton: "rounded-xl",
        confirmButton: "rounded-xl",
      },
    })
  };



  const handleShowMore = async(events: any[], date: Date) => {
    const fecha = convertirFecha(date)
    const tableHTML = generateEventTable(events, handleSelectEvent);

    await Swal.fire({
      title: `Datos de Reserva del ${fecha}`,
      html: tableHTML,
      iconColor: "#000",
      color: "#000",
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: "#000",
      cancelButtonText: 'Cerrar',
      reverseButtons: true,
      background: "url(/images/grids/bg-morado-bordes.avif)",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: 'custom-background',
        cancelButton: "rounded-xl",
        confirmButton: "rounded-xl",
      },
    })
  };

    



  return (
    <div className="max-w-full max-h-full p-4">
      <Calendar
        views={customViews}
        defaultDate={new Date()}
        localizer={localizer}
        events={events} 
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        style={{
          height: 700,
        }}
        components={{
          event: CustomEvent
        }}
        onShowMore={handleShowMore}
      />
    </div>
  );
};

export default AgendaPrueba;