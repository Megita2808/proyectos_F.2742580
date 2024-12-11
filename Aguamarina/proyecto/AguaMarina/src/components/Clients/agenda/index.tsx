"use client";
import React, { useState, useEffect } from "react";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import './styles.css'

const localizer = momentLocalizer(moment);

// Define el tipo para los eventos
interface MyEvent extends BigCalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

// Define los eventos de ejemplo
const events: MyEvent[] = [
  {
    title: 'Evento especial',
    start: new Date(2023, 10, 12), // 12 de noviembre de 2023
    end: new Date(2023, 10, 23), // 23 de noviembre de 2023
    allDay: true,
  },
];


const Agenda = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const fetchReservations = async (selectedDate: Date) => {
    setLoading(true);
    setError("");
    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const response = await fetch(`/api/reservations?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error("Error al obtener las reservas.");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        setReservations([]);
        setError("Los datos de las reservas no son correctos.");
      }
    } catch (err) {
      setError("Hubo un problema al obtener las reservas.");
      console.error("Error al cargar las reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchReservations(date);
    console.log({date})
  }, [date]);

  const onChange = (newDate: Date) => setDate(newDate);

  const getReservationsForDate = (date: Date) => {
    const formattedDate = date.toDateString();
    if (Array.isArray(reservations)) {
      return reservations.filter(
        (reservation) => new Date(reservation.date).toDateString() === formattedDate
      );
    }
    return [];
  };

  const handleDateClick = (date: Date) => {
    const selectedReservations = getReservationsForDate(date);
    if (selectedReservations.length > 0) {
      setSelectedReservation(selectedReservations[0]);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card px-10">
      <div className="flex flex-wrap items-center">
        <div className="w-full xl:w-1/2">
          <div className="w-full sm:p-12.5 xl:p-15 p-4">
            <section>
              <div className="container">
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4">
                    <div
                      className="wow fadeInUp relative mx-autom  overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
                      data-wow-delay=".15s"
                    >
                      <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Agenda de Reservas</h2>
                      <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"
                        style={{ height: 600 }}
                        views={['month', 'week', 'day']}
                        messages={{
                          next: 'Siguiente',
                          previous: 'Anterior',
                          today: 'Hoy',
                          month: 'Mes',
                          week: 'Semana',
                          day: 'Día',
                        }}
                      />

                      <div className="mt-4">
                        <h3>Reservas para {date.toDateString()}</h3>
                        {loading ? (
                          <p>Cargando reservas...</p>
                        ) : (
                          <ul>
                            {getReservationsForDate(date).length > 0 ? (
                              getReservationsForDate(date).map((reservation) => (
                                <li key={reservation.id}>
                                  <strong>{reservation.name}</strong> - Reserva N° {reservation.reservationNumber}
                                </li>
                              ))
                            ) : (
                              <li>No hay reservas para este día.</li>
                            )}
                          </ul>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                      </div>

                      {selectedReservation && (
                        <div className="mt-6 p-4 border rounded-md dark:bg-gray-800">
                          <h4 className="font-bold text-lg">Detalle de la Reserva</h4>
                          <p><strong>Nombre:</strong> {selectedReservation.name}</p>
                          <p><strong>Número de Reserva:</strong> {selectedReservation.reservationNumber}</p>
                          <p><strong>Hora:</strong> {selectedReservation.time}</p>
                          <p><strong>Comentario:</strong> {selectedReservation.comment || "Sin comentarios"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="hidden w-full p-7.5 xl:block xl:w-1/2 mt-50">
          <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-1.5 dark:!bg-dark-2 dark:bg-none">
            <p className="mb-3 text-xl font-medium text-dark dark:text-white">
              Visualiza las reservas de tu agenda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
