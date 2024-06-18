"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/app/ui/dashboard/cards';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { lusitana } from '@/app/ui/fonts';
import HomeSkeleton from '../skeletons';

interface Customer {
  id: string;
  name: string;
  surname: string;
}

interface Appointment {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  customer: Customer;
}

interface Earning {
  date: string;
  _sum: {
    cost: number;
  };
}

async function fetchData() {
  const response = await fetch('/api/homeData');
  const data = await response.json();
  return data;
}

export default function HomeView() {
  const [data, setData] = useState({
    collected: 0,
    pending: 0,
    appointments: 0,
    today: 0,
    customers: 0,
    todayAppointments: [] as Appointment[],
    earningsData: [] as Earning[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setData(data);
      setLoading(false);
    };

    getData();
  }, []);

  const formatEvents = (appointments: Appointment[]) => {
    return appointments.map((appointment) => ({
      id: appointment.id,
      title: `${appointment.type} - ${appointment.customer.name} ${appointment.customer.surname}`,
      start: appointment.startTime,
      end: appointment.endTime,
    }));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if(loading){
    return (
      <HomeSkeleton />
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={`$${data.collected}`} type="collected" />
        <Card title="Pending" value={`$${data.pending}`} type="pending" />
        <Card title="Total Appointments" value={data.appointments} type="appointment" />
        <Card title="Total Customers" value={data.customers} type="customers" />
      </div>
      <div className="mt-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          {data.todayAppointments.length > 0 ? (
            <div className="w-full md:w-1/2 h-[550px] mb-4 md:mb-0">
              <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Today&apos;s Appointments: {data.today}</h2>
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                headerToolbar={false}
                allDaySlot={false}
                editable={false}
                selectable={false}
                events={formatEvents(data.todayAppointments)}
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                scrollTime="07:00:00"
                height="100%"
              />
            </div>
        ) : (
          <div className="w-full md:w-1/2 h-[550px] mb-4 md:mb-0">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>No Appointments Today</h2>
          </div>
        )}
         <div className="w-full md:w-1/2 h-auto max-h-[550px] overflow-y-auto md:border-gray-200 order-first md:order-none">
              <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Recent Earnings</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-blue-500 text-white text-center border-r border-gray-200">Date</th>
                    <th className="py-2 px-4 bg-blue-500 text-white text-center">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.earningsData.map((earning, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-t border-r border-gray-200 text-center">{formatDate(earning.date)}</td>
                      <td className="py-2 px-4 border-t border-gray-200 text-center">${earning._sum.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
}