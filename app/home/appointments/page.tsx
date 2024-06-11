"use client";

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function AppointmentsPage() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl mb-4">Appointments</h1>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full h-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek" // Imposta la vista settimanale come predefinita
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay', // Viste disponibili
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            scrollTime="07:00:00"
            events={[]} // Puoi aggiungere eventi qui
            height="85%" // Imposta l'altezza del calendario
          />
        </div>
      </div>
    </div>
  );
}