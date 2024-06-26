"use client";

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@/app/ui/appointments/modal';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lusitana } from '@/app/ui/fonts';

// Define the types for the Customer 
interface Customer {
    id: string;
    name: string;
    surname: string;
  }

// Define the types for the Appointment
interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    customer: {
      id: string;
      name: string;
      surname: string;
    };
    type: string;
    cost?: number | null;
    notes?: string | null;
    status?: string | null;
  };
}

// Define the types for the CalendarProps
interface CalendarProps {
    appointments: Appointment[];
    customers: Customer[];
}

// Define the FormSchema for the form validation
const FormSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  customerId: z.string().min(1, 'Customer is required'),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  cost: z.string()
    .min(1, 'Cost is required')
    .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) >= 0, {
      message: 'Cost must be a number greater than or equal to 0',
    }),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: 'End time must be greater than start time',
  path: ['end'], // Set the error path to 'end'
});

export default function Calendar({ appointments, customers }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null); // used to store the selected event
  const [events, setEvents] = useState<Appointment[]>(appointments); // used to store the appointments
  const [isEditing, setIsEditing] = useState(false); // used to determine if the modal is in edit mode
  const [filterStatus, setFilterStatus] = useState<string>('ALL'); //used to filter appointments by status

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
      customerId: '',
      start: '',
      end: '',
      cost: '',
      status: '',
      notes: '',
    },
  });

  // Set the form values with the selected event data (used when pressing on an event to edit it)
  const handleEventClick = ({ event }: any) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    startDate.setHours(startDate.getHours() + 2);
    endDate.setHours(endDate.getHours() + 2);

    setIsEditing(true);
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        customer: event.extendedProps.customer,
        type: event.extendedProps.type,
        cost: event.extendedProps.cost,
        notes: event.extendedProps.notes,
        status: event.extendedProps.status,
      }
    });

    reset({
      type: event.extendedProps.type,
      customerId: event.extendedProps.customer.id,
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16),
      cost: event.extendedProps.cost?.toString() || '',
      status: event.extendedProps.status || '',
      notes: event.extendedProps.notes || 'PENDING',
    });
  };

  // Set all the values to default when adding a new event (via the +Add button)
  const handleAddClick = () => {
    setIsEditing(false);
    setSelectedEvent({
      id: '',
      title: '',
      start: '',
      end: '',
      extendedProps: {
        customer: { id: '', name: '', surname: '' },
        type: '',
        cost: null,
        notes: '',
        status: '',
      }
    });

    reset({
      type: '',
      customerId: '',
      start: '',
      end: '',
      cost: '',
      status: '',
      notes: '',
    });
  };

  // Set the start and end time of the new event when clicking on a date
  const handleDateClick = (arg: any) => {
    const startDate = new Date(arg.date);
    const endDate = new Date(arg.date);
    // Add 2 hours to the start time and 1 hour to the end time to fix the timezone issue and set the default duration to 1 hour
    startDate.setHours(startDate.getHours() + 2);
    endDate.setHours(startDate.getHours() + 1);
    

    setIsEditing(false);
    setSelectedEvent({
      id: '',
      title: '',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: {
        customer: { id: '', name: '', surname: '' },
        type: '',
        cost: null,
        notes: '',
        status: '',
      }
    });

    reset({
      type: '',
      customerId: '',
      start: startDate.toISOString().slice(0, 16),
      end: endDate.toISOString().slice(0, 16),
      cost: '',
      status: '',
      notes: '',
    });
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // Send a POST request to add a new appointment or a PUT request to update an existing one
    const url = isEditing ? `/api/edit/appointment/${selectedEvent?.id}` : '/api/add/appointment';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: values.customerId,
        type: values.type,
        startTime: new Date(values.start).toISOString(),
        endTime: new Date(values.end).toISOString(),
        cost: values.cost ? parseFloat(values.cost) : null,
        status: values.status,
        notes: values.notes,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();

      const updatedEvent = {
        id: isEditing ? selectedEvent?.id : responseData.appointment.id,
        title: `${values.type} - ${customers.find(c => c.id === values.customerId)?.name} ${customers.find(c => c.id === values.customerId)?.surname}`,
        start: values.start,
        end: values.end,
        extendedProps: {
          customer: customers.find(c => c.id === values.customerId)!,
          type: values.type,
          cost: values.cost ? parseFloat(values.cost) : null,
          notes: values.notes,
          status: values.status,
        }
      };

      // Update the state with the new/updated event
      const updatedEvents = isEditing ? events.map(event => event.id === selectedEvent?.id ? updatedEvent : event) : [...events, updatedEvent];
      setEvents(updatedEvents);

      handleCloseModal();
    } else {
      const error = isEditing ? 'Failed to update appointment' : 'Failed to add appointment';
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      const confirmDelete = confirm("Are you sure you want to delete this appointment?");
      if (confirmDelete) {
        const response = await fetch(`/api/delete/appointment/${selectedEvent.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // remove the deleted event from the state
          const updatedEvents = events.filter(event => event.id !== selectedEvent?.id);
          setEvents(updatedEvents);
          handleCloseModal();
        } else {
          console.error('Failed to delete appointment');
        }
      }
    }
  };

  // Filter the appointments based on the selected status
  const filteredEvents = events.filter(event => 
    filterStatus === 'ALL' || event.extendedProps.status === filterStatus
  );

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
              Appointments
            </h1>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Filter by status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today addEventButton',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            customButtons={{
              addEventButton: {
                text: '+Add',
                click: handleAddClick,
              },
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            scrollTime="07:00:00" // Start the calendar at 7am
            firstDay={1} // Start the week on Monday
            events={filteredEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            allDaySlot={false}
            height="85%"

            // Add event listeners to highlight the hovered slot
            viewDidMount={({ view }) => {
              const handleMouseEnter = (event: Event) => {
                const target = event.target as HTMLElement;
                // Determina il selettore in base alla vista corrente
                let selector = '';
                if (view.type === 'timeGridDay') {
                  selector = 'fc-timegrid-slot';
                } else if (view.type === 'timeGridWeek') {
                  selector = 'fc-timegrid-slot-lane';
                } else if (view.type === 'dayGridMonth') {
                  selector = 'fc-daygrid-day';
                }
            
                if (target.classList.contains(selector)) {
                  target.style.backgroundColor = '#f0f0f0';
                }
              };
            
              const handleMouseLeave = (event: Event) => {
                const target = event.target as HTMLElement;
                // Determina il selettore in base alla vista corrente
                let selector = '';
                if (view.type === 'timeGridDay') {
                  selector = 'fc-timegrid-slot';
                } else if (view.type === 'timeGridWeek') {
                  selector = 'fc-timegrid-slot-lane';
                } else if (view.type === 'dayGridMonth') {
                  selector = 'fc-daygrid-day';
                }
            
                if (target.classList.contains(selector)) {
                  target.style.backgroundColor = '';
                }
              };
            
              let calendarContainerSelector = '';
              if (view.type.includes('timeGrid')) {
                calendarContainerSelector = '.fc-timegrid-body';
              } else if (view.type === 'dayGridMonth') {
                calendarContainerSelector = '.fc-daygrid-body';
              }
            
              const calendarContainer = document.querySelector(calendarContainerSelector);
              calendarContainer?.addEventListener('mouseenter', handleMouseEnter, true);
              calendarContainer?.addEventListener('mouseleave', handleMouseLeave, true);
            
              return () => {
                calendarContainer?.removeEventListener('mouseenter', handleMouseEnter, true);
                calendarContainer?.removeEventListener('mouseleave', handleMouseLeave, true);
              };
            }}
          />
        </div>
      </div>
      {selectedEvent && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl mb-4">Appointment Details</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                {...register('type')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.type ? 'border-red-500' : ''
                }`}
              />
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                {...register('customerId')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.customerId ? 'border-red-500' : ''
                }`}
              >
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.surname}
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                {...register('start')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.start ? 'border-red-500' : ''
                }`}
              />
              {errors.start && <p className="text-red-500 text-xs mt-1">{errors.start.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                {...register('end')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.end ? 'border-red-500' : ''
                }`}
              />
              {errors.end && <p className="text-red-500 text-xs mt-1">{errors.end.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                {...register('cost')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                  errors.cost ? 'border-red-500' : ''
                }`}
              />
              {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex space-x-4">
              <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('status')}
                    value="PENDING"
                    className="form-radio"
                  />
                  <span className="ml-2">PENDING</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('status')}
                    value="PAID"
                    className="form-radio"
                  />
                  <span className="ml-2">PAID</span>
                </label>
              </div>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                {...register('notes')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={4}
              />
            </div>
            <div className="flex justify-between">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
              <div className={`flex ${!isEditing ? 'ml-auto' : ''}`}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}