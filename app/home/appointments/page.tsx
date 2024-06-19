import Calendar from "@/app/ui/appointments/calendar";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import db from '@/app/lib/db';

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  const appointments = await db.appointment.findMany({
    where: { userId: session?.user.id },
    include: { customer: true },
  });

  const customers = await db.customer.findMany({
    where: { userId: session?.user.id },
  });

  // Format appointments for the calendar
  const formattedAppointments = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.type} - ${appointment.customer.name} ${appointment.customer.surname}`,
    start: appointment.startTime.toISOString(),
    end: appointment.endTime.toISOString(),
    extendedProps: {
      customer: appointment.customer,
      type: appointment.type,
      cost: appointment.cost,
      notes: appointment.notes,
      status: appointment.status,
    },
  }));

  return (
    <div className="w-full">
      <Calendar appointments={formattedAppointments} customers={customers}/>
    </div>
  );
}